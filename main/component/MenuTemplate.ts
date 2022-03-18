import { BrowserWindow, MenuItem, MenuItemConstructorOptions } from "electron";
import LoadAll from "./menu/file/LoadAll";
import LoadFile from "./menu/file/LoadFile";
export function HDMapMenu(mainWindow: BrowserWindow, store:any):Array<(MenuItemConstructorOptions) | (MenuItem)>{

  const menu: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
      {
        label: "File",
        submenu: [
          {
            label: "Load All",
            click:async () => LoadAll(mainWindow, store),
          },
          {
            label: "Load File",
            click: () => LoadFile(store),
          },
          {
            label: "GPS File Load",
            click: () => {},
          },
          {
            label: "GPS File Load",
            click: () => {},
          },
          { type: "separator" },
          {
            label: "Save All",
            click: () => {},
          },
          {
            label: "Save LANESIDE",
            click: () => {},
          },
          {
            label: "Save LinkNodeSet",
            click: () => {},
          },
          {
            label: "Save ROAD MARK",
            click: () => {},
          },
          {
            label: "Save ROAD LIGHT",
            click: () => {},
          },
          {
            label: "Save POI",
            click: () => {},
          },
        ],
      },
      {
        label: "Edit",
        submenu: [],
      },
      {
        label: "AddObject",
        submenu: [],
      },
    ];
   return menu
}
