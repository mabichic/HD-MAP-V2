import { getUnDoReDoIndex, UndoPush } from "../../modify/UndoRedo";
import { alertService, featureService } from "../../service/message.service";

export default function LinkID(params, subscription, source) {
  subscription = featureService.getMessage().subscribe((message) => {
    if (message.state === "linkIDSSelected") {
      if (source.getFeatureByUid(message.features[0].ol_uid) !== null) {
        if (params.node.data.ID === message.features[0].get("ID")) {
          alertService.sendMessage(
            "Error.",
            "자기 자신을 Link ID로 등록 할 수 없습니다."
          );
          message.select.getFeatures().clear();
          subscription.unsubscribe();
          params.api.stopEditing();
        } else if (params.value === message.features[0].get("ID")) {
          alertService.sendMessage("Error.", "이미 등록된 Link ID입니다.");
          message.select.getFeatures().clear();
          subscription.unsubscribe();
          params.api.stopEditing();
        } else {
          const instances = params.api.getCellEditorInstances();

          if (instances?.length > 0) {
            if (params.data[params.colDef.field] !== 0) {
              let oldF = params.data.source.getFeatureById(
                params.data.group +
                  params.data.Index +
                  "_" +
                  params.data[params.colDef.field]
              );
              let oldTarget = oldF;
              let oldPrevTarget = oldF.clone();
              if (params.colDef.field === "RLinkID") {
                oldF.set("LLinkID", 0);
              } else if (params.colDef.field === "LLinkID") {
                oldF.set("RLinkID", 0);
              }
              let oldNextTarget = oldF.clone();
              UndoPush(
                "UPDATE",
                oldTarget.get("source"),
                oldTarget,
                oldPrevTarget,
                oldNextTarget,
                getUnDoReDoIndex()
              );
            }

            let f = message.features[0];
            let target = f;
            let prevTarget = f.clone();
            if (params.colDef.field === "RLinkID") {
              f.set("LLinkID", params.data.ID);
            } else if (params.colDef.field === "LLinkID") {
              f.set("RLinkID", params.data.ID);
            }

            instances[0].eInput.value = message.features[0].get("ID");

            let nextTarget = f.clone();
            UndoPush(
              "UPDATE",
              target.get("source"),
              target,
              prevTarget,
              nextTarget,
              getUnDoReDoIndex()
            );
          }
          message.select.getFeatures().clear();
          message.select
            .getFeatures()
            .push(source.getFeatureById(params.data.featureID));
          subscription.unsubscribe();
          params.api.stopEditing();
        }
      } else {
        alertService.sendMessage(
          "Error.",
          "등록되지 않은 ID입니다. 해당 Link를 다시 확인해주세요. \n * 같은 레이어 셋이 아닌 객체의 ID는 등록 할 수 없습니다."
        );
        message.select.getFeatures().clear();
        message.select
          .getFeatures()
          .push(source.getFeatureById(params.data.featureID));
        params.api.stopEditing();
      }
    }
  });
}
