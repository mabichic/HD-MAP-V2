import { BrowserWindow, dialog } from "electron";
// const Store = require('electron-store');
import store from "electron-store";
import { readdirSync } from "fs";
import Converter from "../../../common/Converter";
import { getExtensionOfFilename } from "../../../common/util";

export default function LoadAll(mainWindow: BrowserWindow, store: any) {
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
          index : index,
          features: [],
          crs: { type: "name", properties: { name: "EPSG:5186" } },
        };
        files = readdirSync(dir);
        files.forEach((file) => {
          ["LAYER_LANESIDE", "LAYER_LN_LINK", "LAYER_LN_NODE", "LAYER_POI", "LAYER_ROADLIGHT", "LAYER_ROADMARK"].forEach(
            (layerNM: "LAYER_LANESIDE" | "LAYER_LN_LINK" | "LAYER_LN_NODE" | "LAYER_POI" | "LAYER_ROADLIGHT" | "LAYER_ROADMARK") => {
              if (getExtensionOfFilename(file.toLowerCase()) === ".txt" && file.toUpperCase().includes(layerNM)) {
                Converter(layerNM, dataSet['features'], dir + "/" + file);
              }
            }
          );
        });
        if(dataSet.features.length>0){
          mainWindow.webContents.send("load", dataSet);
          store.set("fileIndex", index+1);
        } 
      }
    });
}
