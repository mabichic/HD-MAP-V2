import { idCheck, linkIdCheckNoSelf, numberCheck } from "./FeatureHader";

export const LayerSafepoint = [
    { field: "ID",valueSetter: idCheck, },
    { field: "QueryLinkID" , valueParser :  linkIdCheckNoSelf },
    { field: "InterLinkID" , valueParser :  linkIdCheckNoSelf },
    { field: "length" , valueParser :  numberCheck },
    { field: "PointXY" ,editable: false,},
]