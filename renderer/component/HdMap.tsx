import 'ol/ol.css';
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import { useEffect, useRef, useState } from 'react';
import MapContext from './context/MapContext';

import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { useRecoilState } from 'recoil';
import { layerState } from '../state/Layer';

proj4.defs([
    ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +epllps']
  ]);
  proj4.defs( "EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs" ); // 5186 좌표선언
  register(proj4);

function HdMap({ children, zoom, center }) {
    const [map, setMap] = useState(null);
    const mapRef = useRef();
    
    useEffect(() => {
       
        let options = {
            view: new View({
                projection: 'EPSG:5186',
                center: [234075,419607],
                zoom: 15,
                minZoom:8,
                constrainResolution: true,
             }),
            layers: [],
            controls: [],
            overlays: []
        };
        let mapObject = new Map(options);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);
        return () => mapObject.setTarget(undefined);
    }, []);
    useEffect(() => {
        if (!map) return;
        map.getView().setZoom(zoom);
    }, [zoom]);
    useEffect(() => {
        if (!map) return;
        map.getView().setCenter(center)
    }, [center])

    return (
        <MapContext.Provider value={ map }>
            <div ref={mapRef} style={{height:'100%', backgroundColor:'gray'}} >
                {children}
            </div>
        </MapContext.Provider>
    )
}
export default HdMap;