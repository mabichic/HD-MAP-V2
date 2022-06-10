import { BrowserWindow, dialog } from "electron";
// const Store = require('electron-store');
import { readdirSync } from "fs";
import Converter from "../../../common/Converter";
import { getExtensionOfFilename } from "../../../common/util";
import { LayerNames } from "../../../dto/dto";

export default function LoadAll(mainWindow: BrowserWindow, store: any) {
  mainWindow.webContents.send("ladingStart");
  let index = store.get("fileIndex");
  dialog
    .showOpenDialog({
      properties: ["openFile", "openDirectory"],
    })
    .then((results) => {
      if (!results.canceled) {
        let files = [];
        let dir = results.filePaths[0];
        let dataSet = {
          type: "FeatureCollection",
          index: index,
          features: [],
          crs: { type: "name", properties: { name: "EPSG:5186" } },
          filePaths: {
            LAYER_ROADMARK: null,
            LAYER_ROADLIGHT: null,
            LAYER_LANESIDE: null,
            LAYER_POI: null,
            LAYER_LN_LINK: null,
            LAYER_LN_NODE: null,
            LAYER_SAFEPOINT: null,
          },
        };
        files = readdirSync(dir);
        files.forEach((file) => {
          LayerNames.forEach((layerNM) => {
            if (getExtensionOfFilename(file.toLowerCase()) === ".txt" && file.toUpperCase().includes(layerNM)) {

              /*
                폴더 열기시 같은 레이어 두개가 되면 문제가 생김 해결 해야함. 
              */
              Object.keys(dataSet.filePaths).forEach((key)=>{
                if (key === layerNM ) dataSet.filePaths[key] = dir + "/" + file;
              });
              Converter(layerNM, index, dataSet["features"], dir + "/" + file);
            }
          });
        });
        if (dataSet.features.length > 0) {
          mainWindow.webContents.send("load", dataSet);
          store.set("fileIndex", index + 1);
        }else{
          mainWindow.webContents.send("loadFail","레이어가 존재하지 않습니다.");
        }
      } else {
        mainWindow.webContents.send("ladingEnd");
      }
    });
}
