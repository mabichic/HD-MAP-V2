import { Map } from "ol";
import { DragBox, Select } from "ol/interaction";
import { DragBoxEvent } from "ol/interaction/DragBox";
import VectorImageLayer from "ol/layer/VectorImage";
import { DRAW } from "../HdMap";
import { featureService } from "../service/message.service";

export default function BoxEnd(evt: DragBoxEvent, select: Select, map: Map, dragBox: DragBox) {
  if (map.get("STATE") === DRAW) return;
  const selectedFeatures = select.getFeatures();
  selectedFeatures.clear();
  const rotation = map.getView().getRotation();
  const oblique = rotation % (Math.PI / 2) !== 0;
  const candidateFeatures = oblique ? [] : selectedFeatures;
  const extent = dragBox.getGeometry().getExtent();
  map.getLayers().forEach((layer: VectorImageLayer<any>) => {
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
}
