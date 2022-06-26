import { extractValues, idCheck, lookupValue, numberCheck, pointXYCheck, valueToArry } from "./FeatureHader";

export const roadlightTypeMappings = {
  0: "TYPE_NONE",
  1: "RL_HOR",
  2: "RL_VIR",
};
export const roadlightSubTypeMappings = {
  0: "TYPE_NONE",
  1: "RL_2",
  2: "RL_3",
  3: "RL_4",
  4: "RL_5",
};
export const roadlightDivMappings = {
  0: "None",
  1: "GEN_RL",
  2: "BUS_RL",
  3: "FLASHING_RL",
};

const types = extractValues(roadlightTypeMappings);
const subTypes = extractValues(roadlightSubTypeMappings);
const divs = extractValues(roadlightDivMappings);

const stopLineIDCount = (params) => {
  return params.data.StopLineID.length;
};
export const LayerRoadlightHader = [
  { field: "ID", valueParser: idCheck, },
  { field: "LaneID", valueParser :  numberCheck },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: types,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(roadlightTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(roadlightTypeMappings, params.value);
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
        return lookupValue(roadlightSubTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(roadlightSubTypeMappings, params.value);
    },
  },
  {
    field: "Div",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: divs,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(roadlightDivMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(roadlightDivMappings, params.value);
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
