import { dialog, IpcMainEvent } from "electron";
export default function SaveAll(event: IpcMainEvent, res: resInterface, store: any) {
  dialog
    .showOpenDialog({
      properties: ["openFile", "openDirectory"],
      buttonLabel: "저장",
    })
    .then((results) => {
    //   if (!results.canceled) {
    //     const txtConverterFn = (datas: Array<Object>) => {
    //       let txts = "";
    //       let count = 0;
    //       datas.forEach((data) => {
    //         count++;
    //         let txt = "";
    //         let keys = Object.keys(data);
    //         keys.forEach((key) => {
    //           if (key === "LinkID") {
    //             if (data[key].length > 0) txt += data[key].join(" ") + " ";
    //           } else if (key === "StopLineID") {
    //             console.log(data[key]);
    //           } else {
    //             if (data[key] !== null || data[key].length > 0) {
    //               txt += data[key] + " ";
    //             } else {
    //               console.log(key);
    //             }
    //           }
    //         });
    //         txt.trim();
    //         txts += txt;
    //         txts += "\r\n";
    //       });
    //       return { datas: txts, count: count };
    //     };
    //     const saveTxt = (txts: string, dir: number, file: string) => {
    //       fs.mkdirSync(results.filePaths[0] + "/" + dir, { recursive: true });
    //       const filePath = results.filePaths[0] + "/" + dir + "/" + file + ".txt";
    //       fs.writeFileSync(filePath, txts, "utf8");
    //     };
    //     let linkResult = txtConverterFn(res.LAYER_LN_LINK);
    //     let nodeResult = txtConverterFn(res.LAYER_LN_NODE);
    //     let roadlightResult = txtConverterFn(res.LAYER_ROADLIGHT);
    //     let lanesideResult = txtConverterFn(res.LAYER_LANESIDE);
    //     let roadmarkResult = txtConverterFn(res.LAYER_ROADMARK);
    //     const today = new Date().getTime();
    //     if (linkResult.count > 0) saveTxt(linkResult.datas, today, "etridb_plus_LAYER_LN_LINK");
    //     if (nodeResult.count > 0) saveTxt(nodeResult.datas, today, "etridb_plus_LAYER_LN_NODE");
    //     if (roadlightResult.count > 0) saveTxt(roadlightResult.datas, today, "etridb_plus_LAYER_ROADLIGHT");
    //     if (lanesideResult.count > 0) saveTxt(lanesideResult.datas, today, "etridb_plus_LAYER_LANESIDE");
    //     if (roadmarkResult.count > 0) saveTxt(roadmarkResult.datas, today, "etridb_plus_LAYER_ROADMARK");

    //     event.sender.send("fileSaveReciver", { state: "ok" });
    //   } else {
    //     // event.sender.send("fileSaveReciver", { state: "cancle" });
    //   }
    })
    .catch((e) => {
    //   event.sender.send("fileSaveReciver", { state: "error" });
    })
    .finally(() => {});
}
interface resInterface {
  LAYER_LN_LINK: Array<Object>;
  LAYER_LN_NODE: Array<Object>;
  LAYER_LANESIDE: Array<Object>;
  LAYER_ROADLIGHT: Array<Object>;
  LAYER_ROADMARK: Array<Object>;
}
// fileSaveReciver
