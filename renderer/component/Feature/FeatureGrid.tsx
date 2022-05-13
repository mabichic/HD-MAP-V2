import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import VectorSource from "ol/source/Vector";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import MapContext from "../context/MapContext";
import { getUnDoReDoIndex, setUpUnDoReDoIndex, UndoPush } from "../modify/UndoRedo";
import { alertService, featureService, loadingService } from "../service/message.service";
import FeatureEditor from "./FeatureEditor";


interface FeatureGridProps {
    feature: Array<any>;
    source: VectorSource;
    columnDefs: Array<any>;
}

export default function FeatureGrid({
    feature,
    source, columnDefs }: FeatureGridProps) {
    const map = useContext(MapContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const gridRef = useRef<any>();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    let subscription = null;

    const getRowNodeId = (params) => {
        return params.data.featureID;
    };
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            filter: true,
            editable: true,
            minWidth: 150,
        };
    }, []);
    useEffect(() => {
        loadingService.sendMessage(true);
        return () => {
            loadingService.sendMessage(false);
            if (subscription !== null) subscription.unsubscribe();

        };
    }, [])

    useEffect(() => {
        console.log(gridApi);
        gridApi
        return () => {
            gridApi?.destroy();
        };
    }, [gridApi]);

    const zoomToFeatures = () => {
        let feautes = [];
        gridApi.getSelectedRows().forEach((row) => {
            console.log(row);
            feautes.push(row.featureID);
        });
        if (feautes.length < 1) return;

        let filteredFeatures = source.getFeatures().filter(fea => {
            return feautes.includes(fea.getId());
        });
        let tempSource = new VectorSource({
            features: filteredFeatures
        });

        let vectorExtent = tempSource.getExtent();
        map.getView().fit(vectorExtent);
    }

    const onGridReady = (params) => {
        console.log(params);
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        loadingService.sendMessage(false);
    };
    feature.sort(function (a, b) {
        if (a.ID > b.ID) {
            return 1;
        }
        if (a.ID < b.ID) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    const onCellEditingStarted = (params) => {
        console.log(params);
        if (params.colDef.field === "StopLineID") {
            subscription = featureService.getMessage().subscribe(message => {
                if (message.state === "stopIDSSelected") {
                    if (source.getFeatureByUid(message.features[0].ol_uid) !== null) {
                        console.log(params);
                        if (params.node.data.group === "LAYER_ROADMARK" && params.node.data.ID === message.features[0].get("ID")) {
                            alertService.sendMessage("Error.", "자기 자신을 Stop Line ID로 등록 할 수 없습니다.");
                            message.select.getFeatures().clear();
                            subscription.unsubscribe();
                            params.api.stopEditing();
                        } else if (!params.value.includes(message.features[0].get("ID"))) {
                            // params.data.StopLineID.push(message.features[0].get("ID"));
                            // params.api.refreshCells();
                            //[...params.value,message.features[0].get("ID")]
                            const instances = params.api.getCellEditorInstances();

                            if (instances?.length > 0) {
                                console.log(instances[0]);
                                instances[0].eInput.value = [...params.api.getValue(params.colDef.field, params), message.features[0].get("ID")].sort((a, b) => { return a - b; }).join(",")

                            }
                            subscription.unsubscribe();
                            message.select.getFeatures().clear();
                            message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
                            params.api.stopEditing();

                        } else {
                            alertService.sendMessage("Error.", "이미 등록된 Stop Line ID 입니다");
                            message.select.getFeatures().clear();
                            message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
                            params.api.stopEditing();
                            subscription.unsubscribe();
                        }
                    } else {
                        alertService.sendMessage("Error.", "등록되지 않은 ID입니다. 해당 RoadMark를 다시 확인해주세요.");
                        message.select.getFeatures().clear();
                        message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
                        params.api.stopEditing();
                    }
                }
            });
        }
    }
    const onCellEditingStopped = (e) => {
        if (e.oldValue === e.newValue) return;
        const dataId = e.colDef.field === "ID" ? e.oldValue : e.node.data.ID;
        
        let feature = source.getFeatureById(e.data.featureID);
        let prevFeature = feature.clone();
        let data = { field: e.colDef.field, data: e.newValue };
        
        if (e.colDef.field === "StopLineID") {
            data = { field: e.colDef.field, data: [e.newValue] };
            feature.set("NumStopLine", e.data.StopLineID.length);
        }
        feature.set(data.field, data.data);
        let nextFeautre = feature.clone();
        // feature.setProperties
        UndoPush("UPDATE", feature.get("source"), feature, prevFeature, nextFeautre, getUnDoReDoIndex());
        setUpUnDoReDoIndex();
        console.log(e);
        // mapService.changeObject(dataKey, dataId, data);
    };

    return (

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <FeatureEditor handleClose={handleClose} open={open} />
            <div style={{ textAlign: 'right', backgroundColor: 'white', paddingTop: '5px' }}>
                <Button variant="outlined" onClick={zoomToFeatures} color="secondary" size="small" style={{ marginRight: '8px' }}>위치로 이동</Button>
                <Button variant="outlined" onClick={handleOpen} color="success" size="small" style={{ marginRight: '8px' }}>선택 필드 수정</Button>
                <Button variant="outlined" onClick={handleOpen} color="error" size="small" style={{ marginRight: '20px' }}>삭제</Button>
            </div>
            <div className="ag-theme-alpine" style={{ flexGrow: 1, width: '100%', padding: '20px', paddingTop: '13px', backgroundColor: 'white' }}>
                <AgGridReact
                    rowData={feature}
                    rowSelection={'multiple'}
                    rowMultiSelectWithClick={true}
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    // onRowSelected={onRowSelected}
                    onGridReady={onGridReady}
                    ref={gridRef}
                    getRowId={getRowNodeId}
                    onCellEditingStarted={onCellEditingStarted}
                    onCellEditingStopped={onCellEditingStopped}
                />
            </div>

        </div>
    )
};