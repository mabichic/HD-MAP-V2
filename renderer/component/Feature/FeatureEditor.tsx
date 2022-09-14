import { Box, Button, Divider, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, Modal, Select, SvgIcon, TextField, Typography } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCallback, useState } from "react";
import { getUnDoReDoIndex, setUpUnDoReDoIndex, UndoPush } from "../modify/UndoRedo";
import { alertService, featureService } from "../service/message.service";
import { colourMappings, lanesideTypeMappings } from "./header/Laneside";
import { linkSubTypeMappings, linkTwowayMappings, linkTypeMappings } from "./header/Link";
import { roadlightDivMappings, roadlightSubTypeMappings, roadlightTypeMappings } from "./header/Roadlight";
import { roadmarkSubTypeMappings, roadmarkTypeMappings } from "./header/RoadMark";
import { safePointTypeMappings } from "./header/Safepoint";
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 334,
    height: 320,
    bgcolor: 'white',
    border: '0px',
    boxShadow: 24,
    p: 0,
};

function FeatureEditor({ handleClose, open, fields, gridRef, source, type }) {
    const [value, setValue] = useState("");
    const [field, setField] = useState("select")
    const ValueField = () => {  
        let menu;
        
        if (field === "Type" || field === "Color" || field==="SubType"|| field==="Twoway" || field==="Div") {
            if (type==='layerLaneside'&& field === "Type") menu = lanesideTypeMappings;
            else if (field === "Color") menu = colourMappings;
            else if (type==='layerLnLink'&& field === "Type") menu = linkTypeMappings;
            else if (type==='layerLnLink'&& field === "SubType") menu = linkSubTypeMappings;
            else if (type==='layerLnLink'&& field === "Twoway") menu = linkTwowayMappings;
            else if (type==='layerRoadlight'&& field === "Type") menu = roadlightTypeMappings;
            else if (type==='layerRoadlight'&& field === "SubType") menu = roadlightSubTypeMappings;
            else if (type==='layerRoadlight'&& field === "Div") menu = roadlightDivMappings;
            else if (type==='layerRoadmark'&& field === "Type") menu = roadmarkTypeMappings;
            else if (type==='layerRoadmark'&& field === "SubType") menu = roadmarkSubTypeMappings;
            else if (type==='layerSafepoint'&& field === "Type") menu = safePointTypeMappings;
            // else if(field====)?
            const menuRendering = () => {
                const result = [];
                for (let key in menu) {
                    result.push(<MenuItem key={`menuItem${key}`} value={Number(key)}>{menu[Number(key)]}</MenuItem>);
                }
                return result;
            }
            return (
                <Select
                    size="small"
                    sx={{ width: '133px', marginLeft: '20px' }}
                    value={value}
                    onChange={(e)=>setValue(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    {menuRendering()}
                </Select>
            )
        } else {
            return (
                <TextField id="standard-basic" variant="outlined" sx={{ marginLeft: '20px', width: '294px', marginBottom: '17px' }} size="small" value={value} onChange={(e) => setValue(e.target.value)} />
            )
        }
    }
    const valueChange = useCallback((e) => {
        if(field!=="Name"){ 
            if (isNaN(Number(value))) {
                alertService.sendMessage("Error.", "숫자만 입력 할 수 있습니다.");
                return;
            }
        }
        gridRef.current.api.getSelectedNodes().forEach((node) => {
            let feature = source.getFeatureById(node.data.featureID);
            let prevFeature = feature.clone();
            let data = { field: field, data: value };
            feature.set(data.field, data.data);
            let nextFeautre = feature.clone();
            // feature.setProperties
            UndoPush("UPDATE", feature.get("source"), feature, prevFeature, nextFeautre, getUnDoReDoIndex());
        });
        setUpUnDoReDoIndex();
        featureService.selected("featureChange", null);

    }, [value, gridRef, source]);
    const fieldChange = useCallback((e) => {

        setField(e.target.value);
        if (e.target.value === "Type" || e.target.value === "Color" || e.target.value === "SubType" || e.target.value === "Twoway" || e.target.value === "Div") {
            setValue("1");
        }else{
            setValue("");
        }
    }, [value, field, gridRef, source])
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{ width: '100%', backgroundColor: "#30459A" }}>
                    <ListItem sx={{ paddingTop: '3px', paddingBottom: '3px' }}>
                        <ListItemIcon sx={{ fontSize: 10, minWidth: '30px' }}>
                            <SvgIcon sx={{ width: '20px' }}>
                                <SettingsIcon sx={{ color: "#fff" }} />
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText sx={{ color: "#fff" }}>
                            <Typography variant="subtitle2">
                                Field Edit
                            </Typography>
                        </ListItemText>
                        <IconButton onClick={handleClose}>
                            <CloseIcon fontSize="small" sx={{ fill: '#fff' }} />
                        </IconButton>
                    </ListItem>
                </div>

                <Typography id="modal-modal-title" variant="body2" component="h2" p={2} sx={{ color: "#30459A" }}>
                    "선택된 필드의 속성값을 수정합니다."
                </Typography>
                <Typography id="modal-modal-title" variant="subtitle1" sx={{ marginLeft: '20px' }}>
                    Field
                </Typography>

                <Select
                    size="small"
                    sx={{ width: '133px', marginLeft: '20px' }}
                    value={field}
                    onChange={fieldChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem key={0} value={"select"}>========</MenuItem>
                    {fields.map((field) =>
                        <MenuItem key={field.colId} value={field.colId}>{field.colId}</MenuItem>
                    )}
                </Select>
                
                <Typography id="modal-modal-title" variant="subtitle1" sx={{ marginLeft: '20px', marginTop: '11px' }}>
                    Value
                </Typography>
                {(field === "Type" || field === "Color" || field==="SubType" || field==="Twoway" || field==="Div" ) ?
                    <ValueField />
                    :
                        <TextField id="standard-basic" variant="outlined" sx={{ marginLeft: '20px', width: '294px', marginBottom: '17px' }} size="small" value={value} onChange={(e) => setValue(e.target.value)} />
                        
                }

                {/* <ValueField /> */}
                {/* <TextField id="standard-basic" variant="outlined" sx={{ marginLeft: '20px', width: '294px', marginBottom: '17px' }} size="small" value={value} onChange={(e) => setValue(e.target.value)} /> */}
                <Divider />
                <div style={{ textAlign: 'right', padding: 0 }}>
                    {(field==="select") ?
                    ""
                    :
                    <Button variant="outlined" href="#outlined-buttons" onClick={valueChange} sx={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px', marginRight: '8px', width: '80px' }}>
                        확인
                    </Button>
                    }
                    <Button variant="outlined" href="#outlined-buttons" sx={{marginTop: '10px',marginBottom: '10px', marginRight: '20px', width: '80px' }} color="error" onClick={handleClose}>
                        취소
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default FeatureEditor;