import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { featureService } from "../service/message.service";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import MapContext from "../context/MapContext";
import { Divider, FormControlLabel, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
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
            <div style={{ height: '50px' , backgroundColor:'white', padding:'0px'}}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={viewer}
                    onChange={viewerChange}
                    sx={{paddingLeft:'20px'}}
                >
                    <FormControlLabel value="all" control={<Radio />} label="모두보기"/>
                    <FormControlLabel value="selected" control={<Radio />} label="선택된 객체만 보기" />
                </RadioGroup>
                <Divider />
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TabContext value={value}>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="1">
                            <FeatureGrid feature={layerLaneside}/>
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="2">
                            <FeatureGrid feature={layerLnLink} />
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="3">
                            <FeatureGrid feature={layerLnNode} />
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="4">
                            <FeatureGrid feature={layerPoi} />
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="5">
                            <FeatureGrid feature={layerRoadlight} />
                    </TabPanel>
                    <TabPanel sx={{ flexGrow: 1, padding: '0px' }} value="6">
                            <FeatureGrid feature={layerRoadmark}  />
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
                </TabContext>

            </div>
        </div >
    )
}