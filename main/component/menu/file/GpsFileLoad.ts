import { BrowserWindow, dialog } from "electron";
import path from "path";
import { ConverterGpsLog } from "../../../common/Converter";

export default function GpsFileLoad(mainWindow: BrowserWindow, store: any) {
  mainWindow.webContents.send("ladingStart");
  let index = store.get("fileIndex");
  let file = null;
  let dir = null;
  let dataSet = {
    type: "FeatureCollection",
    index: index,
    hdSet : false,
    features: [],
    crs: { type: "name", properties: { name: "EPSG:5186" } },
    filePaths: {
      GPS_LOG: null,
    },
  };
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "Text Files", extensions: ["txt"] },
        { name: "CSV Files", extensions: ["csv"] },
      ],
    })
    .then((results) => {
      if (!results.canceled) {
        dir = path.dirname(results.filePaths[0]);
        file = path.basename(results.filePaths[0]);
        let splitText = path.extname(file) === ".csv" ? "," : " ";
        ConverterGpsLog("GPS_LOG", index, dataSet["features"], dir + "/" + file, splitText);
        dataSet.filePaths['GPS_LOG'] = dir + "/" + file;
        mainWindow.webContents.send("gpsLoadSuccess", dataSet);
        if (dataSet.features.length > 0) {
          mainWindow.webContents.send("load", dataSet);
          store.set("fileIndex", index + 1);
        } else {
          mainWindow.webContents.send("loadFail", "GPS LOG 데이터가 존재하지 않습니다.");
        }
      } else {
        mainWindow.webContents.send("ladingEnd");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
