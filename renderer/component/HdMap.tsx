import 'ol/ol.css';
import { Feature, Map, Overlay, View } from 'ol';
import { useEffect, useRef, useState } from 'react';
import MapContext from './context/MapContext';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { Draw, Modify, Select, Translate } from 'ol/interaction';
import { selectedStyle } from './HdMapStyle';
import { defaults as defaultInteraction, DragBox, Snap, } from 'ol/interaction'
import { altKeyOnly, platformModifierKeyOnly, primaryAction } from 'ol/events/condition';
import { featureService } from './service/message.service';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Box, IconButton, Paper, styled, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './HdMap.module.css';
import Popup from './Popup';
import { fromLonLat } from 'ol/proj';
import { LineString, Point, Polygon } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import ModifyEnd from './modify/ModifyEnd';
proj4.defs([
    ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +epllps']
]);
proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); // 5186 좌표선언
register(proj4);
const PopupTableCell = styled(TableCell)({
    borderBottom: "none",
    padding: '3px',
    fontSize: '14pt',
    paddingTop: '4px',
    paddingLeft: '14px',
    paddingBottom: '4px',
});
const PopupKeyTableCell = styled(PopupTableCell)({
    backgroundColor: '#ECF2FF',
    width: '120px',
    color: '#30459A',
});
const PopupValueTableCell = styled(PopupTableCell)({
    backgroundColor: '#ffffff',
    paddingRight: '8px',
});

const PopupKeyHeaderTableCell = styled(PopupTableCell)({
    backgroundColor: '#ECF2FF',
    width: '120px',
    paddingTop: '12px',
    paddingBottom: '8px',

});
const PopupValueHeaderTableCell = styled(PopupTableCell)({
    backgroundColor: '#ffffff',
    paddingTop: '12px',
    paddingBottom: '8px',
});

function HdMap({ children, zoom, center }) {
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    const overlayRef = useRef(null);
    const closerRef = useRef(null);
    const [overlay, setOverlay] = useState(null);
    const [content, setContent] = useState(null);
    const dellOverlay = function () {
        overlay?.setPosition(undefined);
        return false;
    };
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
            interactions: defaultInteraction({
                doubleClickZoom: false, keyboard: false,
            }),
        };
        const pos = fromLonLat([16.3725, 48.208889]);
        const overlay = new Overlay({
            element: overlayRef.current,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            }
        })


        let mapObject = new Map(options);
        mapObject.addOverlay(overlay);
        setOverlay(overlay);
        mapObject.getViewport().addEventListener('contextmenu', function (evt) {
            evt.preventDefault();
            const coordinate = mapObject.getEventCoordinate(evt);
            const pixel = mapObject.getPixelFromCoordinate(coordinate);
            const feature = mapObject.forEachFeatureAtPixel(pixel, function (feature) {

                console.log(feature);
                return feature;
            }, {
                layerFilter: function (filterLayer) {
                    return typeof filterLayer.get('title') !== "undefined"
                }
            }
            );
            if (feature) {
                let txt = {};
                Object.keys(feature.getProperties()).forEach((key) => {
                    if (key === 'geometry' || key === 'PointXY' || key === 'source' || key === 'Index') return;
                    txt[key] = feature.get(key);
                });
                // feature.getKeys().forEach(key => {
                // if (key === 'geometry') return;
                // txt[key] = feature.get(key);
                // });
                setContent(() => (txt));
                overlay.setPosition(coordinate);
            } else {
                overlay.setPosition(undefined);
                return false;
            }

        });
        let select = new Select({
            // multi: false,
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

            let stopIDS = [];
            features.forEach((feature) => {
                if (feature.get("group") === "LAYER_ROADMARK" && feature.get("Type") === 7) {
                    stopIDS.push(feature);
                }
            });
            if (stopIDS.length > 0) {
                featureService.stopLineIdSelected("stopIDSSelected", stopIDS, select);
            }
        });
        const snap = new Snap({

        })
        const modify = new Modify({
            // deleteCondition: altKeyOnly,
            features: select.getFeatures(),
        });
        modify.on("modifystart", (e) => {
            overlay.setPosition(undefined);
        });
        modify.on("modifyend", (e) => { ModifyEnd(e) });


        const translate = new Translate({
            condition: function (event) {
                return primaryAction(event) && platformModifierKeyOnly(event);
            },
            features : select.getFeatures(),
        })
        translate.on("translateend",(e)=>{ModifyEnd(e)});
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
            mapObject.getLayers().forEach((layer: VectorImageLayer<any>) => {
                if (layer.get("selectable")) {
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
        // const measure = new Draw({
        //     type
        // });
        mapObject.addInteraction(select);
        // mapObject.addInteraction(snap);
        mapObject.addInteraction(modify);
        mapObject.addInteraction(dragBox);
        mapObject.addInteraction(translate);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);
        return () => {
            mapObject.setTarget(undefined);
            mapObject.getLayers().forEach((layer) => {
                mapObject.removeLayer(layer);
            });
        }
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

            <Box className={styles.windowHDMapOverlay} ref={overlayRef} component={'div'} sx={{ padding: '0px' }}>
                <IconButton onClick={dellOverlay} sx={{ backgroundColor: '#E5E5E5', position: 'absolute', right: '10px', top: '7px', width: '26px', height: '26px', borderRadius: '0' }} >
                    <CloseIcon fontSize="small" sx={{ fill: '##4A4C55' }} />
                </IconButton>
                {/* <TableContainer className={styles.tableContainer} sx={{ borderRadius: '10px;' }}>
                    <TableHead>
                        <TableRow>
                            <PopupKeyHeaderTableCell>Key</PopupKeyHeaderTableCell>
                            <PopupValueHeaderTableCell>Value</PopupValueHeaderTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody> */}
                {content && (
                    Object.entries(content).map(([attKey, attValue]) => {
                        return <Typography key={attKey}> {`${attKey} : ${attValue}`} </Typography>
                    })
                )}
                {/* {content && (
                                Object.entries(content).map(([attKey, attValue]) => {
                                    return (
                                        <TableRow key={attKey}>
                                            <PopupKeyTableCell sx={{ backgroundColor: '#ECF2FF' }}>{attKey}</PopupKeyTableCell>
                                            <PopupValueTableCell>{attValue}</PopupValueTableCell>
                                        </TableRow>
                                    )
                                })
                            )} */}
                {/* </TableBody> */}
                {/* </TableContainer> */}
            </Box >

        </MapContext.Provider >
    )
}
export default HdMap;