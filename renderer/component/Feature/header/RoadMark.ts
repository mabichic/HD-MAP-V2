import { extractValues, idCheck, lookupValue, pointXYCheck, valueToArry } from "./FeatureHader";

export const roadmarkTypeMappings = {
  0: "TYPE_NONE",
  1: "RM_CROSSWALK",
  2: "RM_SPEEDBUMP",
  3: "RM_ARROW",
  4: "RM_NUMERIC",
  5: "RM_CHAR",
  6: "RM_SHAPE",
  7: "RM_STOPLINE",
  8: "RM_BUSSTOP",
  9: "RM_VIRTUAL_STOPLINE",
};
export const roadmarkSubTypeMappings = {
  0: "TYPE_NONE",
  1: "RM_ARROW_S",
  2: "RM_ARROW_L",
  3: "RM_ARROW_R",
  4: "RM_ARROW_SL",
  5: "RM_ARROW_SR",
  6: "RM_ARROW_U",
  7: "RM_ARROW_US",
  8: "RM_ARROW_UL",
  9: "RM_ARROW_LR",
  10: "RM_ARROW_FORBID_L",
  11: "RM_ARROW_FORBID_R",
  12: "RM_ARROW_FORBID_S",
  13: "RM_ARROW_FORBID_U",
  14: "RM_STOPLINE_UNSIGNED_INTERSECTION",
};
const stopLineIDCount = (params) => {
  return params.data.StopLineID.length;
};
const types = extractValues(roadmarkTypeMappings);
const subTypes = extractValues(roadmarkSubTypeMappings);
export const LayerRoadmarkHader = [
  { field: "ID", valueParser: idCheck, },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: types,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(roadmarkTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(roadmarkTypeMappings, params.value);
    },
  },
  {
    field: "SubType",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: subTypes,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(roadmarkSubTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(roadmarkSubTypeMappings, params.value);
    },
  },
  { field: "NumStopLine", editable: false, valueGetter: stopLineIDCount },
  {
    field: "StopLineID",

    valueParser: valueToArry,

  },
  { field: "NumPoint", editable: false },
  { field: "PointXY", editable: true, cellEditor: "agLargeTextCellEditor", cellEditorPopup: true , valueParser: pointXYCheck},
];
