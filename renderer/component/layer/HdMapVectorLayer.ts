import { Draw, Snap } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorImageLayer from "ol/layer/VectorImage";
import { Vector } from "ol/layer";
import LayerDraw from "./draw/LayerDraw";

const HdMapVectorLayer = ({ source, style, title, zIndex = 0, map, layerIndex }) => {
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
      layerIndex : layerIndex
    },
    zIndex: map.getLayers().getLength()-1,
  });

  map.addLayer(vectorLayer);
  LayerDraw(map, source, style);

  map.addInteraction(snap);

  return vectorLayer;
};

export default HdMapVectorLayer;
