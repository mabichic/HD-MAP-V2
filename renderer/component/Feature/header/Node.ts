import { idCheck } from "./FeatureHader";

export const LayerLnNodeHader = [
    { field: "ID",valueSetter: idCheck, },
    { field: "NumConLink" ,editable: false,},
    { field: "LinkID" ,editable: false,},
    { field: "PointXY" ,editable: false,},
]