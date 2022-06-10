import { Snap } from "ol/interaction";
import { Vector } from "ol/layer";
import LayerDraw from "./draw/LayerDraw";

const HdMapVectorLayer = ({ source, style, title, zIndex = 0, map, layerIndex, filePaths }) => {
  let snap = new Snap({
    source: source,
  });
  let vectorLayer = new Vector({
    style: style,
    // declutter: true,
    source: source,
    properties: {
      title: title,
      selectable: false,
      dataVisible: false,
      snap: snap,
      layerIndex : layerIndex,
      filePaths : filePaths,
    },
    zIndex: map.getLayers().getLength()-1,
  });

  map.addLayer(vectorLayer);
  LayerDraw(map, source, style);

  map.addInteraction(snap);

  return vectorLayer;
};

export default HdMapVectorLayer;
