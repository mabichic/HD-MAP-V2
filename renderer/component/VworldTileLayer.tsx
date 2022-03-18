import { useContext, useEffect } from "react";
import MapContext from "./context/MapContext";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
const VworldTileLayer = ({zIndex = 0 }) =>{
    const map = useContext(MapContext);
    useEffect (() =>{
        if(!map) return;
        let vectorLayer = new TileLayer({
            source: new XYZ({
                url : 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg',
                maxZoom: 19,
            }),
            properties : {
                title : "브이월드"
            }
        });
        map.addLayer(vectorLayer);
    },[map]);
    return null;
}

export default VworldTileLayer;