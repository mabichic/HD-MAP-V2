import { BrowserWindow, dialog } from "electron";
import path from "path";
import Converter from "../../../common/Converter";
import { getExtensionOfFilename } from "../../../common/util";
import { LayerNames } from "../../../dto/dto";

export default function LoadFile(mainWindow: BrowserWindow, store: any) {
  mainWindow.webContents.send("ladingStart");
  let index = store.get("fileIndex");
  dialog
    .showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Text Files", extensions: ["txt"] }],
    })
    .then((results) => {
      if (!results.canceled) {
        // load("file", results.filePaths);
        let file = null;
        let dir = null;
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
        dir = path.dirname(results.filePaths[0]);
        file = path.basename(results.filePaths[0]);
        console.log(dir);
        console.log(file);
        LayerNames.forEach((layerNM) => {
            if (getExtensionOfFilename(file.toLowerCase()) === ".txt" && file.toUpperCase().includes(layerNM)) {
                Object.keys(dataSet.filePaths).forEach((key)=>{
                    if (key === layerNM ) dataSet.filePaths[key] = dir + "/" + file;
                  });
                  Converter(layerNM, index, dataSet["features"], dir + "/" + file);
            }
        });
        if (dataSet.features.length > 0) {
            mainWindow.webContents.send("load", dataSet);
            store.set("fileIndex", index + 1);
          }else{
            mainWindow.webContents.send("loadFail","해당 파일을 읽을 수 없습니다. 파일명 다시 확인해주세요.");
          }

      } else {
        mainWindow.webContents.send("ladingEnd");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
