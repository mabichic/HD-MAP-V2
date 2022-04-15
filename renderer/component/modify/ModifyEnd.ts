import { Feature } from "ol";
import { LineString, Point, Polygon } from "ol/geom";
import { featureService } from '../service/message.service';

export default function ModifyEnd(e) {
    e.features.forEach((feature: Feature<LineString | Point | Polygon>) => {
        var ID = feature.get('ID');
        if (feature.get("group") === "LAYER_LN_LINK") {
            let sNodeId = feature.get('SNodeID');
            let eNodeId = feature.get('ENodeID');
            if (sNodeId !== '' && !isNaN(sNodeId) && sNodeId !== 0) {
                let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + sNodeId);
                node?.set('LinkID',node?.get('LinkID').filter((element) => element !== ID));
                node?.set('NumConLink',node?.get('LinkID').length);
                feature.set('SNodeID', '');
            }
            if(eNodeId !== '' && !isNaN(eNodeId) && eNodeId !== 0){
                let node = feature.get("source").getFeatureById("LAYER_LN_NODE" + feature.get("Index") + "_" + eNodeId);
                node?.set('LinkID',node?.get('LinkID').filter((element) => element !== ID));
                node?.set('NumConLink',node?.get('LinkID').length);
                feature.set('ENodeID', '');
            }

            feature.get("source").getFeaturesAtCoordinate (feature.getGeometry().getFirstCoordinate()).forEach(x=>{
                if(x?.get('group')==='LAYER_LN_NODE'){
                    x.set("LinkID",[...x.get('LinkID'), ID]);
                    x.set("NumConLink", x.get('LinkID').length);
                    feature.set("SNodeID", x.get("ID"));
                }
            });
            feature.get("source").getFeaturesAtCoordinate (feature.getGeometry().getLastCoordinate()).forEach(x=>{
                if(x?.get('group')==='LAYER_LN_NODE'){
                    x.set("LinkID",[...x.get('LinkID'), ID]);
                    x.set("NumConLink", x.get('LinkID').length);
                    feature.set("ENodeID", x.get("ID"));
                }
            });
        }
        console.log(feature.get("group"));
        if (feature.get("group") === "LAYER_LN_NODE") {
            console.log(feature.get("LinkID"));
            feature.get('LinkID').forEach(linkId=>{
                let link = feature.get("source").getFeatureById("LAYER_LN_LINK" + feature.get("Index") + "_" + linkId);
                console.log(link);
                if(link?.get("SNodeID") === ID) link?.set("SNodeID","");
                if(link?.get("ENodeID") === ID) link?.set("ENodeID","");
            });
            feature.set("LinkID",[]);
            feature.set("NumConLink",0);

            feature.get("source").getFeaturesAtCoordinate (feature.getGeometry().getFirstCoordinate()).forEach(x=>{
                if(x.get('group')==='LAYER_LN_LINK'){
                    var nodePoint = feature.getGeometry().getCoordinates();
                    var linkFirstPoint = x.getGeometry().getFirstCoordinate();
                    var linkLastPoint = x.getGeometry().getLastCoordinate();
                    if(JSON.stringify(nodePoint) === JSON.stringify(linkFirstPoint)){
                        x.set("SNodeID", ID);
                        feature.set("LinkID", [...feature.get('LinkID'), x.get("ID")])
                        feature.set("NumConLink", feature.get('LinkID').length);
                    }
                    if(JSON.stringify(nodePoint) === JSON.stringify(linkLastPoint)){
                        x.set("ENodeID", ID);
                        feature.set("LinkID", [...feature.get('LinkID'), x.get("ID")])
                        feature.set("NumConLink", feature.get('LinkID').length);
                    }
                }
            });
        }
        feature.set("PointXY", feature.getGeometry().getCoordinates());
        if (feature.getGeometry().getType() === "LineString") {
            feature.set("NumPoint", feature.getGeometry().getCoordinates().length);
        } else if (feature.getGeometry().getType() === "Polygon") {
            let polygon: any = feature.getGeometry().getCoordinates()[0];
            feature.set("NumPoint", polygon.length);
        }
    });
    featureService.selected("featureChange", e.features.getArray());
}
