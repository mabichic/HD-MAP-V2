import VectorLayer from "ol/layer/Vector";
import VectorImageLayer from "ol/layer/VectorImage";

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

  let vectorLayer = new VectorLayer({
    style:style,
    declutter: true,
    source: source,
    properties : {
      title:title,
      selectable: false,
      dataVisible: false,
    }, 
    zIndex : map.getLayers().getLength(),
  });
  map.addLayer(vectorLayer);

  return vectorLayer;
};

export default HdMapVectorLayer;
