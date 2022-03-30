import { AgGridReact } from "ag-grid-react";
import {  useEffect, useRef, useState } from "react";

export default function FeatureGrid({ feature}) {
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
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
                rowData={feature}
                rowSelection={"single"}
                columnDefs={columnDefs}
                // onRowSelected={onRowSelected}
                ref={gridRef}
                getRowId={getRowNodeId}
            ></AgGridReact>
        </div>
    )
};