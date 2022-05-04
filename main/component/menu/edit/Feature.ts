import { BrowserWindow } from "electron";

export const FeatureCopy = (mainWindow: BrowserWindow, store: any,)=>{ 
    mainWindow.webContents.send("featureCopy");
}
export const FeaturePaste = (mainWindow: BrowserWindow, store: any,)=>{ 
    mainWindow.webContents.send("featurePaste");
}

export const FeatureDelete = (mainWindow: BrowserWindow, store: any,)=>{ 
    mainWindow.webContents.send("featureDelete");
}