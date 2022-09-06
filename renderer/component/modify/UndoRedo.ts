import { Collection, Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { featureService, loadingService } from "../service/message.service";
export const DRAW = "DRAW";
export const MODIFY = "MODIFY";
export const DELETE = "DELETE";
export const UPDATE = "UPDATE";

let UndoReDoIndex = 0;
export const getUnDoReDoIndex = () => {
  return UndoReDoIndex;
};
export const setUpUnDoReDoIndex = () => {
  UndoReDoIndex = UndoReDoIndex + 1;
};
export const setDownUnDoReDoIndex = () => {
  if (UndoReDoIndex < 1) return;
  UndoReDoIndex = UndoReDoIndex - 1;
};
export interface UndoRedoType {
  type: "DRAW" | "MODIFY" | "DELETE" | "UPDATE";
  source: VectorSource<any>;
  feature: Feature | null;
  prevFeature: Feature | null;
  nextFeautre: Feature | null;
  index: number | null;
}
export let undoDatas: Array<UndoRedoType | null> = [];
export let redoDatas: Array<UndoRedoType | null> = [];
export const setUndo = () => {
  let tempIndex = getUnDoReDoIndex() - 1;
  let datas = undoDatas.filter((item, idex) => {
    return item.index === tempIndex;
  });
  if (datas.length < 1) {
    loadingService.sendMessage(false);
    return;
  }
  undoDatas = undoDatas.filter((item, idex) => {
    return item.index !== tempIndex;
  });
  setDownUnDoReDoIndex();

  for (const data of datas) {
    redoDatas.push(data);
  }
  datas.reverse();
  for (const data of datas) {
    if (data.type === "DRAW") {
      data.source.removeFeature(data.feature);
    } else if (data.type === "UPDATE") {
      data.feature.setProperties(data.prevFeature.getProperties(), false);
    } else if (data.type === "MODIFY") {
      data.feature.setProperties(data.prevFeature.getProperties(), false);
      data.feature.setGeometry(data.prevFeature.getGeometry());
    } else if (data.type === "DELETE") {
      data.feature.get("source").addFeature(data.feature);
    }
  }
  loadingService.sendMessage(false);
  featureService.selected("featureChange", null);
};
export const setRedo = () => {
  let tempIndex = getUnDoReDoIndex();

  let datas = redoDatas.filter((item, idex) => {
    return item.index === tempIndex;
  });
  if (datas.length < 1) {
    loadingService.sendMessage(false);
    return;
  }
  redoDatas = redoDatas.filter((item, idex) => {
    return item.index !== tempIndex;
  });

  setUpUnDoReDoIndex();
  for (const data of datas) {
    undoDatas.push(data);
    if (data.type === "DRAW") {
      data.source.addFeature(data.feature);
    } else if (data.type === "UPDATE") {
      data.feature.setProperties(data.nextFeautre.getProperties(), false);
    } else if (data.type === "MODIFY") {
      data.feature.setProperties(data.nextFeautre.getProperties(), false);
      data.feature.setGeometry(data.nextFeautre.getGeometry());
    } else if (data.type === "DELETE") {
      data.source.removeFeature(data.feature);
    }
  }
  loadingService.sendMessage(false);
  featureService.selected("featureChange", null);
};

export const setInitRedo = () => {
  redoDatas.length = 0;
};

let startCheck = false;
let modifyUndoDatas: Array<UndoRedoType | null> = [];
export const setModifyStartUndo = (features: Collection<Feature | any>) => {
  features.forEach((feature) => {
    modifyUndoDatas.push({
      type: "MODIFY",
      index: null,
      feature: feature,
      nextFeautre: null,
      prevFeature: feature.clone(),
      source: feature.get("source"),
    });
  });
};
export const setModifyEndUndo = (
  array: Array<Feature>,
  updateArray: Array<UndoRedoType>
) => {
  if (modifyUndoDatas.length < 1) return; //이상태는 에러임
  let index = getUnDoReDoIndex();
  modifyUndoDatas.forEach((modifyUndoData) => {
    array.forEach((feature) => {
      if (modifyUndoData.feature === feature) {
        modifyUndoData.nextFeautre = feature.clone();
        modifyUndoData.index = index;
        undoDatas.push(modifyUndoData);
      }
    });
  });
  updateArray.forEach((array) => {
    undoDatas.push(array);
  });
  modifyUndoDatas.length = 0;
  setUpUnDoReDoIndex();
};

export const setCopyUndo = (
  array: Array<Feature>,
  updateArray: Array<UndoRedoType>
) => {
  if (array.length < 1) return;
  array.forEach((feature) => {
    undoDatas.push({
      type: "DRAW",
      index: getUnDoReDoIndex(),
      feature: feature,
      nextFeautre: null,
      prevFeature: null,
      source: feature.get("source"),
      // , feature.get("source"), feature, null, null, getUnDoReDoIndex() });
    });
  });
};
export const UndoPush = (
  type: "DRAW" | "MODIFY" | "DELETE" | "UPDATE",
  source: VectorSource<any>,
  feature: Feature,
  prevFeature: Feature | null,
  nextFeautre: Feature | null,
  index: number
) => {
  undoDatas.push({ type, source, feature, prevFeature, nextFeautre, index });
};
