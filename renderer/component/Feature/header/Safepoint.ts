import {
  extractValues,
  idCheck,
  linkIdCheckNoSelf,
  lookupValue,
  numberCheck,
  pointXYCheck,
} from "./FeatureHader";

export const safePointTypeMappings = {
  0: "일반도로",
  1: "소도로",
  2: "우합류",
};
const safePointTypes = extractValues(safePointTypeMappings);
export const LayerSafepoint = [
  { field: "ID", valueParser: idCheck },
  {
    field: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: safePointTypes,
    },
    filterParams: {
      valueFormatter: function (params) {
        return lookupValue(safePointTypeMappings, params.value);
      },
    },
    valueFormatter: function (params) {
      return lookupValue(safePointTypeMappings, params.value);
    },
  },
  { field: "QueryLinkID", valueParser: linkIdCheckNoSelf },
  { field: "InterLinkID", valueParser: linkIdCheckNoSelf },
  { field: "length", valueParser: numberCheck },
  {
    field: "PointXY",
    editable: true,
    cellEditor: "agLargeTextCellEditor",
    cellEditorPopup: true,
    valueParser: pointXYCheck,
  },
];
