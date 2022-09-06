import { BrowserWindow } from "electron";
import { AddObject } from "./menu/AddObject/AddObject";
import { FeatureCopy, FeatureDelete, FeaturePaste } from "./menu/edit/Feature";
import Measure, { MeasureClear } from "./menu/edit/Measure";
import { Redo, Undo } from "./menu/edit/UndoReDo";
import GpsFileLoad from "./menu/file/GpsFileLoad";
import LoadAll from "./menu/file/LoadAll";
import LoadFile from "./menu/file/LoadFile";
import SaveAll from "./menu/file/SaveAll";
export function HDMapMenu(
  mainWindow: BrowserWindow,
  store: any
): (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] {
  const menu: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
    // (Electron.MenuItemConstructorOptions | Electron.MenuItem)[])
    {
      label: "File",
      submenu: [
        {
          label: "Load All",
          click: async () => LoadAll(mainWindow, store),
          accelerator: "ctrl+o",
        },
        {
          label: "Load File",
          click: () => LoadFile(mainWindow, store),
          accelerator: "ctrl+k",
        },
        {
          label: "GPS File Load",
          click: () => {
            GpsFileLoad(mainWindow, store);
          },
        },
        { type: "separator" },
        {
          label: "Save All",
          click: () => {
            SaveAll(mainWindow, store);
          },
          accelerator: "ctrl+s",
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          click: (e) => {
            Undo(mainWindow, store);
          },
          accelerator: "ctrl+z",
        },
        {
          label: "Redo",
          click: (e) => {
            Redo(mainWindow, store);
          },
          accelerator: "ctrl+y",
        },
        { type: "separator" },
        {
          label: "Measure",
          click: (e) => {
            Measure(mainWindow, store, e.checked);
          },
          type: "checkbox",
          checked: false,
          accelerator: "ctrl+t",
        },
        {
          label: "Measure Clear",
          click: (e) => {
            MeasureClear(mainWindow, store);
          },
          accelerator: "ctrl+g",
        },
        { type: "separator" },
        {
          label: "Feature Copy",
          click: (e) => {
            FeatureCopy(mainWindow, store);
          },
          accelerator: "CmdOrCtrl+Shift+C",
        },
        {
          label: "Feature Paste",
          click: (e) => {
            FeaturePaste(mainWindow, store);
          },
          accelerator: "CmdOrCtrl+Shift+V",
        },
        {
          label: "Feature Delete",
          click: (e) => {
            FeatureDelete(mainWindow, store);
          },
          accelerator: "Delete",
        },
      ],
    },
    {
      label: "AddObject",
      submenu: [
        {
          label: "LaneSide",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_LANESIDE");
          },
          accelerator: "ctrl+1",
        },
        {
          label: "Link",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_LN_LINK");
          },
          accelerator: "ctrl+2",
        },
        {
          label: "Node",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_LN_NODE");
          },
          accelerator: "ctrl+3",
        },
        {
          label: "Poi",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_POI");
          },
          accelerator: "ctrl+4",
        },
        {
          label: "RoadLight",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_ROADLIGHT");
          },
          accelerator: "ctrl+5",
        },
        {
          label: "RoadMark",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_ROADMARK");
          },
          accelerator: "ctrl+6",
        },
        {
          label: "SafePoint",
          click: (e) => {
            AddObject(mainWindow, store, "LAYER_SAFEPOINT");
          },
          accelerator: "ctrl+7",
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Feature Select[Layer Edite On -> Feature Click]",
        },
        {
          label: "Feature Multi Select[Ctrl + Drag]",
        },
        {
          label: "Feature Move[Feature Select -> Ctr + Drag]",
        },
        {
          label: "Feature Attributes View[Feature Right Click]",
        },
        {
          label: "Feature Attributes Viewer Delete[Map Right Click]",
        },
        {
          label: "Feature Point Delete[Feature Select -> D + Click]",
        },
      ],
    },
  ];
  return menu;
}
