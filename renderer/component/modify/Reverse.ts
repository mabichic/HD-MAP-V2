import { Collection, Feature } from "ol";
import { LineString } from "ol/geom";
import ModifyEnd from "./ModifyEnd";
import {
  getUnDoReDoIndex,
  setModifyEndUndo,
  setModifyStartUndo,
  UndoPush,
} from "./UndoRedo";

export function divisionReverse(arr, n): Array<Array<number>> {
  let len = arr.length;
  let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  let tmp = [];

  for (let i = 0; i < cnt; i++) {
    tmp.push(arr.splice(0, n));
  }
  let tmpReversed = tmp.reverse();

  let returnTmpValue: Array<number> = [];

  for (let i = 0; i < tmpReversed.length; i++) {
    for (let l = 0; l < n; l++) {
      returnTmpValue.push(tmpReversed[i][l]);
    }
  }

  return tmpReversed;
  // return tmp;
}

export default function ReverseFeature(features: Array<Feature>) {
  let modifyFeatures = new Collection(features);
  setModifyStartUndo(modifyFeatures);
  features.forEach((fea) => {
    let feature: any = fea.getGeometry();
    let tmpCoord = divisionReverse(feature.flatCoordinates, 2);
    feature.setCoordinates(tmpCoord);
    // let ID = feature.get("ID");
    // let sNodeId = feature.get("SNodeID");
    //   let eNodeId = feature.get("ENodeID");

    //   if (sNodeId !== "" && !isNaN(sNodeId) && sNodeId !== 0) {
    //     let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + sNodeId);
    //     let preFeature = node?.clone();
    //     node?.set(
    //       "LinkID",
    //       node?.get("LinkID").filter((element) => element !== ID)
    //     );
    //     node?.set("NumConLink", node?.get("LinkID").length);
    //     let nextFeature = node?.clone();
    //     UndoPush("UPDATE", node.get("source"), node, preFeature, nextFeature, getUnDoReDoIndex());
    //   }
  });
  ModifyEnd({ features: modifyFeatures });
}
