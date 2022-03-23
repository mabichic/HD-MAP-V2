import 'ol/ol.css';
import { Map, View } from 'ol';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import { useEffect, useRef, useState } from 'react';
import MapContext from './context/MapContext';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { useRecoilState } from 'recoil';
import { layerState } from '../state/Layer';
import { Modify, Select } from 'ol/interaction';
import { selectedStyle } from './HdMapStyle';
import { defaults as defaultInteraction, DragBox, Snap, Translate } from 'ol/interaction'
import { altKeyOnly, platformModifierKeyOnly } from 'ol/events/condition';
import { featureService } from './service/message.service';
import VectorImageLayer from 'ol/layer/VectorImage';
proj4.defs([
    ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +epllps']
]);
proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); // 5186 좌표선언
register(proj4);

function HdMap({ children, zoom, center }) {
    const [map, setMap] = useState(null);
    const mapRef = useRef();
    useEffect(() => {
        let options = {
            view: new View({
                projection: 'EPSG:5186',
                center: [234075, 419607],
                zoom: 15,
                minZoom: 8,
                constrainResolution: true,
            }),
            layers: [],
            controls: [],
            overlays: [],
            interactions: defaultInteraction({ doubleClickZoom: false }),
        };
        let mapObject = new Map(options);
        let select = new Select({
            multi: false,
            layers: function (layer) {
                return layer.get('selectable') === true;
            },
            style: function (feature, resolution) {
                return selectedStyle(feature);
            },
        });
        select.on("select", (e) => {
            let features = e.selected as any[];
            featureService.selected("selected", features);
        });
  
        const modify = new Modify({
            deleteCondition: altKeyOnly,
            features: select.getFeatures(),
        });

        const dragBox = new DragBox({
            condition: platformModifierKeyOnly,
        });
        dragBox.on('boxend', function () {
            const selectedFeatures = select.getFeatures();
            selectedFeatures.clear();
            const rotation = mapObject.getView().getRotation();
            const oblique = rotation % (Math.PI / 2) !== 0;
            const candidateFeatures = oblique ? [] : selectedFeatures;
            const extent = this.getGeometry().getExtent();
            mapObject.getLayers().forEach((layer:VectorImageLayer<any>)=>{
                if(layer.get("selectable")){
                    layer.getSource().forEachFeatureIntersectingExtent(extent, function (feature) {
                        candidateFeatures.push(feature);
                    });
                }
            });
            featureService.selected("selected", candidateFeatures);
            
            if (oblique) {
                const anchor = [0, 0];
                const geometry = dragBox.getGeometry().clone();
                geometry.rotate(-rotation, anchor);
                const extent = geometry.getExtent();
                candidateFeatures.forEach(function (feature) {
                    const geometry = feature.getGeometry().clone();
                    geometry.rotate(-rotation, anchor);
                    if (geometry.intersectsExtent(extent)) {
                        this.selectedFeatures.push(feature);
                    }
                });
            }
        });

        mapObject.addInteraction(select);
        mapObject.addInteraction(modify);
        mapObject.addInteraction(dragBox);
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
        <MapContext.Provider value={map}>
            <div ref={mapRef} style={{ height: '100%', backgroundColor: 'gray' }} >
                {children}
            </div>
        </MapContext.Provider>
    )
}
export default HdMap;