import { extractValues, lookupValue } from "./FeatureHader";

const typeMappings = {
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
const subTypeMappings = {
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

const types = extractValues(typeMappings);
const subTypes = extractValues(subTypeMappings);
export const LayerRoadmarkHader = [
  { field: "ID" },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: types,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(typeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(typeMappings, params.value);
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
        return lookupValue(subTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(subTypeMappings, params.value);
    },
  },
  { field: "NumStopLine", editable: false  },
  { field: "StopLineID" },
  { field: "NumPoint", editable: false },
  { field: "PointXY", editable: false },
];
