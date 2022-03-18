import { createContext } from "react";
import VectorSource from "ol/source/Vector";

const SourcesContext = createContext<Array<VectorSource> | null>(null);
export default SourcesContext;