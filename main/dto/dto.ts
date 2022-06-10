import { division } from "../common/util";

export interface GEOJSONTYPE {
  type: "Feature";
  id: string;
  group: "LAYER_LANESIDE" | "LAYER_POI" | "LAYER_LN_NODE" | "LAYER_LN_LINK" | "LAYER_ROADMARK" | "LAYER_ROADLIGHT";
  geometry: {
    type: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
    coordinates: Array<Array<Array<number>>> | Array<Array<number>> | Array<number>;
  };
  properties: LAYER_LANESIDE_PROPERTIE | LAYER_LN_LINK_PROPERTIE | LAYER_LN_NODE_PROPERTIE | LAYER_POI_PROPERTIE | LAYER_ROADLIGHT_PROPERTIE | LAYER_ROADMARK_PROPERTIE | GPS_LOG_PROPERTIE;
}

export const LayerNames = ["LAYER_LANESIDE", "LAYER_LN_LINK", "LAYER_LN_NODE", "LAYER_POI", "LAYER_ROADLIGHT", "LAYER_ROADMARK", "LAYER_SAFEPOINT"];

export interface ObjectSet {
  LAYER_ROADMARK: LAYER_ROADMARK_PROPERTIE;
  LAYER_ROADLIGHT: LAYER_ROADLIGHT_PROPERTIE;
  LAYER_LANESIDE: LAYER_LANESIDE_PROPERTIE;
  LAYER_POI: LAYER_POI_PROPERTIE;
  LAYER_LN_LINK: LAYER_LN_LINK_PROPERTIE;
  LAYER_LN_NODE: LAYER_LN_NODE_PROPERTIE;
  LAYER_SAFEPOINT: LAYER_SAFEPOINT_PROPERTIE;
}
export interface LAYER_LANESIDE_PROPERTIE {
  ID: number;
  MID: number;
  LaneID: number;
  Type: number;
  Color: number;
  NumPoint: number;
  PointXY: Array<Array<number>>;
}

export interface LAYER_LN_LINK_PROPERTIE {
  ID: number;
  MID: number;
  LID: number;
  RID: number;
  InMID: number;
  InRID: number;
  InLID: number;
  outMID: number;
  outLID: number;
  outRID: number;
  Junction: number;
  Type: number;
  Sub_Type: number;
  Twoway: number;
  RLID: number;
  LLinkID: number;
  RLinkID: number;
  SNodeID: number;
  ENodeID: number;
  Speed: number;
  NumPoint: number;
  PointXY: Array<Array<number>>;
}

export interface LAYER_LN_NODE_PROPERTIE {
  ID: number;
  NumConLink: number;
  LinkID: Array<number>;
  PointXY: Array<number>;
}
export interface LAYER_POI_PROPERTIE {
  ID: number;
  LinkID: number;
  Name: string;
  PointXY: Array<number>;
}
export interface LAYER_ROADLIGHT_PROPERTIE {
  ID: number;
  LaneID: number;
  Type: number;
  SubType: number;
  Div: number;
  NumStopLine: number;
  StopLineID: Array<number> | null;
  NumPoint: number;
  PointXY: Array<Array<number>>;
}
export interface LAYER_ROADMARK_PROPERTIE {
  ID: number;
  Type: number;
  SubType: number;
  NumStopLine: number;
  StopLineID: Array<number> | null;
  NumPoint: number;
  PointXY: Array<Array<Array<number>>>;
}
export interface LAYER_SAFEPOINT_PROPERTIE {
  ID: number;
  QueryLinkID: number;
  InterLinkID: number;
  length: number;
  PointXY: Array<number>;
}

export interface GPS_LOG_PROPERTIE {
  ID: number;
  PointXY: Array<number>;
}

export class LAYER_LANESIDE implements LAYER_LANESIDE_PROPERTIE {
  ID: number;
  MID: number;
  LaneID: number;
  Type: number;
  Color: number;
  NumPoint: number;
  PointXY: Array<Array<number>>;
  group: "LAYER_LANESIDE";
  Index: number;
  constructor(array) {
    this.ID = Number(array.split(" ")[0]);
    this.MID = Number(array.split(" ")[1]);
    this.LaneID = Number(array.split(" ")[2]);
    this.Type = Number(array.split(" ")[3]);
    this.Color = Number(array.split(" ")[4]);
    this.NumPoint = Number(array.split(" ")[5]);
    this.PointXY = division(array.split(" ").slice(6).map(parseFloat), 2);
    this.group = "LAYER_LANESIDE";
  }
  // conv = () => this.ID + " " + this.MID + " " + this.LaneID + " " + this.Type + " " + this.Color + " " + this.NumPoint + " " + this.PointXY + " " + "\r\n";
}
export class LAYER_LANESIDE_CONV implements LAYER_LANESIDE_PROPERTIE {
  ID: number;
  MID: number;
  LaneID: number;
  Type: number;
  Color: number;
  NumPoint: number;
  PointXY: Array<Array<number>>;
  constructor(data) {
    this.ID = Number(data.ID);
    this.MID = Number(data.MID);
    this.LaneID = Number(data.LaneID);
    this.Type = Number(data.Type);
    this.Color = Number(data.Color);
    this.NumPoint = Number(data.NumPoint);
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () => this.ID + " " + this.MID + " " + this.LaneID + " " + this.Type + " " + this.Color + " " + this.NumPoint + " " + this.PointXY + " " + "\r\n";
}
export class LAYER_LN_LINK implements LAYER_LN_LINK_PROPERTIE {
  ID: number;
  MID: number;
  LID: number;
  RID: number;
  InMID: number;
  InRID: number;
  InLID: number;
  outMID: number;
  outLID: number;
  outRID: number;
  Junction: number;
  Type: number;
  Sub_Type: number;
  Twoway: number;
  RLID: number;
  LLinkID: number;
  RLinkID: number;
  SNodeID: number;
  ENodeID: number;
  Speed: number;
  NumPoint: number;
  PointXY: Array<Array<number>>;
  group: "LAYER_LN_LINK";
  Index: number;
  constructor(array) {
    this.ID = Number(array.split(" ")[0]);
    this.MID = Number(array.split(" ")[1]);
    this.LID = Number(array.split(" ")[2]);
    this.RID = Number(array.split(" ")[3]);
    this.InMID = Number(array.split(" ")[4]);
    this.InRID = Number(array.split(" ")[5]);
    this.InLID = Number(array.split(" ")[6]);
    this.outMID = Number(array.split(" ")[7]);
    this.outLID = Number(array.split(" ")[8]);
    this.outRID = Number(array.split(" ")[9]);
    this.Junction = Number(array.split(" ")[10]);
    this.Type = Number(array.split(" ")[11]);
    this.Sub_Type = Number(array.split(" ")[12]);
    this.Twoway = Number(array.split(" ")[13]);
    this.RLID = Number(array.split(" ")[14]);
    this.LLinkID = Number(array.split(" ")[15]);
    this.RLinkID = Number(array.split(" ")[16]);
    this.SNodeID = Number(array.split(" ")[17]);
    this.ENodeID = Number(array.split(" ")[18]);
    this.Speed = Number(array.split(" ")[19]);
    this.NumPoint = Number(array.split(" ")[20]);
    this.PointXY = division(array.split(" ").slice(21).map(parseFloat), 2);
    this.group = "LAYER_LN_LINK";
  }
}
export class LAYER_LN_LINK_CONV implements LAYER_LN_LINK_PROPERTIE {
  ID: number;
  MID: number;
  LID: number;
  RID: number;
  InMID: number;
  InRID: number;
  InLID: number;
  outMID: number;
  outLID: number;
  outRID: number;
  Junction: number;
  Type: number;
  Sub_Type: number;
  Twoway: number;
  RLID: number;
  LLinkID: number;
  RLinkID: number;
  SNodeID: number;
  ENodeID: number;
  Speed: number;
  NumPoint: number;
  PointXY: Array<Array<number>>;
  group: "LAYER_LN_LINK";
  Index: number;
  constructor(data) {
    this.ID = Number(data.ID);
    this.MID = Number(data.MID);
    this.LID = Number(data.LID);
    this.RID = Number(data.RID);
    this.InMID = Number(data.InMID);
    this.InRID = Number(data.InRID);
    this.InLID = Number(data.InLID);
    this.outMID = Number(data.outMID);
    this.outLID = Number(data.outLID);
    this.outRID = Number(data.outRID);
    this.Junction = Number(data.Junction);
    this.Type = Number(data.Type);
    this.Sub_Type = Number(data.Sub_Type);
    this.Twoway = Number(data.Twoway);
    this.RLID = Number(data.RLID);
    this.LLinkID = Number(data.LLinkID);
    this.RLinkID = Number(data.RLinkID);
    this.SNodeID = Number(data.SNodeID);
    this.ENodeID = Number(data.ENodeID);
    this.Speed = Number(data.Speed);
    this.NumPoint = Number(data.NumPoint);
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () =>
    this.ID +
    " " +
    this.MID +
    " " +
    this.LID +
    " " +
    this.RID +
    " " +
    this.InMID +
    " " +
    this.InRID +
    " " +
    this.InLID +
    " " +
    this.outMID +
    " " +
    this.outLID +
    " " +
    this.outRID +
    " " +
    this.Junction +
    " " +
    this.Type +
    " " +
    this.Sub_Type +
    " " +
    this.Twoway +
    " " +
    this.RLID +
    " " +
    this.LLinkID +
    " " +
    this.RLinkID +
    " " +
    this.SNodeID +
    " " +
    this.ENodeID +
    " " +
    this.Speed +
    " " +
    this.NumPoint +
    " " +
    this.PointXY +
    " " +
    "\r\n";
}
export class LAYER_LN_NODE implements LAYER_LN_NODE_PROPERTIE {
  ID: number;
  NumConLink: number;
  LinkID: Array<number> | null;
  PointXY: Array<number>;
  group: "LAYER_LN_NODE";
  Index: number;
  constructor(array) {
    let numConLink = Number(array.split(" ")[1]);
    let linkId = [];
    for (let i = 0; i < numConLink; i++) {
      linkId.push(array.split(" ")[2 + i]);
    }
    this.ID = Number(array.split(" ")[0]);
    this.NumConLink = Number(array.split(" ")[1]);
    this.LinkID = linkId.map(Number);
    this.PointXY = array
      .split(" ")
      .slice(2 + numConLink)
      .map(parseFloat);

    this.group = "LAYER_LN_NODE";
  }
}
export class LAYER_LN_NODE_CONV implements LAYER_LN_NODE_PROPERTIE {
  ID: number;
  NumConLink: number;
  LinkID: Array<number> | null;
  PointXY: Array<number>;
  group: "LAYER_LN_NODE";
  Index: number;
  constructor(data) {
    this.ID = Number(data.ID);
    this.NumConLink = Number(data.NumConLink);
    this.LinkID = data.LinkID.join(" ");
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () => this.ID + " " + this.NumConLink + " " + this.LinkID + " " + this.PointXY + " " + "\r\n";
}
export class LAYER_POI implements LAYER_POI_PROPERTIE {
  ID: number;
  LinkID: number;
  Name: string;
  PointXY: Array<number>;
  group: "LAYER_POI";
  Index: number;
  constructor(array) {
    this.ID = Number(array.split(" ")[0]);
    this.LinkID = Number(array.split(" ")[1]);
    this.Name = array.split(" ")[2];
    this.PointXY = array.split(" ").slice(3).map(parseFloat);
    this.group = "LAYER_POI";
  }
}
export class LAYER_POI_CONV implements LAYER_POI_PROPERTIE {
  ID: number;
  LinkID: number;
  Name: string;
  PointXY: Array<number>;
  group: "LAYER_POI";
  Index: number;
  constructor(data) {
    this.ID = Number(data.ID);
    this.LinkID = Number(data.LinkID);
    this.Name = data.Name;
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () => this.ID + " " + this.LinkID + " " + this.Name + " " + this.PointXY + " " + "\r\n";
}
export class LAYER_ROADLIGHT implements LAYER_ROADLIGHT_PROPERTIE {
  ID: number;
  LaneID: number;
  Type: number;
  SubType: number;
  Div: number;
  NumStopLine: number;
  StopLineID: Array<number> | null;
  NumPoint: number;
  PointXY: Array<Array<number>>;
  group: "LAYER_ROADLIGHT";
  Index: number;
  constructor(array) {
    let numStopline = Number(array.split(" ")[5]);
    let stoplineID = [];
    for (let i = 0; i < numStopline; i++) {
      stoplineID.push(array.split(" ")[6 + i]);
    }
    this.ID = Number(array.split(" ")[0]);
    this.LaneID = Number(array.split(" ")[1]);
    this.Type = Number(array.split(" ")[2]);
    this.SubType = Number(array.split(" ")[3]);
    this.Div = Number(array.split(" ")[4]);
    this.NumStopLine = Number(numStopline);
    this.StopLineID = stoplineID.map(Number);
    this.NumPoint = Number(array.split(" ")[numStopline + 6]);
    this.PointXY = division(
      array
        .split(" ")
        .slice(7 + numStopline)
        .map(parseFloat),
      2
    );
    this.group = "LAYER_ROADLIGHT";
  }
}
export class LAYER_ROADLIGHT_CONV implements LAYER_ROADLIGHT_PROPERTIE {
  ID: number;
  LaneID: number;
  Type: number;
  SubType: number;
  Div: number;
  NumStopLine: number;
  StopLineID: Array<number> | null;
  NumPoint: number;
  PointXY: Array<Array<number>>;
  group: "LAYER_ROADLIGHT";
  Index: number;
  constructor(data) {
    this.ID = Number(data.ID);
    this.LaneID = Number(data.LaneID);
    this.Type = data.Type === "RL_HOR" ? 1 : data.Type === "RL_VIR" ? 2 : 0;
    this.SubType = data.SubType === "RL_2" ? 1 : data.SubType === "RL_3" ? 2 : data.SubType === "RL_4" ? 3 : data.SubType === "RL_5" ? 4 : 0;
    this.Div = data.Div === "None" ? 0 : data.Div === "GEN_RL" ? 1 : data.Div === "BUS_RL" ? 2 : data.Div === "FLASHING_RL" ? 3 : data.Div;
    this.NumStopLine = Number(data.NumStopLine);
    this.StopLineID = data.StopLineID.join(" ");
    this.NumPoint = Number(data.NumPoint);
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () => {
    let result = "";
    result += this.ID + " ";
    result += this.LaneID + " ";
    result += this.Type + " ";
    result += this.SubType + " ";
    result += this.Div + " ";
    result += this.NumStopLine + " ";
    if (this.NumStopLine > 0) result += this.StopLineID + " ";
    result += this.NumPoint + " ";
    result += this.PointXY;
    result += "\r\n";
    return result;
  };
}
export class LAYER_ROADMARK implements LAYER_ROADMARK_PROPERTIE {
  ID: number;
  Type: number;
  SubType: number;
  NumStopLine: number;
  StopLineID: number[];
  NumPoint: number;
  PointXY: number[][][];
  group: "LAYER_ROADMARK";
  Index: number;
  constructor(array) {
    let numStopline = Number(array.split(" ")[3]);
    let stoplineID = [];
    for (let i = 0; i < numStopline; i++) {
      stoplineID.push(array.split(" ")[4 + i]);
    }
    this.ID = Number(array.split(" ")[0]);
    this.Type = Number(array.split(" ")[1]);
    this.SubType = Number(array.split(" ")[2]);
    this.NumStopLine = Number(numStopline);
    this.StopLineID = stoplineID.map(Number);
    this.NumPoint = Number(array.split(" ")[4 + numStopline]);
    this.PointXY = [
      division(
        array
          .split(" ")
          .slice(5 + numStopline)
          .map(parseFloat),
        2
      ),
    ];
    this.group = "LAYER_ROADMARK";
  }
}
export class LAYER_ROADMARK_CONV implements LAYER_ROADMARK_PROPERTIE {
  ID: number;
  Type: number;
  SubType: number;
  NumStopLine: number;
  StopLineID: number[];
  NumPoint: number;
  PointXY: number[][][];
  group: "LAYER_ROADMARK";
  Index: number;
  constructor(data) {
    this.ID = Number(data.ID);
    this.Type =Number(data.Type);
    this.SubType =Number(data.SubType);
    this.NumStopLine = Number(data.NumStopLine);
    this.StopLineID = data.StopLineID.join(" ");
    this.NumPoint = Number(data.NumPoint);
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () => {
    let result = "";
    result += this.ID + " ";
    result += this.Type + " ";
    result += this.SubType + " ";
    result += this.NumStopLine + " ";
    if (this.NumStopLine > 0) result += this.StopLineID + " ";
    result += this.NumPoint + " ";
    result += this.PointXY;
    result += "\r\n";
    return result;
  };
}
export class LAYER_SAFEPOINT implements LAYER_SAFEPOINT_PROPERTIE {
  ID: number;
  QueryLinkID: number;
  InterLinkID: number;
  length: number;
  PointXY: Array<number>;
  group: "LAYER_SAFEPOINT";
  Index: number;
  constructor(array) {
    this.ID = Number(array.split(" ")[0]);
    this.QueryLinkID = Number(array.split(" ")[1]);
    this.InterLinkID = Number(array.split(" ")[2]);
    this.length = Number(array.split(" ")[3]);
    this.PointXY = array.split(" ").slice(4).map(parseFloat);
    this.group = "LAYER_SAFEPOINT";
  }
}

export class LAYER_SAFEPOINT_CONV implements LAYER_SAFEPOINT_PROPERTIE {
  ID: number;
  QueryLinkID: number;
  InterLinkID: number;
  length: number;
  PointXY: Array<number>;
  group: "LAYER_SAFEPOINT";
  Index: number;
  constructor(data) {
    this.ID = Number(data.ID);
    this.QueryLinkID = Number(data.QueryLinkID);
    this.InterLinkID = Number(data.InterLinkID);
    this.length = Number(data.length);
    this.PointXY = data.PointXY.join(" ").replaceAll(",", " ");
  }
  conv = () => {
    let result = "";
    result += this.ID + " ";
    result += this.QueryLinkID + " ";
    result += this.InterLinkID + " ";
    result += this.length + " ";
    result += this.PointXY;
    result += "\r\n";
    return result;
  };
}
