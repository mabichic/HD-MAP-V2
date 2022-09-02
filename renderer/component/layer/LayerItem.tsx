import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, FormGroup, FormLabel, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Slider, SvgIcon, Switch, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { MouseEvent, useContext, useEffect, useState } from "react";
import OpacityIcon from '../../public/images/opacity _icon.svg';
import { alertService, confrimService, confrimValueService, featureCopyService, featureService, layerService } from "../service/message.service";


import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import TocIcon from '@mui/icons-material/Toc';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { Select } from "ol/interaction";
import MapContext from "../context/MapContext";

import { ipcRenderer } from "electron";
import GeoJSON from "ol/format/GeoJSON";
import { setCopyUndo, setUpUnDoReDoIndex } from "../modify/UndoRedo";
import { selectService } from "../service/message.service";
import Save from './fn/Save';
const Warp = styled(Box)({
    display: "inline-block", width: '100%', textAlign: 'left', padding: '10px', marginBottom: '17px', paddingRight: '20px', paddingLeft: '20px'
});
const LayerNames = ['LAYER_LANESIDE', 'LAYER_LN_LINK', 'LAYER_LN_NODE', 'LAYER_POI', 'LAYER_ROADLIGHT', 'LAYER_ROADMARK', 'LAYER_SAFEPOINT'];
const CustomSlider = styled(Slider)({
    color: '#30459A',
    '& .MuiSlider-thumb': {
        height: 15,
        width: 15,
    },
});

const CustomSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#30459A',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#CAD2FC',
    },
});


function fnSort(a: any, b: any) {
    return a['ID'] - b['ID']
}
export default function LayerItem({ item }) {
    const map = useContext(MapContext);
    const [showTable, setShowTable] = useState(false);
    const [visible, setVisible] = useState(item.getVisible());
    const [editor, setEditor] = useState(typeof item.get('selectable') === "undefined" ? false : item.get('selectable'));
    const [opacity, setOpacity] = useState(item.getOpacity() * 100);

    const [saveAnchorEl, setSaveAnchorEl] = useState<null | HTMLElement>(null);
    const saveMenuOpen = Boolean(saveAnchorEl);

    const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
    const addMenuOpen = Boolean(addAnchorEl);

    const visibleSwitch = (e) => {
        item.setVisible(e.target.checked);
        setVisible(e.target.checked);
    }
    const edtiorSwitch = (e) => {
        item.set("selectable", e.target.checked);

        let select;
        map.getInteractions().forEach((interaction) => {
            if (interaction instanceof Select) {
                select = interaction;
            }
        });
        // select.getFeatures();
        if (!e.target.checked) {
            select.getFeatures().clear();
            featureService.selected("selected", []);
        }
        setEditor(e.target.checked);
    }
    const opacitySwitch = (e) => {
        let value = e.target.value;
        value = value * 0.01;
        item.setOpacity(value);
        setOpacity(e.target.value);
    }



    const showTableCheck = (e) => {
        item.set('dataVisible', true);
        featureService.dataVisible('visible', item);
    }
    const ZIndexUp = (e) => {
        layerService.layerSort('zIndexUp', item);
    }
    const ZIndexDown = (e) => {
        layerService.layerSort('zIndexDown', item);
    }
    const zoomToExtend = (e) => {
        let mbr = item.getSource().getExtent();
        map.getView().fit(mbr);
    }

    const layerDelete = (e) => {
        // map.removeLayer(item);
        const dellLayer = () => {
            layerService.layerSort('layerDelete', item);
            let select;
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof Select) {
                    select = interaction;
                }
            });
            select.getFeatures().clear();
        }
        confrimService.sendMessage("레이어 제거", item.get('title') + " 레이어를 정말 제거 하시겠습니까? \n\r 저장하지 않은 데이터는 손실됩니다. ", dellLayer, null);
    }

    const saveLayer = (event: MouseEvent<HTMLButtonElement>) => {
        setSaveAnchorEl(event.currentTarget);
    }
    const saveMenuHandleClose = () => {
        setSaveAnchorEl(null);
    };

    const addObject = (event: MouseEvent<HTMLButtonElement>) => {
        setAddAnchorEl(event.currentTarget);
    }
    const addMenuHandleClose = () => {
        setAddAnchorEl(null);
    };

    const addObjectItem = (type) => {
        setAddAnchorEl(null);
        selectService.selectActive(false);
        if (item.get("filePaths")[type] === null || typeof item.get("filePaths")[type] === "undefined") {
            alertService.sendMessage("Error.", `선택하신 Layer Set 엔 ${type} 이(가) 존재하지 않습니다.`);
            return;
        }
        let temp = item.getSource().getFeatures().filter((feature) => {
            return feature.get("group") === type
        });
        let maxID = Math.max.apply(Math, temp.map(function (o) {
            return o.get("ID");
        }));
        item.getSource().get("layerDrawSwitch")(type, maxID, item.get("layerIndex"), item.get("source"));
    }


    const pushData = (feature: any, group: string, dataSet: Array<any>) => {
        if (feature.get("group") === group) {
            let data = feature.getProperties();
            data.featureID = feature.getId();
            delete data['source']; delete data['geometry']; delete data['featureID']; delete data['group'];
            dataSet.push(data);
        }
    }


    const saveObjectItem = (type) => {
        /* 
            벨리데이션 체크 해야함. 
        */
        setSaveAnchorEl(null);
        if (type === "LAYER_LN_LINK" || type === "LAYER_LN_NODE") {
            confrimValueService.sendMessage("레이어 저장", "Link 또는 Node 오브젝트는 저장시 하나의 세트로 저장합니다.", Save, null, type, item);
        } else {
            confrimValueService.sendMessage("레이어 저장", `${type}을 저장하시겠습니까?`, Save, null, type, item);
        }

    }
    const saveAllObjectItem = () => {
        setSaveAnchorEl(null);
        confrimValueService.sendMessage("레이어 저장", `모든 오브젝트를 저장하시겠습니까?`, Save, null, 'all', item);


    }
    useEffect(() => {
        let copySubscription;
        if (item.get('hdSet')) {

            if (item.get("zIndex") === map.getLayers().getLength() - 2) {
                copySubscription = featureCopyService.getMessage().subscribe(message => {


                    let features = new GeoJSON().readFeatures(message.features);
                    let copyFeatures = [];
                    let updateFeatures = [];
                    features.forEach((feature) => {
                        if (item.get("filePaths")[feature.get("group")] === null) {
                            return;
                        }
                        let temp = item.getSource().getFeatures().filter((originFeature) => {
                            return originFeature.get("group") === feature.get("group")
                        });
                        let maxID = Math.max.apply(Math, temp.map(function (o) {
                            return o.get("ID");
                        }));
                        if (!isFinite(maxID)) maxID = 1;
                        else maxID += 1;
                        let copyFeature = feature.clone();
                        let type = copyFeature.get("group");
                        copyFeature.setId(copyFeature.get("group") + item.get("layerIndex") + "_" + maxID);
                        copyFeature.set("ID", maxID);
                        copyFeature.set("Index", item.get("layerIndex"));
                        copyFeature.set("source", item.getSource());

                        if (type === "LAYER_LN_LINK") {
                            copyFeature.set('SNodeID', '');
                            copyFeature.set('ENodeID', '');
                        } else if (type === "LAYER_LN_NODE") {
                            copyFeature.set('NumConLink', 0);
                            copyFeature.set('LinkID', []);
                        } else if (type === "LAYER_ROADLIGHT" || type === "LAYER_ROADMARK") {
                            copyFeature.set('NumStopLine', 0);
                            copyFeature.set('StopLineID', []);
                        }

                        copyFeatures.push(copyFeature);
                        item.getSource().addFeature(copyFeature);
                    });
                    copyFeatures.forEach((feature) => {
                        let type = feature.get("group");
                        let id = feature.get("ID");
                        if (type === "LAYER_LN_LINK") {
                            feature.get("source").getFeaturesAtCoordinate(feature.getGeometry().getFirstCoordinate()).forEach(x => {
                                if (x?.get('group') === 'LAYER_LN_NODE') {
                                    let linkID = Array.from(new Set([...x.get('LinkID'), id]));
                                    x.set("LinkID", linkID);
                                    x.set("NumConLink", x.get('LinkID').length);
                                    feature.set("SNodeID", x.get("ID"));
                                }
                            });
                            feature.get("source").getFeaturesAtCoordinate(feature.getGeometry().getLastCoordinate()).forEach(x => {
                                if (x?.get('group') === 'LAYER_LN_NODE') {
                                    let linkID = Array.from(new Set([...x.get('LinkID'), id]));
                                    x.set("LinkID", linkID);
                                    x.set("NumConLink", x.get('LinkID').length);
                                    feature.set("ENodeID", x.get("ID"));
                                }
                            });
                        } else if (type === "LAYER_LN_NODE") {
                            feature.get("source").getFeaturesAtCoordinate(feature.getGeometry().getFirstCoordinate()).forEach(x => {
                                if (x.get('group') === 'LAYER_LN_LINK') {
                                    var nodePoint = feature.getGeometry().getCoordinates();
                                    var linkFirstPoint = x.getGeometry().getFirstCoordinate();
                                    var linkLastPoint = x.getGeometry().getLastCoordinate();
                                    if (JSON.stringify(nodePoint) === JSON.stringify(linkFirstPoint)) {
                                        x.set("SNodeID", id);
                                        let linkID = Array.from(new Set([...feature.get('LinkID'), x.get("ID")]));
                                        feature.set("LinkID", linkID)
                                        feature.set("NumConLink", feature.get('LinkID').length);
                                    }
                                    if (JSON.stringify(nodePoint) === JSON.stringify(linkLastPoint)) {
                                        x.set("ENodeID", id);
                                        let linkID = Array.from(new Set([...feature.get('LinkID'), x.get("ID")]));
                                        feature.set("LinkID", linkID)
                                        feature.set("NumConLink", feature.get('LinkID').length);
                                    }
                                }
                            });
                        }
                    })

                    setCopyUndo(copyFeatures, updateFeatures);
                    setUpUnDoReDoIndex();
                });
            }
            if (item.get("zIndex") === (map.getLayers().getLength() - 2)) {
                ipcRenderer.on("addObject", (event, args) => {
                    addObjectItem(args);
                });
                ipcRenderer.on("saveAll", (event, args) => {
                    saveAllObjectItem();
                });
            }
        }
        return () => {
            copySubscription?.unsubscribe();
            ipcRenderer.removeAllListeners("addObject");
            ipcRenderer.removeAllListeners("save");
        }
    }, [item])

    return (
        <>
            <Warp>
                <FormGroup>
                    <FormLabel component="legend">
                        <ListItem disablePadding sx={{ paddingRight: '5px' }}>
                            <ListItemText sx={{ color: "#30459A", fontSize: '12px' }}>
                                {item.get("title")}
                            </ListItemText>
                            <IconButton size="small" sx={{ width: '20px' }} onClick={ZIndexUp}>
                                <KeyboardArrowUpIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ width: '20px' }} onClick={ZIndexDown}>
                                <KeyboardArrowDownIcon />
                            </IconButton>
                        </ListItem>
                    </FormLabel>
                    <ListItem disablePadding >
                        <ListItemIcon sx={{ minWidth: '40px', fill: '#4A4C55' }}>
                            <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Visible"
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: 'medium',
                                letterSpacing: 0,
                            }}
                        />
                        <CustomSwitch checked={visible} onChange={visibleSwitch} />
                    </ListItem>
                    {(item.get('hdSet')) &&
                        <ListItem disablePadding>
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                                <SvgIcon fontSize="small" sx={{ width: '18px' }}>
                                    <EditIcon />
                                </SvgIcon>
                            </ListItemIcon>
                            <ListItemText
                                primary="Edite"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight: 'medium',
                                    letterSpacing: 0,
                                }}
                            />
                            <CustomSwitch onChange={edtiorSwitch} checked={editor} />
                        </ListItem>
                    }
                    <ListItem disablePadding sx={{ paddingRight: '21px' }}>
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                            <SvgIcon fontSize="small" sx={{ width: '18px' }}>
                                <OpacityIcon />
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText
                            primary="Opercity"
                            primaryTypographyProps={{
                                fontSize: 15,
                                fontWeight: 'medium',
                                letterSpacing: 0,
                            }}
                        />
                    </ListItem>
                    <ListItem disablePadding sx={{ paddingLeft: '2px', paddingRight: '17px', paddingBottom: '10px' }}>

                        <CustomSlider
                            valueLabelDisplay="auto"
                            onChange={opacitySwitch}
                            size={"small"}
                            value={opacity}

                        />
                    </ListItem>
                    {(!item.get("hdSet") && item.get("title") !== '브이월드') &&
                        <ListItem disablePadding sx={{}}  >
                            <Box sx={{ textAlign: 'right', width: '100%' }}>
                                <Tooltip title="레이어 셋 제거">
                                    <IconButton sx={{ minWidth: '40px' }} onClick={layerDelete}>
                                        <DeleteForeverIcon sx={{ fontSize: '25px', color: "#F10062" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </ListItem>
                    }
                    {(item.get('hdSet')) &&
                        <ListItem disablePadding sx={{}}  >
                            <Box sx={{ textAlign: 'right', width: '100%' }}>
                                <Tooltip title="위치로 이동">
                                    <IconButton sx={{ minWidth: '40px' }} onClick={zoomToExtend}>
                                        <ZoomInMapIcon sx={{ fontSize: '25px' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="속성 테이블 열기" >
                                    <IconButton sx={{ minWidth: '40px' }} onClick={showTableCheck}>
                                        <TocIcon sx={{ fontSize: '25px' }} />
                                    </IconButton>
                                </Tooltip>
                                <>
                                    <Tooltip title="오브젝트 추가">
                                        <IconButton sx={{ minWidth: '40px' }} onClick={addObject}>
                                            <AddLocationAltIcon sx={{ fontSize: '25px' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu open={addMenuOpen} anchorEl={addAnchorEl} onClose={addMenuHandleClose}>
                                        {LayerNames.map((layerName) => {
                                            if (item.get("filePaths")[layerName] !== null && typeof item.get("filePaths")[layerName] !== "undefined") return <MenuItem key={layerName} onClick={() => addObjectItem(layerName)}>{layerName}</MenuItem>
                                        })}
                                    </Menu>


                                </>
                                <>
                                    <Tooltip title="레이어 셋 저장">
                                        <IconButton sx={{ minWidth: '40px' }} onClick={saveLayer}>
                                            <SaveIcon sx={{ fontSize: '25px' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu open={saveMenuOpen} anchorEl={saveAnchorEl} onClose={saveMenuHandleClose}>
                                        <MenuItem onClick={() => saveAllObjectItem()}>ALL Object</MenuItem>
                                        {LayerNames.map((layerName) => {

                                            if (item.get("filePaths")[layerName] !== null && typeof item.get("filePaths")[layerName] !== "undefined") {
                                                return <MenuItem key={layerName} onClick={() => saveObjectItem(layerName)}>{layerName}</MenuItem>
                                            }
                                        })}
                                    </Menu>
                                </>
                                <Tooltip title="레이어 셋 제거">
                                    <IconButton sx={{ minWidth: '40px' }} onClick={layerDelete}>
                                        <DeleteForeverIcon sx={{ fontSize: '25px', color: "#F10062" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {/* <ListItemText
                                primary="속성 테이블"
                                primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight: 'medium',
                                    letterSpacing: 0,
                                }}
                            />
                            <Button variant="outlined" href="#outlined-buttons"
                                onClick={showTableCheck}
                                size="small"
                                sx={{
                                    width: '40px',
                                    color: "#30459A",
                                    borderColor: "#30459A",
                                    borderRadius: '30px'
                                }}>
                                열기
                            </Button> */}
                        </ListItem>
                    }
                </FormGroup>
            </Warp>

        </>
    )
}