import { alertService, featureService } from "../../service/message.service";

export default function StopLineID(params,subscription, source) {
    subscription = featureService.getMessage().subscribe((message) => {
      if (message.state === "stopIDSSelected") {
        if (source.getFeatureByUid(message.features[0].ol_uid) !== null) {
          if (params.node.data.group === "LAYER_ROADMARK" && params.node.data.ID === message.features[0].get("ID")) {
            alertService.sendMessage("Error.", "자기 자신을 Stop Line ID로 등록 할 수 없습니다.");
            message.select.getFeatures().clear();
            subscription.unsubscribe();
            params.api.stopEditing();
          } else if (!params.value.includes(message.features[0].get("ID"))) {
            const instances = params.api.getCellEditorInstances();
            if (instances?.length > 0) {
              instances[0].eInput.value = [...params.api.getValue(params.colDef.field, params), message.features[0].get("ID")]
                .sort((a, b) => {
                  return a - b;
                })
                .join(",");
            }
            
            subscription.unsubscribe();
            message.select.getFeatures().clear();
            message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
            params.api.stopEditing();
          } else {
  
            alertService.sendMessage("Error.", "이미 등록된 Stop Line ID 입니다");
            message.select.getFeatures().clear();
            message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
            params.api.stopEditing();
            subscription.unsubscribe();
          }
        } else {
          alertService.sendMessage("Error.", "등록되지 않은 ID입니다. 해당 RoadMark를 다시 확인해주세요. \n * 같은 레이어 셋이 아닌 객체의 ID는 등록 할 수 없습니다.");
          message.select.getFeatures().clear();
          message.select.getFeatures().push(source.getFeatureById(params.data.featureID));
          params.api.stopEditing();
        }
      }
    });
}
