import { readFileSync } from "fs";
import { GEOJSONTYPE, LAYER_LANESIDE, LAYER_LN_LINK, LAYER_LN_NODE, LAYER_POI, LAYER_ROADLIGHT, LAYER_ROADMARK, LAYER_SAFEPOINT } from "../dto/dto";

const objectSet = {
  LAYER_ROADMARK: LAYER_ROADMARK,
  LAYER_ROADLIGHT: LAYER_ROADLIGHT,
  LAYER_LANESIDE: LAYER_LANESIDE,
  LAYER_POI: LAYER_POI,
  LAYER_LN_LINK: LAYER_LN_LINK,
  LAYER_LN_NODE: LAYER_LN_NODE,
  LAYER_SAFEPOINT: LAYER_SAFEPOINT,
};

export default function Converter(layerNM, index: number, dataSet: Array<any>, filePath: string) {
  let geoType: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" = "Point";
  switch (layerNM) {
    case "LAYER_LANESIDE":
    case "LAYER_LN_LINK":
    case "LAYER_ROADLIGHT":
      geoType = "LineString";
      break;
    case "LAYER_LN_NODE":
    case "LAYER_POI":
    case "LAYER_SAFEPOINT":
      geoType = "Point";
      break;
    case "LAYER_ROADMARK":
      geoType = "Polygon";
      break;
  }
  
  readFileSync(filePath, "utf-8")
    .split("\r\n")
    .forEach((array) => {
      array = array.trim();
      if (array === "") return;
      let obj = new objectSet[layerNM](array);
      obj.Index = index;
      let geson: GEOJSONTYPE = {
        type: "Feature",
        group: layerNM,
        id: layerNM + index + "_" + obj.ID,
        geometry: {
          type: geoType,
          coordinates: obj.PointXY,
        },
        properties: obj,
      };
      dataSet.push(geson);
    });
}
