import { Divider, FormControlLabel, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Feature } from "ol";
import { Select } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { ReactNode, SyntheticEvent, useContext, useEffect, useState } from "react";
import MapContext from "../context/MapContext";
import { featureService } from "../service/message.service";
import FeatureGrid from "./FeatureGrid";
import { LayerLanesideHader } from "./header/Laneside";
import { LayerLnLinkHader } from "./header/Link";
import { LayerLnNodeHader } from "./header/Node";
import { LayerPOIHader } from "./header/POI";
import { LayerRoadlightHader } from "./header/Roadlight";
import { LayerRoadmarkHader } from "./header/RoadMark";
import { LayerSafepoint } from "./header/Safepoint";

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
    feature: Array<any>;
    source: VectorSource;
    header: Array<any>;
    type: string;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, feature, source, header, type, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ flexGrow: 1, padding: '0px' }}
        >
            <FeatureGrid
                feature={feature}
                source={source}
                columnDefs={header}
                type={type}
                visible={value !== index}
            />
        </div>
    );
}

export default function FeatureItem({ index, source }) {

    const map = useContext(MapContext);


    const [feature, setFeature] = useState([]);
    const [layerLaneside, setLayerLaneside] = useState([]);
    const [layerLnLink, setlayerLnLink] = useState([]);
    const [layerLnNode, setlayerLnNode] = useState([]);
    const [layerPoi, setlayerPoi] = useState([]);
    const [layerRoadlight, setlayerRoadlight] = useState([]);
    const [layerRoadmark, setlayerRoadmark] = useState([]);
    const [layerSafepoint, setlayerSafepoint] = useState([]);
    const [filter, setFilter] = useState([]);
    const [viewer, setViewer] = useState('all');

    const [value, setValue] = useState(1);

    const init = () => {
        let layer_laneside = [];
        let layer_ln_link = [];
        let layer_ln_node = [];
        let layer_poi = [];
        let layer_roadlight = [];
        let layer_roadmark = [];
        let layer_safepoint = [];
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
            pushData(feature, 'LAYER_SAFEPOINT', layer_safepoint);
        });
        setLayerLaneside(layer_laneside);
        setlayerLnLink(layer_ln_link);
        setlayerLnNode(layer_ln_node);
        setlayerPoi(layer_poi);
        setlayerRoadlight(layer_roadlight);
        setlayerRoadmark(layer_roadmark);
        setlayerSafepoint(layer_safepoint);
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
        let layer_safepoint = [];
        const pushData = (feature: any, group: string, dataSet: Array<any>) => {
            if (selectedFeatureIDS.includes(feature.getId()) && feature.get("group") === group) {
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
            pushData(feature, 'LAYER_SAFEPOINT', layer_safepoint);
        });
        setLayerLaneside(layer_laneside);
        setlayerLnLink(layer_ln_link);
        setlayerLnNode(layer_ln_node);
        setlayerPoi(layer_poi);
        setlayerRoadlight(layer_roadlight);
        setlayerRoadmark(layer_roadmark);
        setlayerSafepoint(layer_safepoint);
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
            if (message.state === "selected") {
                if (viewer === "selected") {
                    let select;
                    map.getInteractions().forEach((interaction) => {
                        if (interaction instanceof Select) {
                            select = interaction;
                        }
                    });
                    update(select.getFeatures());

                }
            }
            if (message.state === "featureChange") {
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
            }
            if (message.state === "featureAppend") {
                if (viewer === "all") init();
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

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
            <div style={{ height: '50px', backgroundColor: 'white', padding: '0px' }}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={viewer}
                    onChange={viewerChange}
                    sx={{ paddingLeft: '20px' }}
                >
                    <FormControlLabel value="all" control={<Radio />} label="모두보기" />
                    <FormControlLabel value="selected" control={<Radio />} label="선택된 객체만 보기" />
                </RadioGroup>
                <Divider />
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TabPanel value={value} index={1} type={"layerLaneside"} feature={layerLaneside} source={source} header={LayerLanesideHader} />
                <TabPanel value={value} index={2} type={"layerLnLink"} feature={layerLnLink} source={source} header={LayerLnLinkHader} />
                <TabPanel value={value} index={3} type={"layerLnNode"} feature={layerLnNode} source={source} header={LayerLnNodeHader} />
                <TabPanel value={value} index={4} type={"layerPoi"} feature={layerPoi} source={source} header={LayerPOIHader} />
                <TabPanel value={value} index={5} type={"layerRoadlight"} feature={layerRoadlight} source={source} header={LayerRoadlightHader} />
                <TabPanel value={value} index={6} type={"layerRoadmark"} feature={layerRoadmark} source={source} header={LayerRoadmarkHader} />
                <TabPanel value={value} index={7} type={"layerSafepoint"} feature={layerSafepoint} source={source} header={LayerSafepoint} />
                <Tabs value={value} sx={{ backgroundColor: 'white' }} onChange={handleChange}>
                    <Tab label="Laneside" value={1} />
                    <Tab label="Link" value={2} />
                    <Tab label="Node" value={3} />
                    <Tab label="Poi" value={4} />
                    <Tab label="Roadlight" value={5} />
                    <Tab label="Roadmark" value={6} />
                    <Tab label="Safepoint" value={7} />
                </Tabs>
                {/* <TabContext value={value}>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="1">
                            <FeatureGrid feature={layerLaneside} source={source}/>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="2">
                            <FeatureGrid feature={layerLnLink} source={source}/>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="3">
                            <FeatureGrid feature={layerLnNode} source={source}/>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="4">
                            <FeatureGrid feature={layerPoi} source={source}/>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="5">
                            <FeatureGrid feature={layerRoadlight} source={source}/>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="6">
                            <FeatureGrid feature={layerRoadmark}  source={source}/>
                    </TabPanel>
                    <Divider />
                    <TabList sx={{ height: '50px', backgroundColor:'white' }} onChange={handleChange} aria-label="lab API tabs example" variant="scrollable" scrollButtons="auto">
                        <Tab label="Laneside" value="1" />
                        <Tab label="Link" value="2" />
                        <Tab label="Node" value="3" />
                        <Tab label="Poi" value="4" />
                        <Tab label="Roadlight" value="5" />
                        <Tab label="Roadmark" value="6" />
                    </TabList>
                </TabContext> */}

            </div>
        </div >
    )
}