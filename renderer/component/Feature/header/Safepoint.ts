import { idCheck, linkIdCheckNoSelf, numberCheck, pointXYCheck } from "./FeatureHader";

export const LayerSafepoint = [
    { field: "ID",valueParser: idCheck, },
    { field: "QueryLinkID" , valueParser :  linkIdCheckNoSelf },
    { field: "InterLinkID" , valueParser :  linkIdCheckNoSelf },
    { field: "length" , valueParser :  numberCheck },
    { field: "PointXY", editable: true, cellEditor: "agLargeTextCellEditor", cellEditorPopup: true , valueParser: pointXYCheck},
]