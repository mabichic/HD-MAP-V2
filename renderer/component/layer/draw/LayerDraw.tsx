import { Map } from "ol";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { getUnDoReDoIndex, setInitRedo, setUpUnDoReDoIndex, UndoPush } from "../../modify/UndoRedo";
import { featureService, selectService } from "../../service/message.service";

let point, lineString, polygon = null;
let drawEnd = null;
let drawStart = null;
export default function LayerDraw(map: Map, source: VectorSource, style) {
    point = new Draw({
        source: source,
        type: 'Point',
        // style : style,
    });
    lineString = new Draw({
        source: source,
        type: 'LineString',
        // style : style,
    });
    polygon = new Draw({
        source: source,
        type: 'Polygon',
        // style : style,
    });
    map.addInteraction(point);
    map.addInteraction(lineString);
    map.addInteraction(polygon);
    point.setActive(false);
    lineString.setActive(false);
    polygon.setActive(false);
    source.set("layerDrawSwitch", layerDrawSwitch);
}

const layerDrawSwitch = (type, maxID, layerIndex, source) => {
    point.setActive(false);
    lineString.setActive(false);
    polygon.setActive(false);
    if (drawEnd !== null) {
        lineString.un('drawend', drawEnd);
        point.un('drawend', drawEnd);
        polygon.un('drawend', drawEnd);
    }
    if (drawStart !== null) {
        lineString.un('drawstart', layerDrawStart)
        point.un('drawstart', layerDrawStart)
        polygon.un('drawstart', layerDrawStart)
    }
    if (type === "LAYER_LANESIDE" || type === "LAYER_LN_LINK" || type === "LAYER_ROADLIGHT") {
        drawEnd = (e) => { layerDrawEnd(e, lineString, type, maxID, layerIndex, source); }
        drawStart = (e) => { layerDrawStart(e); }
        lineString.setActive(true);
        lineString.on('drawstart', drawStart);
        lineString.on('drawend', drawEnd);
    } else if (type === "LAYER_LN_NODE" || type === "LAYER_POI") {
        drawEnd = (e) => { layerDrawEnd(e, point, type, maxID, layerIndex, source); }
        drawStart = (e) => { layerDrawStart(e); }
        point.setActive(true);
        point.on('drawstart', drawStart);
        point.on('drawend', drawEnd);
    } else if (type === "LAYER_ROADMARK") {
        drawEnd = (e) => { layerDrawEnd(e, polygon, type, maxID, layerIndex, source); }
        drawStart = (e) => { layerDrawStart(e); }
        polygon.setActive(true);
        polygon.on('drawstart', drawStart);
        polygon.on('drawend', drawEnd);
    }

}
export const layerDrawOn = (evt) => {

}
const layerDrawStart = (evt) => {
    selectService.selectActive(false);
}

const layerDrawEnd = (evt, draw: Draw, type: String, maxID: number, layerIndex: number, source: VectorSource) => {
    draw.setActive(false);
    selectService.selectActive(true);
    if (!isFinite(maxID)) maxID = 1;
    else maxID += 1;

    let obejctID = maxID;
    let objectFeautreID = type + layerIndex.toString() + "_" + obejctID.toString();
    let drawType = evt.feature.getGeometry().getType();
    evt.feature.setId(objectFeautreID);
    evt.feature.set("source", source);
    evt.feature.set("ID", obejctID);
    evt.feature.set("PointXY", evt.feature.getGeometry().getFlatCoordinates())
    if (type === "LAYER_LANESIDE") {
        evt.feature.set('MID', 0);
        evt.feature.set('LaneID', 0);
        evt.feature.set('Type', 1);
        evt.feature.set('Color', 0);

    } else if (type === "LAYER_LN_LINK") {
        evt.feature.set('MID', 0);
        evt.feature.set('LID', 0);
        evt.feature.set('RID', 0);
        evt.feature.set('InMID', 0);
        evt.feature.set('InRID', 0);
        evt.feature.set('InLID', 0);
        evt.feature.set('outMID', 0);
        evt.feature.set('outLID', 0);
        evt.feature.set('outRID', 0);
        evt.feature.set('Junction', 0);
        evt.feature.set('Type', 1);
        evt.feature.set('Sub_Type', 1);
        evt.feature.set('Twoway', 0);
        evt.feature.set('RLID', 0);
        evt.feature.set('LLinkID', 0);
        evt.feature.set('RLinkID', 0);
        evt.feature.set('SNodeID', '');
        evt.feature.set('ENodeID', '');
        evt.feature.set('Speed', 0);
        evt.feature.set('Speed', 0);
        evt.feature.get("source").getFeaturesAtCoordinate(evt.feature.getGeometry().getFirstCoordinate()).forEach(x => {
            if (x?.get('group') === 'LAYER_LN_NODE') {
                let preFeature = x.clone();
                x.set("LinkID", [...x.get('LinkID'), obejctID]);
                x.set("NumConLink", x.get('LinkID').length);
                evt.feature.set("SNodeID", x.get("ID"));
                let nextFeature = x.clone();
                UndoPush("UPDATE", source, x, preFeature, nextFeature, getUnDoReDoIndex());


            }
        });
        evt.feature.get("source").getFeaturesAtCoordinate(evt.feature.getGeometry().getLastCoordinate()).forEach(x => {
            if (x?.get('group') === 'LAYER_LN_NODE') {
                let preFeature = x.clone();
                x.set("LinkID", [...x.get('LinkID'), obejctID]);
                x.set("NumConLink", x.get('LinkID').length);
                evt.feature.set("ENodeID", x.get("ID"));
                let nextFeature = x.clone();
                UndoPush("UPDATE", source, x, preFeature, nextFeature, getUnDoReDoIndex());
            }
        });

    } else if (type === "LAYER_LN_NODE") {
        evt.feature.set('NumConLink', 0);
        evt.feature.set('LinkID', []);
        evt.feature.get("source").getFeaturesAtCoordinate(evt.feature.getGeometry().getFirstCoordinate()).forEach(x => {
            if (x.get('group') === 'LAYER_LN_LINK') {
                let preFeature = x.clone();
                var nodePoint = evt.feature.getGeometry().getCoordinates();
                var linkFirstPoint = x.getGeometry().getFirstCoordinate();
                var linkLastPoint = x.getGeometry().getLastCoordinate();
                if (JSON.stringify(nodePoint) === JSON.stringify(linkFirstPoint)) {
                    x.set("SNodeID", obejctID);
                    evt.feature.set("LinkID", [...evt.feature.get('LinkID'), x.get("ID")])
                    evt.feature.set("NumConLink", evt.feature.get('LinkID').length);
                }
                if (JSON.stringify(nodePoint) === JSON.stringify(linkLastPoint)) {
                    x.set("ENodeID", obejctID);
                    evt.feature.set("LinkID", [...evt.feature.get('LinkID'), x.get("ID")])
                    evt.feature.set("NumConLink", evt.feature.get('LinkID').length);
                }
                let nextFeature = x.clone();
                UndoPush("UPDATE", source, x, preFeature, nextFeature, getUnDoReDoIndex());
            }
        });
    } else if (type === "LAYER_POI") {
        evt.feature.set('LinkID', 0);
        evt.feature.set('Name', 'New Object');
    } else if (type === "LAYER_ROADLIGHT") {
        evt.feature.set('LaneID', 0);
        evt.feature.set('Type', 1);
        evt.feature.set('SubType', 1);
        evt.feature.set('Div', 1);
        evt.feature.set('NumStopLine', 0);
        evt.feature.set('StopLineID', []);
    } else if (type === "LAYER_ROADMARK") {
        evt.feature.set('Type', 1);
        evt.feature.set('SubType', 0);
        evt.feature.set('NumStopLine', 0);
        evt.feature.set('StopLineID', []);
    }

    if (drawType === "LineString") {
        evt.feature.set("NumPoint", evt.feature.getGeometry().getCoordinates().length);
    } else if (drawType === "Polygon") {
        evt.feature.set("NumPoint", evt.feature.getGeometry().getCoordinates()[0].length);
    }
    evt.feature.set("group", type);
    evt.feature.set('Index', layerIndex);
    UndoPush("DRAW", source,  evt.feature, null,null, getUnDoReDoIndex());
    setInitRedo();
    setUpUnDoReDoIndex();
    
}