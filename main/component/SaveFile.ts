import { BrowserWindow, IpcMainEvent } from "electron";
import { LAYER_LANESIDE_CONV, LAYER_LN_LINK_CONV, LAYER_LN_NODE_CONV, LAYER_POI_CONV, LAYER_ROADLIGHT_CONV, LAYER_ROADMARK_CONV, LAYER_SAFEPOINT_CONV } from "../dto/dto";
const fs = require("fs");

const convSet = {
  LAYER_LANESIDE: LAYER_LANESIDE_CONV,
  LAYER_LN_LINK: LAYER_LN_LINK_CONV,
  LAYER_LN_NODE: LAYER_LN_NODE_CONV,
  LAYER_POI: LAYER_POI_CONV,
  LAYER_ROADLIGHT: LAYER_ROADLIGHT_CONV,
  LAYER_ROADMARK: LAYER_ROADMARK_CONV,
  LAYER_SAFEPOINT: LAYER_SAFEPOINT_CONV,
};

const convResult = (data, type) => {
  let txt = "";
  data.forEach((x) => {
    let conv = new convSet[type](x);
    txt += conv.conv();
  });
  return txt;
};

export default function SaveFile(mainWindow: BrowserWindow,event: IpcMainEvent, res: resInterface, store: any) {
  let txts = convResult(res["obejcts"], res["type"]);
  try {
    fs.writeFileSync(`${res.path}_temp.txt`, txts, "utf8");
    mainWindow.webContents.send("saved");
  } catch (err) {
    mainWindow.webContents.send("saveFail", err);
  }
}
export function SaveAllFile(mainWindow: BrowserWindow,event: IpcMainEvent, res: Array<resInterface>, store: any) {
    console.log(res);
    res.forEach((object)=>{
        let txts = convResult(object["obejcts"], object["type"]);
        try {
            fs.writeFileSync(`${object.path}_temp.txt`, txts, "utf8");
        } catch (err) {
            mainWindow.webContents.send("saveFail", err);
        }
    });
    mainWindow.webContents.send("saved");
}
interface resInterface {
  type: any;
  path: any;
  obejcts: Array<Object>;
}

