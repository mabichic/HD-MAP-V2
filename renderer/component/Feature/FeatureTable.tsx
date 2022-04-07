import { IconButton, ListItem, ListItemIcon, ListItemText, SvgIcon, Typography } from "@mui/material";
import { useEffect } from "react";
import { Rnd } from "react-rnd";
import { featureService } from "../service/message.service";
import Layer_icon from '../../public/images/layer_icon.svg'
import CloseIcon from '@mui/icons-material/Close';
import FeatureItem from "./FeatureItem";
function FeatureTable({ source, wrapRef, title, layer }) {
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
    const tableClose = () => {
        layer.set("dataVisible", false);
        featureService.dataVisible('unvisible', layer);
    }
    return (
        <div style={{
            position: "absolute",
            top: 0,
        }}
            onMouseDown={gridClick}
        >
            <Rnd minWidth={630} minHeight={400} bounds="body" default={{ x: 400, y: 400, width: 630, height: 400, }} style={style} dragHandleClassName="featureHandle">
                <div className="featureHandle" style={{ width: '100%', display: "flex", cursor: "move", backgroundColor: "#30459A" }}>
                    <ListItem sx={{ paddingTop: '3px', paddingBottom: '3px' }}>
                        <ListItemIcon sx={{ fontSize: 10, minWidth: '30px' }}>
                            <SvgIcon sx={{ fill: '#fff', width: '20px' }}>
                                <Layer_icon />
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText sx={{ color: "#fff" }}>
                            <Typography variant="subtitle2">
                                {title}
                            </Typography>
                        </ListItemText>
                        <IconButton onClick={tableClose}>
                            <CloseIcon fontSize="small" sx={{ fill: '#fff' }} />
                        </IconButton>
                    </ListItem>
                </div>
                <div style={{ flexGrow: 1, width: '100%', padding:'0px' }}>
                    <FeatureItem index={1} source={source} />
                </div>
            </Rnd>
        </div>
    )
}

export default FeatureTable;