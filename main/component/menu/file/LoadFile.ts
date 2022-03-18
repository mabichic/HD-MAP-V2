import { dialog } from "electron";

export default function LoadFile(store:any) { 
    // dialog.showOpenDialog({
    //     properties: ['openFile', 'openDirectory']
    //   }).then(results => {
    //     if (!results.canceled) {

            store.set('port',Math.floor(Math.random() * (10 - 0) + 0));

        // }
    //   });
}