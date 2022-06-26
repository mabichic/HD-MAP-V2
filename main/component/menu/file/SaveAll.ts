import { BrowserWindow } from "electron";
export default function SaveAll(mainWindow: BrowserWindow, store: any,) {
  mainWindow.webContents.send("saveAll");
}
