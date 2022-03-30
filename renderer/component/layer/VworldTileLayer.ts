import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
const VworldTileLayer = ({ zIndex = 0, map }) : TileLayer<XYZ>=> {
  let vectorLayer = new TileLayer({
    source: new XYZ({
      url: "http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg",
      maxZoom: 19,
    }),
    properties: {
      title: "브이월드",
    },
    zIndex: 0,
  });
  map.addLayer(vectorLayer);
  return vectorLayer;
};

export default VworldTileLayer;
