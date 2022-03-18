import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ipcRenderer } from 'electron';
import HdMap from '../component/HdMap';
import { Box, Button } from '@mui/material';
import { useRecoilState } from 'recoil';
import { layerState } from '../state/Layer';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import MapContext from '../component/MapContext';
import TestButton from '../component/TestButton';
import VectorLayer from 'ol/layer/Vector';
import VworldTileLayer from '../component/VworldTileLayer';
import Layers from '../component/Layers';
import HdMapVectorLayer from '../component/HdMapVectorLayer';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { get } from 'ol/proj';
import HdMapStyle from '../component/HdMapStyle';
import { HdMapObjState } from '../state/HdMapObj';
const Store = require('electron-store');

const store = new Store();
console.log(store);


function Home() {
  const [layers, setLayers] = useState([new TileLayer({
    source: new XYZ({
      url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg',
      maxZoom: 19,
    })
  })]);
  const [verCtorLayer, setVerCtorLayer] = useState([]);


  const test = async () => {
    const foo = await ipcRenderer.invoke('getStoreValue', 'foo');
    store.set('unicorn', '🦄');
    store.set('port', 4326);
  }
  const test2 = async () => {

    console.log(store.get('port'));
  }
  // const [lay, setLay] = useRecoilState(layerState);

  // console.log(lay);
  return (
    <>
      <HdMap zoom={10} center={[234075, 419607]}>
        <VworldTileLayer />
        <Layers>
        </Layers>
      </HdMap>
    </>
  );
};

export default Home;
