import { extractValues, idCheck, linkIdCheck, lookupValue, numberCheck } from "./FeatureHader";

const typeMappings = {
  0: "TYPE_NONE",
  1: "GEN_S",
  2: "JUN_S",
  3: "JUN_L",
  4: "JUN_R",
  5: "JUN_U",
  6: "POCKET_L",
  7: "POCKET_R",
  8: "JUN_UNPROTECTED_S",
  9: "JUN_UNPROTECTED_L",
  10: "JUN_UNPROTECTED_R",
};
const subTypeMappings = {
  0: "TYPE_NONE",
  1: "GEN",
  2: "BUS_ONLY",
  3: "HIGHPASS",
  4: "TURNAL",
};
const twowayMappings = {
  0: "일방",
  1: "양방향",
};

const linkTypes = extractValues(typeMappings);
const linkSubTypes = extractValues(subTypeMappings);
const linkTwowayTypes = extractValues(twowayMappings);

export const LayerLnLinkHader = [
  { field: "ID", valueSetter: idCheck,},
  { field: "MID", valueParser :  numberCheck },
  { field: "LID", valueParser :  numberCheck },
  { field: "RID", valueParser :  numberCheck },
  { field: "InMID", valueParser :  numberCheck },
  { field: "InLID", valueParser :  numberCheck },
  { field: "InRID", valueParser :  numberCheck },
  { field: "outMID", valueParser :  numberCheck },
  { field: "outLID", valueParser :  numberCheck },
  { field: "outRID", valueParser :  numberCheck },
  { field: "Junction", valueParser :  numberCheck },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: linkTypes,
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
    field: "Sub_Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: linkSubTypes,
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
    field: "Twoway",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: linkTwowayTypes,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(twowayMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(twowayMappings, params.value);
    },
  },
  { field: "RLID", valueParser :  numberCheck },
  { field: "LLinkID", valueParser :  linkIdCheck },
  { field: "RLinkID", valueParser :  linkIdCheck },
  { field: "SNodeID" ,editable: false,},
  { field: "ENodeID" ,editable: false,},
  { field: "Speed", valueParser :  numberCheck },
  { field: "NumPoint" ,editable: false,},
  { field: "PointXY" ,editable: false,},
];
