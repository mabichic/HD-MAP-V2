import { createContext } from "react";
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from "ol/source/Vector";

const LayersContext = createContext<Array<Array<VectorImageLayer<VectorSource>>> | null>(null);
export default LayersContext;