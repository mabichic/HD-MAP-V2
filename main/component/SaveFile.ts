import { BrowserWindow, IpcMainEvent } from "electron";
import path from "path";
import {
  LAYER_LANESIDE_CONV,
  LAYER_LN_LINK_CONV,
  LAYER_LN_NODE_CONV,
  LAYER_POI_CONV,
  LAYER_ROADLIGHT_CONV,
  LAYER_ROADMARK_CONV,
  LAYER_SAFEPOINT_CONV,
} from "../dto/dto";
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

export default function SaveFile(
  mainWindow: BrowserWindow,
  event: IpcMainEvent,
  res: resInterface,
  store: any
) {
  let txts = convResult(res["obejcts"], res["type"]);
  try {
    let file = path.basename(res.path);
    let dir = path.dirname(res.path);
    const today = "backup" + new Date().getTime();
    const newDir = dir + "/" + today;
    fs.mkdirSync(newDir, { recursive: true });
    fs.rename(res.path, newDir + "/" + file, (e) => {
      if (e) {
        mainWindow.webContents.send("saveFail", e);
        throw e;
      }
    });
    fs.writeFileSync(`${res.path}`, txts, "utf8");
  } catch (err) {
    mainWindow.webContents.send("saveFail", err);
  }
  mainWindow.webContents.send("saved", "저장완료!");
}
export function SaveAllFile(
  mainWindow: BrowserWindow,
  event: IpcMainEvent,
  res: Array<resInterface>,
  store: any
) {
  const today = "backup" + new Date().getTime();
  res.forEach((object) => {
    let file = path.basename(object.path);
    let dir = path.dirname(object.path);

    const newDir = dir + "/" + today;

    fs.mkdirSync(newDir, { recursive: true });
    fs.rename(object.path, newDir + "/" + file, (e) => {
      if (e) {
        mainWindow.webContents.send("saveFail", e);
        throw e;
      }
    });

    let txts = convResult(object["obejcts"], object["type"]);
    try {
      fs.writeFileSync(`${object.path}`, txts, "utf8");
    } catch (err) {
      mainWindow.webContents.send("saveFail", err);
    }
  });
  mainWindow.webContents.send("saved", "저장완료!");
}
interface resInterface {
  type: any;
  path: any;
  obejcts: Array<Object>;
}
