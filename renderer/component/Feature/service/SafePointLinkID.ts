import { alertService, featureService } from "../../service/message.service";
export default function SafePointLinkID(params, subscription, source) {
  subscription = featureService.getMessage().subscribe((message) => {
    if (message.state === "linkIDSSelected") {
      if (source.getFeatureByUid(message.features[0].ol_uid) !== null) {
        if (params.value === message.features[0].get("ID")) {
          alertService.sendMessage("Error.", "이미 등록된 Link ID입니다.");
          message.select.getFeatures().clear();
          subscription.unsubscribe();
          params.api.stopEditing();
        } else {
          const instances = params.api.getCellEditorInstances();
          if (instances?.length > 0) {
            instances[0].eInput.value = message.features[0].get("ID");
          }
          message.select.getFeatures().clear();
          message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
          subscription.unsubscribe();
          params.api.stopEditing();
        }
      } else {
        alertService.sendMessage("Error.", "등록되지 않은 ID입니다. 해당 Link를 다시 확인해주세요. \n * 같은 레이어 셋이 아닌 객체의 ID는 등록 할 수 없습니다.");
        message.select.getFeatures().clear();
        message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
        params.api.stopEditing();
      }
    }
  });
}
