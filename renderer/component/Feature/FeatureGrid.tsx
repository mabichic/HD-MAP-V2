import { Button, Divider, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import FeatureEditor from "./FeatureEditor";

export default function FeatureGrid({ feature }) {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const gridRef = useRef<any>();
    const [columnDefs] = useState([
        { field: "ID", filter: 'agNumberColumnFilter' },
        { field: "PointXY" },
        { field: "price" },
    ]);

    const getRowNodeId = (params) => {
        return params.data.ID;
    };

    useEffect(() => {
        return () => {

            console.log("컴포넌트 클린업");
        }
    }, [])

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
    return (

        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <FeatureEditor handleClose={handleClose} open={open} />
            <div style={{textAlign:'right', backgroundColor:'white', paddingTop:'5px'}}>
                <Button variant="outlined" onClick={handleOpen} color="secondary" size="small" style={{marginRight:'8px'}}>위치로 이동</Button>
                <Button variant="outlined" onClick={handleOpen} color="success" size="small" style={{marginRight:'8px'}}>선택 필드 수정</Button>
                <Button variant="outlined" onClick={handleOpen} color="error" size="small" style={{marginRight:'20px'}}>삭제</Button>
            </div>
            <div className="ag-theme-alpine" style={{ flexGrow: 1, width: '100%' , padding:'20px', paddingTop:'13px', backgroundColor:'white'}}>
                <AgGridReact
                    rowData={feature}
                    rowSelection={"multiple"}
                    columnDefs={columnDefs}
                    // onRowSelected={onRowSelected}
                    ref={gridRef}
                    getRowId={getRowNodeId}
                ></AgGridReact>
            </div>

        </div>
    )
};