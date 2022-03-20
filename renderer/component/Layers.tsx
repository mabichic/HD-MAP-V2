import { ipcRenderer } from "electron";
import { Feature } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { HdMapObjState } from "../state/HdMapObj";
import FeaturesContext from "./context/FeaturesContext";
import HdMapStyle from "./HdMapStyle";
import HdMapVectorLayer from "./HdMapVectorLayer";
import TestButton from "./TestButton";
import { Modify } from 'ol/interaction'
import MapContext from "./context/MapContext";
import LayersContext from "./context/LayersContext";
import { LineString, Point, Polygon } from "ol/geom";
import { featureService } from './service/message.service';
import SourcesContext from "./context/SourcesContext";

function Layers({ children }) {
  const map = useContext(MapContext);
  const [objs, setObjs] = useState([]);
  const [layers, setLayers] = useState([]);
  const [sources, setSources] = useState([]);
  useEffect(() => {
    ipcRenderer.on("load", (event, args) => {
      let features = new GeoJSON().readFeatures(args);
      console.log(args);
      let source = new VectorSource({
        features: features
      });
      let layer = () => {
        return <HdMapVectorLayer title={'Layer Set '+ args.index} source={source} style={HdMapStyle} />
      }
      // <HdMapVectorLayer source={source} style={HdMapStyle} />
      setObjs(objs => [...objs, features]);
      setSources(sources => [...sources, source]);
      setLayers(layers => [...layers, layer])
    });
    return () => { }
  }, []);
  useEffect(() => {
    if (map === null) return;
    let source = sources[0];
    if (source === null) return;


    // const modify = new Modify({ source: source });
    // // modify.on('modifystart', (e) => {

    // // });
    // modify.on('modifyend', (e) => {
    //   let features = e.features.getArray() as any[];
    //   let coord = features[0].getGeometry().getCoordinates();
    //   let dataRow = features[0].getProperties();
    //   features[0].set('PointXY', coord)
    //   featureService.sendMessage("change",features[0].getId());
    // });

    // map.addInteraction(modify);
  }, [sources]);
  return (
    <>
      <LayersContext.Provider value={layers}>
        <SourcesContext.Provider value={sources}>
        <FeaturesContext.Provider value={objs}>
          {layers.map((Layer, index) => {
            return (
              <Layer key={index}></Layer>
            )
          })}

          <TestButton />
          <div>{children}</div>
        </FeaturesContext.Provider>
        </SourcesContext.Provider>
      </LayersContext.Provider>
    </>
  )
};
export default Layers;

