import { idCheck, pointXYCheck } from "./FeatureHader";

export const LayerLnNodeHader = [
    { field: "ID",valueParser: idCheck, },
    { field: "NumConLink" ,editable: false,},
    { field: "LinkID" ,editable: false,},
    { field: "PointXY", editable: true, cellEditor: "agLargeTextCellEditor", cellEditorPopup: true , valueParser: pointXYCheck},
]