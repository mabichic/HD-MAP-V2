import Style from "ol/style/Style";
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle'
import Point from "ol/geom/Point";
import { LineString, MultiPoint } from "ol/geom";
const HdMapStyle = function(feature, resolution) {
    var zoom = Math.log2(156543.03390625) - Math.log2(resolution);

    //19 - 20 전에는 노드 없어도 되지 않을까
    if(feature.get('group') === 'LAYER_POI'){
        return  new Style({
            text: new Text({
                font: '12px Verdana',
                scale: 1,
                text: feature.get('Name'), 
                fill: new Fill({ color: 'red' }),
                stroke: new Stroke({ color: 'yellow', width: 3 }),
                offsetY : -10, 
            }), 
            image: new Circle({
                radius: 3,
                fill: new Fill({
                color: 'RED',
                }),
            }),
        });
    }
    if(feature.get('group') === 'LAYER_LANESIDE'){
        var storkeColor="#ffffff";
        var lineDash = [0];
        var color = feature.get("Color"); 
        var type = feature.get("Type");
        if(color === 0) storkeColor='WHITE';
        if(color === 1) storkeColor='YELLOW';
        if(color === 2) storkeColor='BLUE';
        
        if(type === 1) lineDash=[0];
        if(type === 2) lineDash=[10,10];
        if(type === 3) lineDash=[20,20];
        // if(type === 'LS_BOUNDARY') lineDash=[40,40];
        if(type === 5) lineDash=[50,50];
        return new Style({
            stroke: new Stroke({
                color:storkeColor, width:2, lineDash: lineDash,
            }),
        });
    }
    if(feature.get('group') === 'LAYER_LN_NODE'){
        if(zoom<19) return null;
        
        return new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({
                color: '#FFFF00',
                }),
            }),
        });
        
    }
    if(feature.get('group') === 'LAYER_LN_LINK'){
        if(zoom<19) return null;
        return new Style({
            stroke: new Stroke({
                color:'BLACK', width:4
            }),
        });
    }
    if(feature.get('group') === 'LAYER_ROADMARK'){
        let color:string|Array<number> = 'RED';
        let type = feature.get("Type"); 
        if(type===1) color = [255, 255, 255, 0.5];
        if(type===2) color = [255, 255, 0, 0.5];;
        if(type===3) color = [204, 204, 255,0.5];
        if(type===4) color = [153, 153, 102,0.5];
        if(type===5) color = [204, 102, 204,0.5];
        if(type===6) color = [255, 102, 255,0.5];
        if(type===7) color = [255, 0, 0, 0.5];
        if(type===8) color =  [0, 0, 255, 0.5];
        if(type===9) color = [204, 51, 51,0.5];
        return new Style({
            fill: new Fill({
                    color: color,
            }),
        });
    }
    if(feature.get('group') === 'LAYER_ROADLIGHT'){
        if(zoom<19) return null;
        const geometry = feature.getGeometry();
        let styles  = [];
        styles.push(
            new Style({
                stroke: new Stroke({
                    color:'rgba(0,0,0,1)', width:4
                }),
            })
        );
        styles.push(
            new Style({
                geometry: new Point(geometry.getLastCoordinate()),
                image: new Circle({
                    radius: 5,
                    fill: new Fill({
                        color: 'rgba(0,0,255,1)'
                    })
                }), 
            })
        );
        styles.push(
            new Style({
                geometry: new Point(geometry.getFirstCoordinate()),
                image: new Circle({
                    radius: 5,
                    fill: new Fill({
                        color: 'rgba(255,0,0,1)'
                    })
                })
            })
        );
        return styles;
    }

    if(feature.get('group') === 'GPS_LOG'){
        return new Style({
            stroke: new Stroke({
                color:'RED', width:4
            }),
        });
    }

};
export const selectedStyle = function(feature){
    var styles = [];
    if (feature.getGeometry().getType() === 'Point') {
        styles.push(new Style({
            image: new Circle({
                radius: 7,
                fill: new Fill({
                    color: 'rgba(0,0,255,1)'
                }),
            })
        })); 
    }
    if (feature.getGeometry().getType() === 'Polygon') {
        styles.push(
            new Style({
                fill: new Fill({
                    color: 'rgba(0,0,255,0.4)'
                }),
            })); 
        }
        if (feature.getGeometry().getType() === 'LineString') {
            var coordinates = feature.getGeometry().getCoordinates();
            styles.push(new Style({
                geometry: new LineString(coordinates),
                stroke: new Stroke({
                    color:'rgba(0,0,255,0.6)', width:5
                }),
            })); 
            styles.push(new Style({
                geometry: new MultiPoint(coordinates),
                image: new Circle({
                    radius: 5,
                    fill: new Fill({
                        color: 'rgba(0,0,255,1)'
                    }),
                })
            })); 
        }
        return styles;
    }
    
export default HdMapStyle;