import { BrowserWindow } from "electron";

export const AddObject = (mainWindow: BrowserWindow, store: any, type:"LAYER_LANESIDE" | "LAYER_POI" | "LAYER_LN_NODE" | "LAYER_LN_LINK" | "LAYER_ROADMARK" | "LAYER_ROADLIGHT")=>{ 
    mainWindow.webContents.send("addObject", type);
}