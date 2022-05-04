import { Map, Overlay, View } from 'ol';
import 'ol/ol.css';
import { useEffect, useRef, useState } from 'react';
import MapContext from './context/MapContext';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, styled, TableCell, Typography } from '@mui/material';
import { ipcRenderer } from 'electron';
import { click, platformModifierKeyOnly, primaryAction } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults as defaultInteraction, DragBox, Modify, Select, Snap, Translate } from 'ol/interaction';
import { Vector } from 'ol/layer';
import { register } from 'ol/proj/proj4';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import proj4 from 'proj4';
import styles from './HdMap.module.css';
import { selectedStyle } from './HdMapStyle';
import BoxEnd from './modify/BoxEnd';
import DeleteFeature from './modify/Delete';
import { MeasureCancle, MeasureClear, MeasureInit, MeasureStart } from './modify/Measure';
import ModifyEnd from './modify/ModifyEnd';
import { setModifyStartUndo, setRedo, setUndo } from './modify/UndoRedo';
import { alertService, featureCopyService, featureService, selectService } from './service/message.service';
proj4.defs([
    ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +epllps']
]);
proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); // 5186 좌표선언
register(proj4);

export const MOVE = "MOVE";
export const EDIT = "EDIT";
export const DRAW = "DRAW";
let modifyKeyDown = false;

let clipboardData = null;
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
    const [select, setSelect] = useState<null | Select>(null);
    const [modify, setModify] = useState(null);
    const [measureSource, setMeasureSource] = useState(null);
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
        const overlay = new Overlay({
            element: overlayRef.current,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            }
        })
        const source = new VectorSource();

        const vector = new Vector({
            zIndex: 10000,
            source: source,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33',
                    }),
                }),
            }),
        });


        setMeasureSource(source);
        let mapObject = new Map(options);
        mapObject.set("state", MOVE);
        mapObject.addLayer(vector);
        mapObject.addOverlay(overlay);
        setOverlay(overlay);
        mapObject.getViewport().addEventListener('contextmenu', function (evt) {
            evt.preventDefault();
            const coordinate = mapObject.getEventCoordinate(evt);
            const pixel = mapObject.getPixelFromCoordinate(coordinate);
            const feature = mapObject.forEachFeatureAtPixel(pixel, function (feature) {
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
        setSelect(select);
        select.on("select", (e) => {
            if (modifyKeyDown) return;
            let features = e.selected as any[];

            let stopIDS = [];
            features.forEach((feature) => {
                if (feature.get("group") === "LAYER_ROADMARK" && feature.get("Type") === 7) {
                    stopIDS.push(feature);
                }
            });
            if (stopIDS.length > 0) {
                featureService.stopLineIdSelected("stopIDSSelected", stopIDS, select);
            }
            if (select.getFeatures().getLength() > 0) featureService.selected("selected", features);
        });
        let snap = new Snap({
            source: vector.getSource()
        });
        const modify = new Modify({
            deleteCondition: (e) => {
                if(!modifyKeyDown)  return;
                return click(e) && modifyKeyDown;
            },
            features: select.getFeatures(),
        });
        setModify(modify);
        modify.on("modifystart", (e) => {
            overlay.setPosition(undefined);
            setModifyStartUndo(e.features);
        });
        modify.on("modifyend", (e) => { ModifyEnd(e) });


        const translate = new Translate({
            condition: function (event) {
                return primaryAction(event) && platformModifierKeyOnly(event);
            },
            features: select.getFeatures(),
        })
        translate.on("translatestart", (e) => {
            overlay.setPosition(undefined);
            setModifyStartUndo(e.features);
        });
        translate.on("translateend", (e) => { ModifyEnd(e) });
        const dragBox = new DragBox({
            condition: platformModifierKeyOnly,
        });
        dragBox.on('boxend', (e) => { BoxEnd(e, select, mapObject, dragBox) });

        MeasureInit(mapObject, vector.getSource());
        mapObject.addInteraction(select);
        mapObject.addInteraction(snap);
        mapObject.addInteraction(modify);
        mapObject.addInteraction(dragBox);
        mapObject.addInteraction(translate);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);
        document.addEventListener('keydown', function (evt) {
            if (modifyKeyDown&&evt.key !== 'd') return;
            modifyKeyDown = (evt.key === 'd');
        });
        document.addEventListener('keyup', function (evt) {
            if(evt.key !== 'd') return; 
            modifyKeyDown = (evt.key !== 'd');
        });
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

    useEffect(() => {
        if (!map || !measureSource) return;
        ipcRenderer.on("measureStart", (event, args) => {
            MeasureStart(map);
            select.setActive(false);
            modify.setActive(false);
        });
        ipcRenderer.on("measureEnd", (event, args) => {
            MeasureCancle(map, measureSource);
            select.setActive(true);
            modify.setActive(true);
        });
        ipcRenderer.on("measureClear", (event, args) => {
            MeasureClear(map, measureSource);
        });

        return () => {
            ipcRenderer.removeAllListeners("measureStart");
            ipcRenderer.removeAllListeners("measureEnd");
            ipcRenderer.removeAllListeners("measureClear");
        }
    }, [map, measureSource, modify])
    useEffect(() => {
        let subscription = selectService.getMessage().subscribe(message => {
            if (message.state) {
                select.setActive(true);
                modify.setActive(true);
            } else {
                select.setActive(false);
                modify.setActive(false);
            }
        });
        ipcRenderer.on("featureCopy", (event, args) => {
            if (select.getFeatures().getLength() > 0) {
                let json = new GeoJSON().writeFeaturesObject(select.getFeatures().getArray());
                clipboardData = json;
            } else {
                alertService.sendMessage("Error.", "선택된 객체가 없습니다.");
            }
        });
        ipcRenderer.on("featurePaste", (event, args) => {
            if (clipboardData !== null) {
                featureCopyService.copyFeature("copy", clipboardData);
            } else {
                alertService.sendMessage("Error.", "복사된 객체가 없습니다.");
            }
        });
        ipcRenderer.on("featureDelete", (event, args) => {
            if (select.getFeatures().getLength() > 0) {
                DeleteFeature(select.getFeatures().getArray());
                select.getFeatures().clear();
            } else {
                alertService.sendMessage("Error.", "선택된 객체가 없습니다.");
            }
        });
        ipcRenderer.on("undo", (event, args) => {
            select.getFeatures().clear();
            setUndo();
            dellOverlay();
        });
        ipcRenderer.on("redo", (event, args) => {
            select.getFeatures().clear();
            setRedo();
            dellOverlay();
        });
        return () => {
            subscription.unsubscribe();
            ipcRenderer.removeAllListeners("featureCopy");
            ipcRenderer.removeAllListeners("featurePaste");
            ipcRenderer.removeAllListeners("featureDelete");
            ipcRenderer.removeAllListeners("undo");
            ipcRenderer.removeAllListeners("redo");
        }
    }, [map, select, modify])
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