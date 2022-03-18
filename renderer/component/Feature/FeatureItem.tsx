import { useContext, useEffect, useRef, useState } from "react";
import FeaturesContext from "../context/FeaturesContext";
import { featureService } from "../service/message.service";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import GeoJSON from "ol/format/GeoJSON";
import SourcesContext from "../context/SourcesContext";
import MapContext from "../context/MapContext";

const getRowNodeId = (params) => {
    return params.ID;
};

export default function FeatureItem({ index, source }) {

    const map = useContext(MapContext);
    const gridRef = useRef<any>();

    const [feature, setFeature] = useState([]);
    const onRowSelected = (e) => {
        if (e.node.isSelected()) {
            let feature = source.getFeatureById(e.node.data.featureID);
            if (isFinite(feature.getGeometry().getExtent()[0]) && isFinite(feature.getGeometry().getExtent()[1]) && isFinite(feature.getGeometry().getExtent()[2]) && isFinite(feature.getGeometry().getExtent()[3])) {
                //   select.getFeatures().clear();
                //   select.getFeatures().push(feature);
                map.getView().fit(feature.getGeometry().getExtent(), { duration: 500, size: map.getSize(), maxZoom: 23, padding: [0, 0, 0, 0] });
            }

        }
    };
    const init = () => {
        let gejsons = new GeoJSON().writeFeatures(source.getFeatures());
        let json = JSON.parse(gejsons);
        let datas = [];
        json.features.map((j) => {
            if (j.properties.group === "LAYER_LANESIDE") {
                let data = j.properties;
                data.featureID = j.id;
                datas.push(data);
            }
        });
        setFeature(datas);
        
    }
    const update =(featureID:string) =>{
        const findFeatureID=(feature)=>{
            return feature.featureID === featureID;
        }
        feature.find(findFeatureID);

        let updateFeature = source.getFeatureById(featureID);
        let data = updateFeature.properties;
        data.featureID = updateFeature.id;
        console.log(data);
        // setFeature(
        //     feature.map(
        //         fea => fea.featureID === featureID
        //         ? {
        //             let data = j.properties;
        //             data.featureID = j.id;
        //         }
        //     )
        // )
    }
    useEffect(() => {
        init();
        let subscription = featureService.getMessage().subscribe(message => {
            if (message) {
                console.log(message);
                update(message.text);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [])

    const [columnDefs] = useState([
        { field: "ID", filter: 'agNumberColumnFilter' },
        { field: "PointXY" },
        { field: "price" },
    ]);
    return (
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
                rowData={feature}
                rowSelection={"single"}
                columnDefs={columnDefs}
                getRowNodeId={getRowNodeId}
                immutableData={true}
                onRowSelected={onRowSelected}
                undoRedoCellEditing={false}
                ref={gridRef}
            ></AgGridReact>
        </div>

    )
}