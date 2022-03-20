import { useCallback, useContext, useEffect, useRef, useState } from "react";
import FeaturesContext from "../context/FeaturesContext";
import { featureService } from "../service/message.service";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import GeoJSON from "ol/format/GeoJSON";
import SourcesContext from "../context/SourcesContext";
import MapContext from "../context/MapContext";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import FeatureGrid from "./FeatureGrid";



export default function FeatureItem({ index, source }) {

    const map = useContext(MapContext);


    const [feature, setFeature] = useState([]);
    const [filter, setFilter] = useState([]);
    const [viewer, setViewer] = useState('all');
    const onRowSelected = (e) => {
        if (e.node.isSelected()) {
            let feature = source.getFeatureById(e.node.data.featureID);
            if (isFinite(feature.getGeometry().getExtent()[0]) && isFinite(feature.getGeometry().getExtent()[1]) && isFinite(feature.getGeometry().getExtent()[2]) && isFinite(feature.getGeometry().getExtent()[3])) {
                //   select.getFeatures().clear();
                //   select.getFeatures().push(feature);
                map.getView().fit(feature.getGeometry().getExtent(), { duration: 500, size: map.getSize(), maxZoom: 23, padding: [0, 0, 0, 0] });
            }

        }
    };
    const init = () => {
        let gejsons = new GeoJSON().writeFeatures(source.getFeatures());
        let json = JSON.parse(gejsons);
        let datas = [];
        json.features.map((j) => {
            if (j.properties.group === "LAYER_LANESIDE") {
                let data = j.properties;
                data.featureID = j.id;

                datas.push(data);
            }
        });
        setFeature(datas);

    }
    const update = (featureID: string) => {
        const findFeatureID = (feature) => {
            return feature.featureID === featureID;
        }

        let updateFeature = source.getFeatureById(featureID);
        let data = JSON.parse(new GeoJSON().writeFeature(updateFeature)).properties;
        data.featureID = updateFeature.id;
        console.log(feature);
        console.log(featureID);
        let temp = feature.map(
            fea => fea.featureID === featureID
                ? {
                    ...fea, PointXY: data.PointXY
                } :
                fea
        );
        setFeature(
            feature.filter(
                fea => fea.featureID === featureID
            )
        );
    }
    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        let subscription = featureService.getMessage().subscribe(message => {
            if (message) {
                //externalFilterChanged('selected');
                //setFilter([4352,4353,4350]);
                console.log(message);
                if (viewer === "selected" && message.selected==="selected") update(message.features);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [feature, viewer])




    const viewerChange = (e) => {
        setViewer(e.target.value);
        console.log(viewer);
        if (e.target.value === "all") init();
    }
    return (
        <>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={viewer}
                onChange={viewerChange}
            >
                <FormControlLabel value="all" control={<Radio />} label="모두보기" />
                <FormControlLabel value="selected" control={<Radio />} label="선택된 객체만 보기" />
            </RadioGroup>
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                <FeatureGrid feature={feature} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
            </div>
        </>
    )
}