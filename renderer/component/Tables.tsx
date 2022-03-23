import zIndex from "@mui/material/styles/zIndex";
import TileLayer from "ol/layer/Tile";
import VectorImageLayer from "ol/layer/VectorImage";
import { useContext, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import LayersContext from "./context/LayersContext";
import MapContext from "./context/MapContext";
import FeatureItem from "./Feature/FeatureItem";
import { featureService } from "./service/message.service";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, ListItem, ListItemIcon, ListItemText, SvgIcon } from "@mui/material";
import Layer_icon from '../public/images/layer_icon.svg'
const Test = ({ visible, source, wrapRef, title, layer }) => {

    const style = {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #ddd",
        background: "#f0f0f0",
        zIndex: 1200,
        minWidth: '200px',
    } as const;
    const gridClick = (e) => {
        for (let item of wrapRef.current.children) {
            item.style.zIndex = 1199;
        }
        e.currentTarget.style.zIndex = 1200;
    }
    const daraClose = () => {
        layer.set("dataVisible", false);
        featureService.dataVisible('visible', layer);
    }
    if (visible) {
        return (
            <div style={{
                position: "absolute",
                top: 0,
            }}
                onMouseDown={gridClick}
            >

                <Rnd minWidth={630} minHeight={400} bounds="body" default={{ x: 200, y: 0, width: 200, height: 200, }} style={style} dragHandleClassName="featureHandle">
                    <div className="featureHandle" style={{ width: '100%', display: "flex", cursor: "move", backgroundColor: "#30459A" }}>

                        <ListItem sx={{paddingTop:'3px',paddingBottom:'3px'}}> 
                            <ListItemIcon sx={{ fontSize: 10, minWidth: '30px' }}>
                                <SvgIcon sx={{ fill: '#fff', width:'20px' }}>
                                    <Layer_icon />
                                </SvgIcon>
                            </ListItemIcon>
                            <ListItemText sx={{ color: "#fff" }}>
                                {title}
                            </ListItemText>
                            <IconButton onClick={daraClose}>
                                <CloseIcon fontSize="small" sx={{ fill: '#fff' }} />
                            </IconButton>
                        </ListItem>

                        {/* <div style={{ flexGrow: 1 }}>
                            {title}
                        </div>
                        <div style={{ width: '50px', textAlign: 'right' }}>
                            <IconButton onClick={daraClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </div> */}
                    </div>
                    <div style={{ flexGrow: 1, width: '100%' }}>
                        <FeatureItem index={1} source={source} />
                    </div>
                </Rnd>
            </div>
        )
    } else {
        return null
    }
}

export default function Tables() {
    const wrapRef = useRef(null);
    const map = useContext(MapContext);
    const layerContext = useContext(LayersContext);
    const [layers, setLayers] = useState<Array<TileLayer<any> | VectorImageLayer<any> | null>>([]);
    useEffect(() => {
        if (map === null) return;
        let tempLayers = [];
        map.getLayers().forEach((layer) => {
            tempLayers.push(layer);
        });
        setLayers(tempLayers);
    }, [map, layerContext])
    useEffect(() => {
        let subscription = featureService.getMessage().subscribe(message => {
            if (message.state === 'visible') {
                if (map === null) return;
                let tempLayers = [];
                map.getLayers().forEach((layer) => {
                    tempLayers.push(layer);
                });
                setLayers(tempLayers);
            }
        });
    }, [map]);
    return (
        <div ref={wrapRef}>
            {layers.map((layer, index) => {
                if (layer.get('title') !== '브이월드') {
                    return <Test key={index} visible={layer.get('dataVisible')} source={layer.getSource()} wrapRef={wrapRef} title={layer.get('title')} layer={layer} />
                }
            })}
        </div>
    )
}