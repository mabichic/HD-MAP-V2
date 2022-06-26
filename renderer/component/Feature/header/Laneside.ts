import { extractValues, idCheck, lookupKey, lookupValue, numberCheck, pointXYCheck } from "./FeatureHader";

export const colourMappings = {
  0: "LS_WHITE",
  1: "LS_YELLOW",
  2: "LS_BLUE",
};
export const lanesideTypeMappings = {
  1: "LS_SOLID",
  2: "LS_DOT",
  3: "LS_DOUBLE",
  4: "LS_BOUNDARY",
  5: "LS_VIRTUAL",
};

const lanesideColours = extractValues(colourMappings);
const lanesideTypes = extractValues(lanesideTypeMappings);

export const LayerLanesideHader = [
  { field: "ID", valueParser: idCheck },
  { field: "MID", valueParser: numberCheck },
  { field: "LaneID", valueParser: numberCheck },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: lanesideTypes,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(lanesideTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(lanesideTypeMappings, params.value);
    },
  },

  {
    field: "Color",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: lanesideColours,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(colourMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(colourMappings, params.value);
    },
    valueParser: function (params) {
      return lookupKey(colourMappings, params.newValue);
    },
  },
  { field: "NumPoint", editable: false },
  { field: "PointXY", editable: true, cellEditor: "agLargeTextCellEditor", cellEditorPopup: true , valueParser: pointXYCheck},
];
