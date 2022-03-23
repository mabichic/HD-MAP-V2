import { Box, Chip, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon } from "@mui/material";
import TileLayer from "ol/layer/Tile";
import { useContext, useEffect, useState } from "react";
import MapContext from "./context/MapContext";
import FeaturesContext from "./context/FeaturesContext";
import LayersContext from "./context/LayersContext";
import LayerItem from "./layer/LayerItem";
import VectorImageLayer from "ol/layer/VectorImage";
import { Rnd } from "react-rnd";
import { styled, useTheme } from '@mui/material/styles';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FeatureItem from "./Feature/FeatureItem";
import Tables from "./Tables";
import Layer from "ol/layer/Layer";
import { layerService } from "./service/message.service";
import Layer_icon from '../public/images/layer_icon.svg'
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
const DrawerHeader = styled('div')(({ theme }) => ({
    width: '280px',
    height: '43px',
    // padding: '1rem',
    color: 'white',
    display: 'flex',
    alignItems: 'left',
    minHeight: '43px',
    backgroundColor: "#30459A",
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
}));


function compare(a: TileLayer<any> | VectorImageLayer<any>, b: TileLayer<any> | VectorImageLayer<any>) {
    return b.getZIndex() - a.getZIndex()
}
export default function TestButton() {
    const theme = useTheme();
    const map = useContext(MapContext);


    const layerContext = useContext(LayersContext);
    const [layers, setLayers] = useState<Array<TileLayer<any> | VectorImageLayer<any> | null>>([]);

    useEffect(() => {
        if (map === null) return;
        let tempLayers = [];
        map.getLayers().forEach((layer) => {
            tempLayers.push(layer);
        });
        tempLayers.sort(compare);
        setLayers(tempLayers);
        console.log(tempLayers);
    }, [map, layerContext])

    const [open, setOpen] = useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        let subscription = layerService.getMessage().subscribe(message => {
            let tempLayers = [];
            let messageIndex = -1;
            let tempZIndex = -1;
            map.getLayers().forEach((layer, index) => {
                tempLayers.push(layer);
            });
            tempLayers.sort(compare);
            tempLayers.forEach((layer, index) => {
                if (layer === message.layer) {
                    messageIndex = index;
                    tempZIndex = layer.getZIndex();
                }
            });
            //동일한 레이어가 없으면 에러상태임
            console.log(tempZIndex);
            if (tempZIndex === -1) return;
            if (message.state === "zIndexUp" && messageIndex > 0) {
                tempLayers[messageIndex].setZIndex(tempLayers[messageIndex - 1].getZIndex());
                tempLayers[messageIndex - 1].setZIndex(tempZIndex);
            } else if (message.state === "zIndexDown" && (messageIndex < tempLayers.length - 1)) {
                tempLayers[messageIndex].setZIndex(tempLayers[messageIndex + 1].getZIndex());
                tempLayers[messageIndex + 1].setZIndex(tempZIndex);
            }


            tempLayers.sort(compare);
            setLayers(tempLayers);
        });
        return () => {
            subscription.unsubscribe();
        };

        // let subscription = featureService.getMessage().subscribe(message => {

        //     if (message) {
        //         if (viewer === "selected" && message.state === "selected") {
        //             update(message.features);
        //         }
        //     }
        // });


    }, [layers]);
    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <>
            {!open &&
                <div style={{
                    position: 'absolute',
                    left: '0px',
                    top: '50%',
                    backgroundColor: 'white',
                    zIndex: 1199
                }}>
                    <IconButton onClick={handleDrawerOpen}>
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                </div>
            }
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}

            >
                <DrawerHeader>
                    <ListItemButton component="a" href="#customized-list">
                        <ListItemIcon sx={{ fontSize: 15, minWidth: '30px' }}>
                            <SvgIcon sx={{ fill: '#fff', width: '20px' }}>
                                <Layer_icon />
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText
                            sx={{ my: 0 }}
                            primary="Lyaer list"
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: 'medium',
                                letterSpacing: 0,
                            }}
                        />
                    </ListItemButton>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ fill: '#fff' }} /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader >
                <List >
                    {layers?.map((layer, index) => {
                        return (
                            <>
                                {index > 0 && (
                                    <Divider />
                                )
                                }
                                <ListItem key={index} disablePadding>
                                    <LayerItem item={layer} />
                                </ListItem>
                            </>
                        )
                    })}
                </List>
                {/* // <Rnd minWidth={200} minHeight={200} bounds="body" default={{ x: 0, y: 0, width: 200, height: 200, }} style={style}> */}
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

            </Drawer>


        </>
    )
}