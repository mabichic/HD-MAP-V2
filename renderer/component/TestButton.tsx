import { Box, Grid } from "@mui/material";
import TileLayer from "ol/layer/Tile";
import { useContext, useEffect, useState } from "react";
import MapContext from "./context/MapContext";
import FeaturesContext from "./context/FeaturesContext";
import LayersContext from "./context/LayersContext";
import LayerItem from "./layer/LayerItem";
import VectorImageLayer from "ol/layer/VectorImage";
import { Rnd } from "react-rnd";
import { styled } from "@mui/styles";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import IconButton from '@mui/material/IconButton';

const style = {
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
    zIndex: "9999",
    minWidth: '200px'
} as const;

// const LayerListWrap = styled(Box)(
//     {
//     width: "100%", height: "100%",
//     backgroundColor: "white",
//     overflowY:"scroll"
// });
export default function TestButton() {
    const map = useContext(MapContext);

    const layerContext = useContext(LayersContext);
    const [layers, setLayers] = useState<Array<TileLayer<any> | VectorImageLayer<any> | null>>([]);

    useEffect(() => {
        if (map === null) return;
        let tempLayers = [];
        map.getLayers().forEach((layer) => {
            console.log(layer);
            tempLayers.push(layer);
        });
        setLayers(tempLayers);
    }, [map, layerContext])

    const onClick = () => {

    }
    const onClick2 = () => {
    }
    return (
        <Rnd minWidth={200} minHeight={200} bounds="body" default={{ x: 0, y: 0, width: 200, height: 200, }} style={style}>
            {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ height: "48px" }}>
                <Grid item xs={8}>
                    <div  className="handle">
                        레이어
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <>
                        <IconButton><CloseFullscreenIcon fontSize="small" /></IconButton>
                        <IconButton><OpenInFullIcon fontSize="small" /></IconButton>
                    </>

                </Grid>
            </Grid> */}
            {/* <div className="layerSwitcherHandle" style={{width:'100%'}}>제목표시줄</div> */}
            <div style={{ flexGrow: 1, width: '100%' }}>
                <div style={{
                    width: "100%", height: "100%",
                    backgroundColor: "white",
                    overflowY: "scroll"
                }}>
                    <div>
                        {layers?.map((layer, index) => {
                            return (
                                <LayerItem key={index} item={layer} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </Rnd>
    )
}