import { Box, Chip, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIcon } from "@mui/material";
import TileLayer from "ol/layer/Tile";
import { useContext, useEffect, useState } from "react";
import MapContext from "./context/MapContext";
import LayerItem from "./layer/LayerItem";
import VectorImageLayer from "ol/layer/VectorImage";
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
export default function TestButton({ layers }) {
    const theme = useTheme();

    const [open, setOpen] = useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
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
                    <ListItem>
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
                    </ListItem>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ fill: '#fff' }} /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader >
                <List >
                    {layers?.map((layer, index) => {
                        return (
                            <div key={index}>
                                {index > 0 && (
                                    <Divider />
                                )
                                }
                                <LayerItem key={layer.get('title')} item={layer} />
                            </div>
                        )
                    })}
                </List>
            </Drawer>
        </>
    )
}