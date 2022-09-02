import { ipcRenderer } from "electron";
import { alertService, loadingService } from "../../service/message.service";

export default function Save(type, item) {
  let keys = [];
  if (type === "all") {
    Object.keys(item.get("filePaths")).forEach((key) => {
      if (item.get("filePaths")[key] === null) return;
      else {
        keys.push(key);
      }
    });
  } else if (type === "LAYER_LN_LINK" || type === "LAYER_LN_NODE") {
    keys.push("LAYER_LN_LINK");
    keys.push("LAYER_LN_NODE");
  } else {
    keys.push(type);
  }
  let obejcts = [];
  let errorObject = [];
  let errorMessage = [];
  keys.forEach((key) => {
    let features = [];
    item
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        pushData(feature, key, features);
      });
    features.sort(fnSort);

    obejcts.push({ type: key, path: item.get("filePaths")[key], obejcts: features });
  });
  obejcts.forEach((obj) => {
    if (obj.type === "LAYER_LN_LINK") {
      linkValidation(obj.obejcts, errorMessage);
    }
    if (obj.type === "LAYER_LN_NODE") {
      nodeValidation(obj.obejcts, errorMessage);
    }
  });
  if (errorMessage.length > 0) {
    alertService.sendMessage("Error", errorMessage);
  } else {
    ipcRenderer.send("allFileSave", obejcts);
    loadingService.sendMessage(true);
  }
}

const linkValidation = (features: Array<any>, errorMessage: Array<any>) => {
  features.forEach((data) => {
    if (data.SNodeID === "" || isNaN(Number(data.SNodeID))) {
      errorMessage.push(`LINK ID : ${data.ID} 객체의 SNodeID가 없습니다.\n\r`);
    }
    if (data.ENodeID === "" || isNaN(Number(data.ENodeID))) {
      errorMessage.push(`LINK ID : ${data.ID} 객체의 ENodeID가 없습니다.\n\r`);
    }
  });
};
const nodeValidation = (features: any, errorMessage: Array<any>) => {
  features.forEach((data) => {
    if (data.NumConLink < 1) {
      errorMessage.push(`NODE ID : ${data.ID} 객체의 연결된 LINK가 없습니다.\r\n`);
    }
  });
};
const pushData = (feature: any, group: string, dataSet: Array<any>) => {
  if (feature.get("group") === group) {
    let data = feature.getProperties();
    data.featureID = feature.getId();
    delete data["source"];
    delete data["geometry"];
    delete data["featureID"];
    delete data["group"];
    dataSet.push(data);
  }
};
function fnSort(a: any, b: any) {
  return a["ID"] - b["ID"];
}
