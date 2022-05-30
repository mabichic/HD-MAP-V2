import { idCheck, numberCheck } from "./FeatureHader";

export const LayerPOIHader = [
    { field: "ID", valueSetter: idCheck, },
    { field: "LinkID", valueParser :  numberCheck},
    { field: "Name"},
    { field: "PointXY" ,editable: false,},
]