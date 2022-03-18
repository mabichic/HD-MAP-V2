import { Feature } from "ol";
import { createContext } from "react";

const FeaturesContext = createContext<Array<Array<Feature>> | null>(null);

export default FeaturesContext;