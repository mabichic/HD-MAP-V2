import {
  extractValues,
  idCheck,
  linkIdCheck,
  linkIdCheck0Permit,
  lookupValue,
  numberCheck,
  pointXYCheck,
} from "./FeatureHader";

export const linkTypeMappings = {
  0: "TYPE_NONE",
  1: "GEN_S",
  2: "JUN_S",
  3: "JUN_L",
  4: "JUN_R",
  5: "JUN_U",
  6: "POCKET_L",
  7: "POCKET_R",
};
export const linkSubTypeMappings = {
  0: "TYPE_NONE",
  1: "GEN",
  2: "BUS_ONLY",
  3: "HIGHPASS",
  4: "TURNAL",
};
export const linkTwowayMappings = {
  0: "일방",
  1: "양방향",
};

const linkTypes = extractValues(linkTypeMappings);
const linkSubTypes = extractValues(linkSubTypeMappings);
const linkTwowayTypes = extractValues(linkTwowayMappings);

export const LayerLnLinkHader = [
  { field: "ID", valueParser: idCheck },
  { field: "MID", valueParser: numberCheck },
  { field: "LID", valueParser: numberCheck },
  { field: "RID", valueParser: numberCheck },
  { field: "InMID", valueParser: numberCheck },
  { field: "InLID", valueParser: numberCheck },
  { field: "InRID", valueParser: numberCheck },
  { field: "outMID", valueParser: numberCheck },
  { field: "outLID", valueParser: numberCheck },
  { field: "outRID", valueParser: numberCheck },
  { field: "Junction", valueParser: numberCheck },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: linkTypes,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(linkTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(linkTypeMappings, params.value);
    },
  },
  {
    field: "SubType",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: linkSubTypes,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(linkSubTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(linkSubTypeMappings, params.value);
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
        return lookupValue(linkTwowayMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(linkTwowayMappings, params.value);
    },
  },
  { field: "RLID", valueParser: numberCheck },
  { field: "LLinkID", valueParser: linkIdCheck0Permit },
  { field: "RLinkID", valueParser: linkIdCheck0Permit },
  { field: "SNodeID", editable: false },
  { field: "ENodeID", editable: false },
  { field: "Speed", valueParser: numberCheck },
  { field: "NumPoint", editable: false },
  {
    field: "PointXY",
    editable: true,
    cellEditor: "agLargeTextCellEditor",
    cellEditorPopup: true,
    valueParser: pointXYCheck,
  },
];
