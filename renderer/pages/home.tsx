import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import HdMap from '../component/HdMap';
import { layerState } from '../state/Layer';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VworldTileLayer from '../component/layer/VworldTileLayer';
import Layers from '../component/Layers';
import ConfirmDialog from '../component/ConfirmDialog';
import Loading from '../component/Loading';
import { loadingService } from '../component/service/message.service';
import AlertDialog from '../component/AlertDialog';
const Store = require('electron-store');

const store = new Store();
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

  }
  useEffect(()=>{
    ipcRenderer.on("ladingStart", (event, args) => {
      loadingService.sendMessage(true);
    });
    ipcRenderer.on("ladingEnd", (event, args) => {
      loadingService.sendMessage(false);
    });
    return () => {
      ipcRenderer.removeAllListeners("ladingStart");
      ipcRenderer.removeAllListeners("ladingEnd");
    }
  },[])
  return (
      <HdMap zoom={10} center={[234075, 419607]}>
        <Layers>
        </Layers>
        <ConfirmDialog/>
        <AlertDialog/>
        <Loading/>
      </HdMap> 
  );
};

export default Home;
