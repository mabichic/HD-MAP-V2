import { Feature } from "ol";
import { featureService } from "../service/message.service";
import { getUnDoReDoIndex, setInitRedo, setUpUnDoReDoIndex, UndoPush } from "./UndoRedo";

export default function DeleteFeature(features: Array<Feature>) {
  features.forEach((feature) => {
    feature.get("source").removeFeature(feature);
    let ID = feature.get("ID");
    if (feature.get("group") === "LAYER_LN_LINK") {
      let sNodeId = feature.get("SNodeID");
      let eNodeId = feature.get("ENodeID");
      if (sNodeId !== "" && !isNaN(sNodeId) && sNodeId !== 0) {
        let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + sNodeId);
        let preFeature = node?.clone();
        node?.set(
          "LinkID",
          node?.get("LinkID").filter((element) => element !== ID)
        );
        node?.set("NumConLink", node?.get("LinkID").length);
        let nextFeature = node?.clone();
        UndoPush("UPDATE", node.get("source"), node, preFeature, nextFeature, getUnDoReDoIndex());
      }
      if (eNodeId !== "" && !isNaN(eNodeId) && eNodeId !== 0) {
        let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + eNodeId);
        let preFeature = node?.clone();
        node?.set(
          "LinkID",
          node?.get("LinkID").filter((element) => element !== ID)
        );
        node?.set("NumConLink", node?.get("LinkID").length);
        let nextFeature = node?.clone();
        UndoPush("UPDATE", node.get("source"), node, preFeature, nextFeature, getUnDoReDoIndex());
      }
    }
    if (feature.get("group") === "LAYER_LN_NODE") {
      feature.get("LinkID").forEach((linkId) => {
        let link = feature.get("source").getFeatureById("LAYER_LN_LINK" + feature.get("Index") + "_" + linkId);
        let preFeature = link.clone();
        if (link?.get("SNodeID") === ID) link?.set("SNodeID", "");
        if (link?.get("ENodeID") === ID) link?.set("ENodeID", "");
        let nextFeature = link?.clone();
        UndoPush("UPDATE", link.get("source"), link, preFeature, nextFeature, getUnDoReDoIndex());
      });
    }
    UndoPush("DELETE", feature.get("source"), feature, null, null, getUnDoReDoIndex());
  });
  featureService.selected("featureChange", null);
  setInitRedo();
  setUpUnDoReDoIndex();
}
