import { Box, Button, FormControlLabel, FormGroup, FormLabel, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, SvgIcon, Switch } from "@mui/material";
import { borderColor, styled } from "@mui/system";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import FeatureItem from "../Feature/FeatureItem";
import { featureService, layerService } from "../service/message.service";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpacityIcon from '../../public/images/opacity _icon.svg';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
const Warp = styled(Box)({
    display: "inline-block", width: '100%', textAlign: 'left', padding: '10px', marginBottom:'17px', paddingRight:'20px', paddingLeft:'20px'
});

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
export default function LayerItem({ item }) {
    const [showTable, setShowTable] = useState(false);
    const [selected, setSelected] = useState();
    const visible = (e) => {
        item.setVisible(e.target.checked);
    }
    const edtior = (e) => {
        item.set("selectable", e.target.checked);
    }
    const opacity = (e) => {
        let value = e.target.value;
        value = value * 0.01;
        item.setOpacity(value);
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
    return (
        <>
            <Warp>
                <FormGroup>
                    <FormLabel component="legend">
                        <ListItem disablePadding sx={{paddingRight:'5px'}}>
                            <ListItemText sx={{ color: "#30459A" , fontSize:'12px'}}>
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
                        <CustomSwitch defaultChecked onChange={visible} />
                    </ListItem>
                    {(item.get('title') !== '브이월드') &&
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
                            <CustomSwitch defaultChecked onChange={edtior} />
                        </ListItem>
                        // <FormControlLabel control={<Switch onChange={edtior} />} label="Editor" />
                        // <Button onClick={showTableCheck}>[속성 테이블 열기]</Button>
                    }
                    <ListItem disablePadding sx={{paddingRight:'21px'}}>
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
                    <ListItem disablePadding sx={{paddingLeft:'2px',paddingRight:'17px', paddingBottom:'10px'}}>

                        <CustomSlider
                            defaultValue={100}
                            valueLabelDisplay="auto"
                            onChange={opacity}
                            size={"small"}

                        />
                    </ListItem>
                    {(item.get('title') !== '브이월드') &&
                        <ListItem disablePadding sx={{paddingRight:'10px'}}>
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                                {/* <SvgIcon fontSize="small" sx={{ width: '18px', fill: '#4A4C55' }}> */}
                                    <SearchIcon sx={{fontSize:'25px'}}/>
                                {/* </SvgIcon> */}
                            </ListItemIcon>
                            <ListItemText
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
                                width:'40px',
                                color:"#30459A",
                                borderColor:"#30459A",
                                borderRadius: '30px'
                            }}>
                                열기
                            </Button>
                        </ListItem>
                    }
                </FormGroup>
            </Warp>

        </>
    )
}