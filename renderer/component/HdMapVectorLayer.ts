import { useContext, useEffect } from "react";
import VectorImageLayer from 'ol/layer/VectorImage';
import MapContext from "./context/MapContext";

const HdMapVectorLayer = ({source, style, title, zIndex = 0 }) =>{
    const map = useContext(MapContext);
    useEffect (() =>{
        if(!map) return;
        let vectorLayer = new VectorImageLayer({
            declutter:true,
            source: source,
            style : style, 
            properties : { 
                title : title, 
                selectable : false,
                dataVisible : false,
            }, 
            zIndex : map.getLayers().getLength(),
        });
        console.log(vectorLayer.getZIndex());
        map.addLayer(vectorLayer);
    },[map]);

    return null;
}

export default HdMapVectorLayer;