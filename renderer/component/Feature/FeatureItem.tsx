import { SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import FeaturesContext from "../context/FeaturesContext";
import { featureService } from "../service/message.service";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import GeoJSON from "ol/format/GeoJSON";
import SourcesContext from "../context/SourcesContext";
import MapContext from "../context/MapContext";
import { FormControlLabel, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import FeatureGrid from "./FeatureGrid";
import { Feature } from "ol";
import { Select } from "ol/interaction";
import { TabContext, TabList, TabPanel } from "@mui/lab";



export default function FeatureItem({ index, source }) {

    const map = useContext(MapContext);


    const [feature, setFeature] = useState([]);
    const [layerLaneside, setLayerLaneside] = useState([]);
    const [layerLnLink, setlayerLnLink] = useState([]);
    const [layerLnNode, setlayerLnNode] = useState([]);
    const [layerPoi, setlayerPoi] = useState([]);
    const [layerRoadlight, setlayerRoadlight] = useState([]);
    const [layerRoadmark, setlayerRoadmark] = useState([]);
    const [filter, setFilter] = useState([]);
    const [viewer, setViewer] = useState('all');

    const [value, setValue] = useState('1');
    const onRowSelected = (e) => {
        if (e.node.isSelected()) {
            let feature = source.getFeatureById(e.node.data.featureID);
            if (isFinite(feature.getGeometry().getExtent()[0]) && isFinite(feature.getGeometry().getExtent()[1]) && isFinite(feature.getGeometry().getExtent()[2]) && isFinite(feature.getGeometry().getExtent()[3])) {
                map.getView().fit(feature.getGeometry().getExtent(), { duration: 500, size: map.getSize(), maxZoom: 23, padding: [0, 0, 0, 0] });
            }

        }
    };
    const init = () => {
        let layer_laneside = [];
        let layer_ln_link = [];
        let layer_ln_node = [];
        let layer_poi = [];
        let layer_roadlight = [];
        let layer_roadmark = [];

        const pushData = (feature: any, group: string, dataSet: Array<any>) => {
            if (feature.get("group") === group) {
                let data = feature.getProperties();
                data.featureID = feature.getId();
                dataSet.push(data);
            }
        }
        source.getFeatures().forEach((feature) => {
            pushData(feature, 'LAYER_LANESIDE', layer_laneside);
            pushData(feature, 'LAYER_LN_LINK', layer_ln_link);
            pushData(feature, 'LAYER_LN_NODE', layer_ln_node);
            pushData(feature, 'LAYER_POI', layer_poi);
            pushData(feature, 'LAYER_ROADLIGHT', layer_roadlight);
            pushData(feature, 'LAYER_ROADMARK', layer_roadmark);
        });
        setLayerLaneside(layer_laneside);
        setlayerLnLink(layer_ln_link);
        setlayerLnNode(layer_ln_node);
        setlayerPoi(layer_poi);
        setlayerRoadlight(layer_roadlight);
        setlayerRoadmark(layer_roadmark);
    }
    const update = (features: Array<Feature>) => {
        let selectedFeatureIDS = [];
        features.forEach((feature) => {
            selectedFeatureIDS.push(feature.getId());
        })
        let layer_laneside = [];
        let layer_ln_link = [];
        let layer_ln_node = [];
        let layer_poi = [];
        let layer_roadlight = [];
        let layer_roadmark = [];
        const pushData = (feature: any, group: string, dataSet: Array<any>) => {
            if (selectedFeatureIDS.includes(feature.getId())&&feature.get("group") === group) {
                let data = feature.getProperties();
                data.featureID = feature.getId();
                dataSet.push(data);
            }
        }
        source.getFeatures().forEach((feature) => {
            pushData(feature, 'LAYER_LANESIDE', layer_laneside);
            pushData(feature, 'LAYER_LN_LINK', layer_ln_link);
            pushData(feature, 'LAYER_LN_NODE', layer_ln_node);
            pushData(feature, 'LAYER_POI', layer_poi);
            pushData(feature, 'LAYER_ROADLIGHT', layer_roadlight);
            pushData(feature, 'LAYER_ROADMARK', layer_roadmark);
        });
        console.log(layer_laneside);
        setLayerLaneside(layer_laneside);
        setlayerLnLink(layer_ln_link);
        setlayerLnNode(layer_ln_node);
        setlayerPoi(layer_poi);
        setlayerRoadlight(layer_roadlight);
        setlayerRoadmark(layer_roadmark);
    }
    useEffect(() => {
        if (viewer === "all") init();
        else if (viewer === "selected") {
            let select;
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof Select) {
                    select = interaction;
                }
            });
            update(select.getFeatures());

        }

    }, [viewer])

    useEffect(() => {
        let subscription = featureService.getMessage().subscribe(message => {
            console.log(message);
            if (message) {
                if (viewer === "selected" && message.state === "selected") {
                    update(message.features);
                }
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [feature, viewer])




    const viewerChange = (e) => {
        setViewer(e.target.value);
        if (e.target.value === "all") init();
    }

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
            <div style={{ height: '50px' }}>
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
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TabContext value={value}>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="1">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                            <FeatureGrid feature={layerLaneside} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
                        </div>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="2">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                            <FeatureGrid feature={layerLnLink} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
                        </div>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="3">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                            <FeatureGrid feature={layerLnNode} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
                        </div>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="4">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                            <FeatureGrid feature={layerPoi} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
                        </div>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="5">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                            <FeatureGrid feature={layerRoadlight} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
                        </div>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="6">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
                            <FeatureGrid feature={layerRoadmark} onRowSelected={onRowSelected} viewer={viewer} filter={filter} />
                        </div>
                    </TabPanel>
                    <TabList sx={{ height: '50px' }} onChange={handleChange} aria-label="lab API tabs example" variant="scrollable" scrollButtons="auto">
                        <Tab label="Laneside" value="1" />
                        <Tab label="Link" value="2" />
                        <Tab label="Node" value="3" />
                        <Tab label="Poi" value="4" />
                        <Tab label="Roadlight" value="5" />
                        <Tab label="Roadmark" value="6" />
                    </TabList>
                </TabContext>

            </div>
        </div >
    )
}