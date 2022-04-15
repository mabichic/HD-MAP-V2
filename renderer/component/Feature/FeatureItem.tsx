import { ReactNode, SyntheticEvent, useContext, useEffect, useState } from "react";
import { featureService } from "../service/message.service";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import MapContext from "../context/MapContext";
import { Divider, FormControlLabel, Radio, RadioGroup, Tab, Tabs } from "@mui/material";
import FeatureGrid from "./FeatureGrid";
import { Feature } from "ol";
import { Select } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { LayerLanesideHader } from "./header/Laneside";
import { LayerLnLinkHader } from "./header/Link";
import { LayerLnNodeHader } from "./header/Node";
import { LayerPOIHader } from "./header/POI";
import { LayerRoadlightHader } from "./header/Roadlight";
import { LayerRoadmarkHader } from "./header/RoadMark";

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
    feature: Array<any>;
    source: VectorSource;
    header: Array<any>;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, feature, source, header, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ flexGrow: 1, padding: '0px' }}
        >
            {value === index && (
                <FeatureGrid feature={feature} source={source}
                    columnDefs={header}
                />
            )}
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
        console.log(features);
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
        });
        // let subscription = featureService.getMessage().subscribe(message => {
        //     if (message.state === "featureChange") {
        //         console.log(message);
        //         message.features.forEach((fea)=>{
        //             // console.log(source.getFeatureById(fea.getId()));
        //             // console.log(gridRef.current.api.getRowNode(fea.getId()));
        //             let rowNode = gridRef.current.api.getRowNode(fea.getId());
        //             if(typeof rowNode === 'undefined') return ; 
        //             rowNode.setDataValue('PointXY', fea.getGeometry().getFlatCoordinates());
        //             if(fea.getGeometry().getType()!=="Point"){
        //                 rowNode.setDataValue('NumPoint', fea.get("NumPoint"));
        //             }
        //             columnDefs.forEach((field)=>{
        //                 console.log(field.field);
        //                 if(field.field==="LinkID")  rowNode.setDataValue('LinkID', fea.get("LinkID"));
        //                 if(field.field==="NumConLink")  rowNode.setDataValue('NumConLink', fea.get("NumConLink"));
        //                 if(field.field==="SNodeID")  rowNode.setDataValue('SNodeID', fea.get("SNodeID"));
        //                 if(field.field==="ENodeID")  rowNode.setDataValue('ENodeID', fea.get("ENodeID"));
        //             });
        //             console.log(columnDefs);
        //         });
        //     }

        // });

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
                <TabPanel value={value} index={1} feature={layerLaneside} source={source} header={LayerLanesideHader} />
                <TabPanel value={value} index={2} feature={layerLnLink} source={source} header={LayerLnLinkHader} />
                <TabPanel value={value} index={3} feature={layerLnNode} source={source} header={LayerLnNodeHader} />
                <TabPanel value={value} index={4} feature={layerPoi} source={source} header={LayerPOIHader} />
                <TabPanel value={value} index={5} feature={layerRoadlight} source={source} header={LayerRoadlightHader} />
                <TabPanel value={value} index={6} feature={layerRoadmark} source={source} header={LayerRoadmarkHader} />
                <Tabs value={value} sx={{ backgroundColor: 'white' }} onChange={handleChange}>
                    <Tab label="Laneside" value={1} />
                    <Tab label="Link" value={2} />
                    <Tab label="Node" value={3} />
                    <Tab label="Poi" value={4} />
                    <Tab label="Roadlight" value={5} />
                    <Tab label="Roadmark" value={6} />
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