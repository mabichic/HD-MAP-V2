import TileLayer from "ol/layer/Tile";
import { atom } from "recoil";
import XYZ from 'ol/source/XYZ';
export const layerState = atom({
    key: 'layerState',
    default: [
        {
            title : '브이월드',
            layer : new TileLayer({
                source: new XYZ({
                    url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg',
                    maxZoom: 19,
                })
            })
        }
    ]
});