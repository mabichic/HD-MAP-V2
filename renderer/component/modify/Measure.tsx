import { Map, Overlay } from "ol";
import styles from "../HdMap.module.css";
import { getArea, getLength } from "ol/sphere";
import { unByKey } from "ol/Observable";
import { DrawEvent } from "ol/interaction/Draw";
import { Geometry, LineString, Polygon } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { MeasureStyle } from "../HdMapStyle";
import { Draw } from 'ol/interaction';
import { selectService } from "../service/message.service";
export let helpTooltip,
  helpTooltipElement: HTMLElement | null,
  measureTooltip,
  measureTooltipElement,

  sketch = null;
export let listener;
let measure:Draw|undefined;
let measureTooltips: Array<Overlay> = [];
export const MeasureInit = (map: Map, source: VectorSource<Geometry>) => {
  if (measure !== null) {
    measure = new Draw({
      source: source,
      type: "LineString",
      style: MeasureStyle
    });
    measure.on('drawstart', (evt) => measureDrawStart(evt, map));
    measure.on('drawend', (evt) => measureDrawend(map));
    measure.setActive(false);
  }
  map.addInteraction(measure);
}
export const MeasureStart = (map: Map) =>{
  measure.setActive(true);
  
  createHelpTooltip(map);
  map.on('pointermove', pointerMoveHandler);
}
export const MeasureCancle = (map: Map, source: VectorSource<Geometry>) => {
  if (measure !== null) {
    // map.removeInteraction(measure);
    map.un('pointermove', pointerMoveHandler);
    measure.setActive(false);
    helpTooltipElement?.remove();
    helpTooltipElement = null;
    measureTooltipElement?.remove();
    measureTooltipElement=null;

  }
}
export const MeasureClear = (map: Map, source: VectorSource<Geometry>) => {

  source.clear();
  map.getOverlays().forEach((overlay)=>{
    if (measureTooltips.includes(overlay))  overlay.setMap(null);
  });
  measureTooltips = [];
}
export const createMeasureTooltip = (map) => {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = `${styles.app} ${styles.olTooltip} ${styles.olTooltipMeasure}`;
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
    stopEvent: false,
    insertFirst: false,
  });
  map.addOverlay(measureTooltip);
  measureTooltips.push(measureTooltip);
};

export const measureDrawStart = (evt: DrawEvent, map: Map) => {
  selectService.selectActive(false);
  sketch = evt.feature;
  createMeasureTooltip(map);
  /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
  let tooltipCoord = null;
  listener = sketch.getGeometry().on('change', function (evt) {
    const geom = evt.target;
    let output;
    if (geom instanceof Polygon) {
      output = formatArea(geom);
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof LineString) {
      output = formatLength(geom);
      tooltipCoord = geom.getLastCoordinate();
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  });
}
export const measureDrawend = (map) => {
  selectService.selectActive(true);
  measureTooltipElement.className = `${styles.app} ${styles.olTooltip} ${styles.olTooltipStatic}`;
  measureTooltip.setOffset([0, -7]);
  // unset sketch
  sketch = null;
  // unset tooltip so that a new one can be created
  measureTooltipElement = null;
  createMeasureTooltip(map);
  unByKey(listener);
};

export const createHelpTooltip = (map) => {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement("div");
  helpTooltipElement.className = `${styles.app} ${styles.olTooltip} ${styles.hidden}`;
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left",
  });
  map.addOverlay(helpTooltip);
};

export const pointerMoveHandler = function (evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  let helpMsg = "Click to start drawing";

  //   if (sketch) {
  //     const geom = sketch.getGeometry();
  //     if (geom instanceof Polygon) {
  //       helpMsg = continuePolygonMsg;
  //     } else if (geom instanceof LineString) {
  //       helpMsg = continueLineMsg;
  //     }
  //   }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove("hidden");
};

export const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};

export const formatLength = function (line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};
