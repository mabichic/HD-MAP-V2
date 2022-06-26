import { idCheck, numberCheck, pointXYCheck } from "./FeatureHader";

export const LayerPOIHader = [
    { field: "ID", valueParser: idCheck, },
    { field: "LinkID", valueParser :  numberCheck},
    { field: "Name"},
    { field: "PointXY", editable: true, cellEditor: "agLargeTextCellEditor", cellEditorPopup: true , valueParser: pointXYCheck},
]