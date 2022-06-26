import { ipcRenderer } from "electron";
import { loadingService } from "../../service/message.service";

export default function Save(type, item) {
  console.log(type);
  console.log(item);
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
  ipcRenderer.send("allFileSave", obejcts);
  loadingService.sendMessage(true);
}

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
