import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import FeatureItem from "./Feature/FeatureItem";
import { featureService } from "./service/message.service";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, ListItem, ListItemIcon, ListItemText, SvgIcon } from "@mui/material";
import Layer_icon from '../public/images/layer_icon.svg'
const Test = ({ source, wrapRef, title, layer, state }) => {
    useEffect(() => {
        return () => {
            console.log("이건안되나");
            state((value) => {
                console.log("밸류가 몇일까");
                return value - 1
            });
        }
    }, []);
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
    return (
        <div style={{
            position: "absolute",
            top: 0,
        }}
            onMouseDown={gridClick}
        >
            <Rnd minWidth={630} minHeight={400} bounds="body" default={{ x: 400, y: 400, width: 200, height: 200, }} style={style} dragHandleClassName="featureHandle">
                <div className="featureHandle" style={{ width: '100%', display: "flex", cursor: "move", backgroundColor: "#30459A" }}>
                    <ListItem sx={{ paddingTop: '3px', paddingBottom: '3px' }}>
                        <ListItemIcon sx={{ fontSize: 10, minWidth: '30px' }}>
                            <SvgIcon sx={{ fill: '#fff', width: '20px' }}>
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
                </div>
                <div style={{ flexGrow: 1, width: '100%' }}>
                    <FeatureItem index={1} source={source} />
                </div>
            </Rnd>
        </div>
    )
}

export default function Tables({ layers }) {
    const wrapRef = useRef(null);

    const [openModal, setOpenModal] = useState(false);
    useEffect(() => {
        let subscription = featureService.getMessage().subscribe(message => {
            if (message.state === "visible") {
                setOpenModal((value) => !value);
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [layers])
    return (
        <div ref={wrapRef}>
            {layers.map((layer, index) => {

                if (layer.get('title') !== '브이월드' && layer.get('dataVisible')) {
                    return <Test key={index} source={layer.getSource()} wrapRef={wrapRef} title={layer.get('title')} layer={layer} state={setOpenModal} />
                }
            })}
        </div>
    )
}
