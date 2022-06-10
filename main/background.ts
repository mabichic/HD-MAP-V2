import { app, ipcMain, Menu } from "electron";
import serve from "electron-serve";
import { HDMapMenu } from "./component/MenuTemplate";
import SaveFile, { SaveAllFile } from "./component/SaveFile";
import { createWindow } from "./helpers";

const Store = require("electron-store");
Store.initRenderer();
const store = new Store();
store.set('fileIndex',0);
const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    title : "HD-MAP"
  });

  const menu = Menu.buildFromTemplate(HDMapMenu(mainWindow,store));
  Menu.setApplicationMenu(menu);
  ipcMain.on("fileSave", (event, res)=> SaveFile(mainWindow,event, res, store));
  ipcMain.on("allFileSave", (event, res)=> SaveAllFile(mainWindow,event, res, store));
  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});



ipcMain.handle("getStoreValue", (event, key) => {
  console.log(key);

  return store.get(key);
});
