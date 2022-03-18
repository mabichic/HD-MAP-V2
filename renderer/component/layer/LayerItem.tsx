import { Box, Button, FormControlLabel, FormGroup, Slider, Switch } from "@mui/material";
import { styled } from "@mui/system";
import Layer from "ol/layer/Layer";
import TileLayer from "ol/layer/Tile";
import VectorImageLayer from "ol/layer/VectorImage";
import { useState } from "react";
import { Rnd } from "react-rnd";
import FeatureItem from "../Feature/FeatureItem";



const Warp = styled(Box)({
    display: "inline-block", width: '90%', textAlign: 'left', padding: '10px'
});
export default function LayerItem({ item }) {
    const [showTable, setShowTable] = useState(false);
    const visible = (e) => {
        item.setVisible(e.target.checked);
    }
    const opacity = (e) => {
        let value = e.target.value; 
        value = value * 0.01;
        item.setOpacity(value);
    }
    const Test = ({visible}) =>{ 
        const style = {
            display: "flex",
            flexDirection: 'column',
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #ddd",
            background: "#f0f0f0",
            zIndex: "9999",
            minWidth: '200px', 
        } as const;
        if(visible){ 
        return ( 
            <Rnd minWidth={200} minHeight={200} bounds="body" default={{ x: 100, y: 100, width: 200, height: 200, }} style={style} > 
                {/* <div className="featureHandle" style={{width:'100%'}}>제목표시줄</div> */}
                <div style={{flexGrow: 1, width:'100%'}}>
                <FeatureItem index={1} source={item.getSource()}/>
                </div>
            </Rnd>
        )}else {
            return null
        }
    }
    const showTableCheck = (e) =>{
        setShowTable((showTable)=>!showTable);
    }
    return (
        <>
        
        <Warp>
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked onChange={visible} />} label={item.get('title')} /> 
                <Button onClick={showTableCheck}>[속성 테이블 열기]</Button>
            </FormGroup>
            <Slider
                defaultValue={100}
                valueLabelDisplay="auto"
                onChange={opacity}
            />
        </Warp>
        <Test visible = {showTable}/>
        </>
    )
}