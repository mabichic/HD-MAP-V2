import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function FeatureGrid({ feature, onRowSelected, viewer, filter }) {
    const gridRef = useRef<any>();
    const [columnDefs] = useState([
        { field: "ID", filter: 'agNumberColumnFilter' },
        { field: "PointXY" },
        { field: "price" },
    ]);
    const getRowNodeId = (params) => {
        return params.ID;
    };

    useEffect(() => {
    }, [])


    return (
        <AgGridReact
            rowData={feature}
            rowSelection={"single"}
            columnDefs={columnDefs}
            getRowNodeId={getRowNodeId}
            immutableData={true}
            onRowSelected={onRowSelected}
            undoRedoCellEditing={false}
            ref={gridRef}
        ></AgGridReact>
    )
};