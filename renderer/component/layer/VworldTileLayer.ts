import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
const VworldTileLayer = ({ zIndex = 0, map }) : TileLayer<XYZ>=> {
  let vectorLayer = new TileLayer({
    source: new XYZ({
      url: "http://xdworld.vworld.kr:8080/2d/Satellite/service/{z}/{x}/{y}.jpeg",
      maxZoom: 19,
    }),
    properties: {
      title: "λΈμ΄μλ",
    },
    zIndex: 0,
  });
  map.addLayer(vectorLayer);
  return vectorLayer;
};

export default VworldTileLayer;
