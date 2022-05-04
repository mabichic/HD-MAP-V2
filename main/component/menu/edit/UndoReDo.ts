import { BrowserWindow } from "electron";

export const Undo = (mainWindow: BrowserWindow, store: any,)=>{ 
    mainWindow.webContents.send("undo");
}
export const Redo = (mainWindow: BrowserWindow, store: any,)=>{ 
    mainWindow.webContents.send("redo");
}

