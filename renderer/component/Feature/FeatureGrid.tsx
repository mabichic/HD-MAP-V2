import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import VectorSource from "ol/source/Vector";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import MapContext from "../context/MapContext";
import { featureService, loadingService } from "../service/message.service";
import FeatureEditor from "./FeatureEditor";


interface FeatureGridProps {
    feature: Array<any>;
    source: VectorSource;
    columnDefs : Array<any>;
}

export default function FeatureGrid({ feature, source, columnDefs }: FeatureGridProps) {
    const map = useContext(MapContext);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const gridRef = useRef<any>();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    let subscription = null;

    const getRowNodeId = (params) => {
        return params.data.ID;
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
            console.log("컴포넌트 클린업");
            setGridApi(null);
        }
    }, [])

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

    const onCellEditingStarted  = (params) =>{
        if(params.colDef.field==="StopLineID"){
            subscription = featureService.getMessage().subscribe(message => {
                if(message.state==="stopIDSSelected"){
                    if(source.getFeatureByUid(message.features[0].ol_uid)!==null){
                        if(!params.value.includes(params.value)){
                            params.value.push(message.features[0].get("ID"));
                            params.api.stopEditing();
                            params.api.refreshCells();
                            subscription.unsubscribe();
                            message.select.getFeatures().clear();
                        }else{
                            // console.log("중복된 객체");
                        }
                    }else{
                        // console.log("객체 음슴");
                    }       
                }
            });
        }
    }
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
                    // ref={gridRef}
                    // getRowId={getRowNodeId}
                    onCellEditingStarted={onCellEditingStarted}
                />
            </div>

        </div>
    )
};