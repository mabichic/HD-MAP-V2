import { ipcRenderer } from "electron";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { useContext, useEffect, useRef, useState } from "react";
import HdMapStyle from "./HdMapStyle";
import HdMapVectorLayer from "./layer/HdMapVectorLayer";
import TestButton from "./TestButton";
import MapContext from "./context/MapContext";
import { featureService, layerService, loadingService } from './service/message.service';
import TileLayer from "ol/layer/Tile";
import VworldTileLayer from "./layer/VworldTileLayer";
import FeatureTable from "./Feature/FeatureTable";

function compare(a: TileLayer<any>, b: TileLayer<any>) {
  return b.getZIndex() - a.getZIndex()
}

function Layers({ children }) {
  const map = useContext(MapContext);
  const [layers, setLayers] = useState([]);
  const [showTableLayers, setShowTableLayers] = useState([]);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!map) return;
    setLayers([VworldTileLayer({ zIndex: 0, map: map })]);
    ipcRenderer.on("load", (event, args) => {
      
        
      let features = new GeoJSON().readFeatures(args);
      let source = new VectorSource({
        features: features
      });
      features.forEach(feature=>{
        feature.set("source", source);
      });
      source.on("addfeature", (e)=>{ 
        featureService.selected("featureAppend");
      });

      setLayers(layers => [...layers, HdMapVectorLayer({ zIndex: map.getLayers().getLength()-1, map: map, source: source, style: HdMapStyle, title: 'Layer Set ' + args.index, layerIndex : args.index })].sort(compare));
      loadingService.sendMessage(false);
    });
    return () => {
      ipcRenderer.removeAllListeners("load");
    }
  }, [map]);
  useEffect(() => {
    if (!map) return;
    let subscription = layerService.getMessage().subscribe(message => {
      let tempLayers = [];
      let messageIndex = -1;
      let tempZIndex = -1;
      tempLayers = layers;
      tempLayers.sort(compare);
      tempLayers.forEach((layer, index) => {
        if (layer === message.layer) {
          messageIndex = index;
          tempZIndex = layer.getZIndex();
        }
      });
      if (message.state === "zIndexUp" && messageIndex > 0) {
        tempLayers[messageIndex].setZIndex(tempLayers[messageIndex - 1].getZIndex());
        tempLayers[messageIndex - 1].setZIndex(tempZIndex);
      } else if (message.state === "zIndexDown" && (messageIndex < tempLayers.length - 1)) {
        tempLayers[messageIndex].setZIndex(tempLayers[messageIndex + 1].getZIndex());
        tempLayers[messageIndex + 1].setZIndex(tempZIndex);
      } else if (message.state === "layerDelete") {
        for (let i = 0; i < messageIndex; i++) {
          tempLayers[i].setZIndex(tempLayers[i].getZIndex() - 1);
        }
        tempLayers = tempLayers.filter((layer) => {
          return layer != message.layer;
        });
        map.removeInteraction(message.layer.get("snap"));
        map.removeLayer(message.layer);
        setShowTableLayers((layers)=>layers.filter((layer)=>{
          return layer != message.layer;
        }));
      }
      tempLayers.sort(compare);
      setLayers([...tempLayers]);
    });
    return () => {
      subscription.unsubscribe();
    }
  }, [map, layers])

  useEffect(() => {
    let subscription = featureService.getMessage().subscribe(message => {
      if (message.state === "visible") {
        let arr = showTableLayers;
        if (!showTableLayers.includes(message.layer)) arr.push(message.layer);
        setShowTableLayers([...arr]);
      }else if(message.state ==="unvisible"){
        let arr = showTableLayers;
        setShowTableLayers((layers) => layers.filter((layer)=>{
          return layer != message.layer;
        }));
      }
    });
    return () => {
      subscription.unsubscribe();
    }
  }, [showTableLayers])
  return (
    <>
      <TestButton layers={layers} />
      <div ref={wrapRef}>
        {showTableLayers.map((layer) => {
          console.log(layer.getSource());
          return <FeatureTable key={layer.get('title')} source={layer.getSource()} wrapRef={wrapRef} title={layer.get('title')} layer={layer} />
        })}
      </div>
      {/* <Tables layers={layers} /> */}
      <div>{children}</div>
    </>
  )
};
export default Layers;

