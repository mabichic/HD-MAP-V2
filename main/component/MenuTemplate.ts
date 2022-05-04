import { BrowserWindow, MenuItem, MenuItemConstructorOptions } from "electron";
import { AddObject } from "./menu/AddObject/AddObject";
import { FeatureCopy, FeatureDelete, FeaturePaste } from "./menu/edit/Feature";
import Measure, { MeasureClear } from "./menu/edit/Measure";
import { Redo, Undo } from "./menu/edit/UndoReDo";
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
        submenu: [
          {
            label: "Undo",
            click: (e) => {Undo(mainWindow, store)},
            accelerator : "ctrl+z"
          },
          {
            label: "Redo",
            click: (e) => {Redo(mainWindow, store)},
            accelerator : "ctrl+y"
          },
          { type: "separator" },
          {
            label: "Measure",
            click: (e) => {Measure(mainWindow, store,e.checked)},
            type : 'checkbox' ,
            checked : false,
            accelerator : "ctrl+t"
          },
          {
            label: "Measure Clear",
            click: (e) => {MeasureClear(mainWindow, store)},
            accelerator : "ctrl+g"
            
          },
          { type: "separator" },
          {
            label: "Feature Copy",
            click: (e) => {FeatureCopy(mainWindow, store)},
            accelerator : "c"
          },
          {
            label: "Feature Paste",
            click: (e) => {FeaturePaste(mainWindow, store)},
            accelerator : "v"
          },
          {
            label: "Feature Delete",
            click: (e) => {FeatureDelete(mainWindow, store)},
            accelerator : "Delete"
          },
        ],
      },
      {
        label: "AddObject",
        submenu: [
          {
            label: "LaneSide",
            click: (e) => {AddObject(mainWindow, store, "LAYER_LANESIDE")},
            accelerator : "ctrl+1"
          },
          {
            label: "Link",
            click: (e) => {AddObject(mainWindow, store, "LAYER_LN_LINK")},
            accelerator : "ctrl+2"
          },
          {
            label: "Node",
            click: (e) => {AddObject(mainWindow, store,"LAYER_LN_NODE")},
            accelerator : "ctrl+3"
          },
          {
            label: "Poi",
            click: (e) => {AddObject(mainWindow, store,"LAYER_POI")},
            accelerator : "ctrl+4"
          },
          {
            label: "RoadLight",
            click: (e) => {AddObject(mainWindow, store,"LAYER_ROADLIGHT")},
            accelerator : "ctrl+5"
          },
          {
            label: "RoadMark",
            click: (e) => {AddObject(mainWindow, store,"LAYER_ROADMARK")},
            accelerator : "ctrl+6"
          },
        ],
      },
    ];
   return menu
}
