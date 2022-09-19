import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { LineString } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MapContext from "../context/MapContext";
import DeleteFeature from "../modify/Delete";
import ReverseFeature from "../modify/Reverse";
import { getUnDoReDoIndex, setUpUnDoReDoIndex, UndoPush } from "../modify/UndoRedo";
import { alertService, confrimValueService, featureService, loadingService } from "../service/message.service";
import FeatureEditor from "./FeatureEditor";
import LinkID from "./service/LinkID";
import SafePointLinkID from "./service/SafePointLinkID";
import StopLineID from "./service/StopLineID";


interface FeatureGridProps {
    feature: Array<any>;
    source: VectorSource;
    columnDefs: Array<any>;
    type: string;
    visible: boolean;
}

const exclusionFieldList = ['ID', 'PointXY', 'NumPoint', 'LID', 'RID', 'InMID', 'InLID', 'InRID', 'outMID', 'outLID', 'outRID', 'RLID', 'LLinkID', 'RLinkID', 'SNodeID', 'ENodeID', 'NumConLink', 'LinkID', 'NumStopLine', 'StopLineID','InterLinkID','QueryLinkID'];

export default function FeatureGrid({
    feature,
    source, columnDefs, type, visible }: FeatureGridProps) {
    const map = useContext(MapContext);
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState([]);
    const handleClose = () => setOpen(false);

    const gridRef = useRef<any>();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    let subscription = null;

    const handleOpen = useCallback(() => {

        if (gridRef.current.api.getSelectedNodes().length < 1) {
            alertService.sendMessage("Error.", "선택된 객체가 없습니다.");
            return;
        } else {

            setFields(gridRef.current.api.getColumnDefs().filter((field) => {
                return !exclusionFieldList.includes(field.colId);
            }))

            if (gridRef.current.api.getColumnDefs().filter((field) => {
                return !exclusionFieldList.includes(field.colId);
            }).length < 1) {
                alertService.sendMessage("Error.", "수정 할 수 있는 필드가 없습니다.");
                return;
            }

            setOpen(true);
        }
    }, [gridRef]);
    const selectAll = useCallback(() => {
        gridRef.current!.api.forEachNode(function (node) {
            node.setSelected(true);
        });
    }, [gridRef]);
    const deselectAll = useCallback(() => {
        gridRef.current!.api.forEachNode(function (node) {
            node.setSelected(false);
        });
    }, [gridRef]);
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
    const deleteFeature = useCallback(() => {
        let feautes = [];
        gridApi.getSelectedRows().forEach((row) => {
            feautes.push(row.featureID);
        });
        if (feautes.length < 1) {
            alertService.sendMessage("Error.", `선택하신 객체가 없습니다.`);
            return;
        }
        let filteredFeatures = source.getFeatures().filter(fea => {
            return feautes.includes(fea.getId());
        });
        confrimValueService.sendMessage("객체 제거", feautes.length + " 개의 객체를 정말 제거 하시겠습니까?", DeleteFeature, null, filteredFeatures, null);

    }, [gridApi]);
    const lineReverse = useCallback(()=>{
        let feautes = [];
        gridApi.getSelectedRows().forEach((row)=>{
            feautes.push(row.featureID);
        });
        if (feautes.length < 1) {
            alertService.sendMessage("Error.", `선택하신 객체가 없습니다.`);
            return;
        }
        let filteredFeatures = source.getFeatures().filter(fea => {
            return feautes.includes(fea.getId());
        });
        confrimValueService.sendMessage("객체 리버스", feautes.length + " 개의 객체를 정말 리버스 하시겠습니까?", ReverseFeature, null, filteredFeatures, null);
    }, [gridApi]);
    useEffect(() => {
        loadingService.sendMessage(true);
        return () => {
            loadingService.sendMessage(false);
            if (subscription !== null) subscription.unsubscribe();

        };
    }, [])

    useEffect(() => {
        return () => {
            gridApi?.destroy();
        };
    }, [gridApi]);

    useEffect(() => {
        return () => {

            if (!visible && gridApi) gridApi.stopEditing();
        }
    }, [visible, gridApi])
    const zoomToFeatures = () => {
        let feautes = [];
        gridApi.getSelectedRows().forEach((row) => {
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
        if (params.colDef.field === "StopLineID") {
            StopLineID(params, subscription, source);
        } else if (params.colDef.field === "RLinkID" || params.colDef.field === "LLinkID") {
            LinkID(params, subscription, source);
        } else if (params.colDef.field === "QueryLinkID" || params.colDef.field === "InterLinkID") {
            SafePointLinkID(params, subscription, source);
        }
    }
    const onCellEditingStopped = (e) => {
        if (subscription !== null) subscription.unsubscribe();
        if (e.oldValue === e.newValue) return;
        if (typeof e.newValue === "undefined") return;

        // const dataId = e.colDef.field === "ID" ? e.oldValue : e.node.data.ID;

        let feature = source.getFeatureById(e.data.featureID);
        let prevFeature = feature.clone();
        let data = { field: e.colDef.field, data: e.newValue };
        if (e.colDef.field === "StopLineID") {
            data = { field: e.colDef.field, data: e.newValue };
            feature.set("NumStopLine", data.data.length);
        }


        console.log(e.data.group);
        if(e.data.group==="LAYER_LN_NODE"&& e.colDef.field === "ID"){
            if(feature.get("LinkID").length>0){
                let datas: Array<any> = e.data.source.getFeatures().filter((feature) => {
                    return e.data.LinkID?.includes(feature.get("ID")) && feature.get("group")==="LAYER_LN_LINK";
                });
                datas.forEach((f) => {
                    let target = f;
                    let prevTarget = f.clone();
                    if(f.get("SNodeID")===e.oldValue) f.set("SNodeID", e.newValue);
                    else if(f.get("ENodeID")===e.oldValue) f.set("ENodeID", e.newValue);
                    let nextTarget = f.clone(); 
                    UndoPush("UPDATE", target.get("source"), target, prevTarget, nextTarget, getUnDoReDoIndex());
                })
            }
        }
        if(e.data.group==="LAYER_LN_LINK"&& e.colDef.field === "ID"){
            let sNodeId = e.data.SNodeID;
            let eNodeId = e.data.ENodeID;
                if (sNodeId !== "" && !isNaN(sNodeId) && sNodeId !== 0) {
                    let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + sNodeId);
                    let prevTarget = node?.clone();
                    node?.set(
                      "LinkID",[...node?.get("LinkID").filter((element) => element !== e.oldValue), e.newValue]
                    );
                    let nextTarget = node?.clone();
                    UndoPush("UPDATE", node.get("source"), node, prevTarget, nextTarget, getUnDoReDoIndex());
                  }
                  if (eNodeId !== "" && !isNaN(eNodeId) && eNodeId !== 0) {
                    let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + eNodeId);
                    let prevTarget = node?.clone();
                    node?.set(
                      "LinkID",[...node?.get("LinkID").filter((element) => element !== e.oldValue), e.newValue]
                    );
                    let nextTarget = node?.clone();
                    UndoPush("UPDATE", node.get("source"), node, prevTarget, nextTarget, getUnDoReDoIndex());
                  }   
        }
        if (e.data.group === "LAYER_ROADMARK" && e.colDef.field === "Type" && e.oldValue === 7) {
            let datas: Array<any> = e.data.source.getFeatures().filter((feature) => {
                return feature.get("StopLineID")?.includes(e.data.ID);
            });
            datas.forEach((f) => {
                let target = f;
                let prevTarget = f.clone();
                f.set("StopLineID", f.get("StopLineID").filter((id) => { return id != e.data.ID; }));
                f.set("NumStopLine", f.get("StopLineID").length);
                let nextTarget = f.clone();
                UndoPush("UPDATE", target.get("source"), target, prevTarget, nextTarget, getUnDoReDoIndex());
                // featureService.selected("featureChange", null);
            })
        }
        feature.set(data.field, data.data);
        let nextFeautre = feature.clone();
        // feature.setProperties
        UndoPush("UPDATE", feature.get("source"), feature, prevFeature, nextFeautre, getUnDoReDoIndex());
        setUpUnDoReDoIndex();
        featureService.selected("featureChange", null);

        // mapService.changeObject(dataKey, dataId, data);
    };
    
    return (

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {open &&
                <FeatureEditor handleClose={handleClose} open={open} fields={fields} gridRef={gridRef} source={source} type={type} />
            }
            <div style={{ textAlign: 'right', backgroundColor: 'white', paddingTop: '5px' }}>
                <Button variant="outlined" onClick={selectAll} color="inherit" size="small" style={{ marginRight: '8px' }}>전체 선택</Button>
                <Button variant="outlined" onClick={deselectAll} color="inherit" size="small" style={{ marginRight: '8px' }}>전체 선택해제</Button>
                <Button variant="outlined" onClick={zoomToFeatures} color="secondary" size="small" style={{ marginRight: '8px' }}>위치로 이동</Button>
                <Button variant="outlined" onClick={handleOpen} color="success" size="small" style={{ marginRight: '8px' }}>선택 필드 수정</Button>
                {type==="layerLnLink"&&
                <Button variant="outlined" onClick={lineReverse} color="success" size="small" style={{ marginRight: '8px' }}>Line Reverse</Button>
                }
                
                <Button variant="outlined" onClick={deleteFeature} color="error" size="small" style={{ marginRight: '20px' }}>삭제</Button>
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