import { BrowserWindow } from "electron";

export default function Measure(mainWindow: BrowserWindow, store: any, checked: boolean) {
  if (checked) {
    mainWindow.webContents.send("measureStart");
  }else{
    mainWindow.webContents.send("measureEnd");
  }
}


export function MeasureClear(mainWindow: BrowserWindow, store: any) {
    mainWindow.webContents.send("measureClear");
}