import { Snap } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorImageLayer from "ol/layer/VectorImage";
import {Vector} from 'ol/layer';

const HdMapVectorLayer = ({ source, style, title, zIndex = 0, map }) => {
  // let vectorLayer = new VectorImageLayer({
  //   declutter: true,
  //   source: source,
  //   style: style,
  //   properties: {
  //     title: title,
  //     selectable: false,
  //     dataVisible: false,
  //   },
  //   zIndex: map.getLayers().getLength(),
  // });
  
  let snap = new Snap({
    source: source
  });
  let vectorLayer = new Vector({
    style:style,
    // declutter: true,
    source: source,
    properties : {
      title:title,
      selectable: false,
      dataVisible: false,
      snap : snap
    }, 
    zIndex : map.getLayers().getLength(),
  });
  map.addLayer(vectorLayer);


  map.addInteraction(snap);
  return vectorLayer;
};

export default HdMapVectorLayer;
