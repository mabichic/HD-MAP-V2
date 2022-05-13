import { extractValues, lookupValue, valueToArry } from "./FeatureHader";

const typeMappings = {
  0: "TYPE_NONE",
  1: "RL_HOR",
  2: "RL_VIR",
};
const subTypeMappings = {
  0: "TYPE_NONE",
  1: "RL_2",
  2: "RL_3",
  3: "RL_4",
  4: "RL_5",
};
const divMappings = {
  0: "None",
  1: "GEN_RL",
  2: "BUS_RL",
  3: "FLASHING_RL",
};

const types = extractValues(typeMappings);
const subTypes = extractValues(subTypeMappings);
const divs = extractValues(divMappings);

const stopLineIDCount = (params) => {
  console.log(params.data.StopLineID.length);
  return params.data.StopLineID.length;
};
export const LayerRoadlightHader = [
  { field: "ID" },
  { field: "LaneID" },
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
  {
    field: "Div",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: divs,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(divMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(divMappings, params.value);
    },
  },
  { field: "NumStopLine", editable: false, valueGetter: stopLineIDCount },
  {
    field: "StopLineID",
    // valueFormatter: function (params) {
    //   console.log(params.value);
    //   return valueToArry(params.value);
    // },
    valueSetter: valueToArry,

  },
  { field: "NumPoint", editable: false },
  { field: "PointXY", editable: false },
];
