import { getUnDoReDoIndex, UndoPush } from "../../modify/UndoRedo";
import { alertService } from "../../service/message.service";

const numberAndrestRegex =
  /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"a-zA-Zㄱ-하-ㅣ가-힣]/; //특수문자 영소대 한글 체크

const pattern_eng = /[a-zA-Z]/; // 문자
const pattern_spc = /[~!@#$%^&*()_+|<>?:{}./?"'\\]/; // 특수문자
const pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

export function lookupValue(mappings: Record<number, string>, key: number) {
  return mappings[key];
}
export function lookupKey(mappings: Record<string, string>, name: string) {
  const keys = Object.keys(mappings);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (mappings[key] === name) {
      return key;
    }
  }
}
export function extractValues(mappings: Record<number, string>) {
  return Object.keys(mappings).map((x) => parseInt(x));
}

export function valueToArry(params) {
  if (params.newValue === params.oldValue) return params.oldValue;
  if (
    !pattern_eng.test(params.newValue) &&
    !pattern_spc.test(params.newValue) &&
    !pattern_kor.test(params.newValue)
  ) {
    if (params.node.data.group === "LAYER_ROADMARK") {
      return Array.from(
        new Set(params.newValue.split(",").filter(Boolean).map(Number))
      ).filter((value) => {
        let feature = params.data.source.getFeatureById(
          "LAYER_ROADMARK" + params.data.Index + "_" + value
        );
        return value != params.node.data.ID && feature?.get("Type") === 7;
      });
    } else {
      return Array.from(
        new Set(params.newValue.split(",").filter(Boolean).map(Number))
      ).filter((value) => {
        let feature = params.data.source.getFeatureById(
          "LAYER_ROADMARK" + params.data.Index + "_" + value
        );
        return feature?.get("Type") === 7;
      });
    }
  } else {
    alertService.sendMessage("Error.", "잘못된 값을 입력하셨습니다.");
    return params.oldValue;
  }
}

export function arrayValueSetter(params) {}

export function idCheck(params) {
  var newValue = Number(params.newValue);
  if (newValue === params.oldValue) {
    return params.oldValue;
  }

  if (params.newValue.toString().trim() === "") {
    alertService.sendMessage("Error.", "값이 입력되지 않았습니다.");
    return params.oldValue;
  }
  var newValue = Number(params.newValue);
  if (isNaN(newValue)) {
    alertService.sendMessage("Error.", "숫자만 입력 할 수 있습니다.");
    return params.oldValue;
  } else if (newValue < 1) {
    alertService.sendMessage("Error.", "ID는 1보다 작을 수 없습니다.");
    return params.oldValue;
  } else {
    if (
      params.data.source.getFeatureById(
        params.data.group + params.data.Index + "_" + params.newValue
      ) === null
    ) {
      return newValue;
    } else {
      alertService.sendMessage("Error.", "중복된 ID값이 존재합니다.");
      return params.oldValue;
    }
  }
}
export function pointXYCheck(params) {
  return params.oldValue;
}
export function numberCheck(params) {
  var newValue = Number(params.newValue);
  if (isNaN(newValue)) {
    alertService.sendMessage("Error.", "숫자만 입력 할 수 있습니다.");
    return params.oldValue;
  } else return newValue;
}

export function linkIdCheck(params) {
  var newValue = Number(params.newValue);
  if (isNaN(newValue)) {
    alertService.sendMessage("Error.", "숫자만 입력 할 수 있습니다.");
    return params.oldValue;
  } else if (newValue === params.oldValue) {
    // alertService.sendMessage("Error.", "입력하신 값과 이전 값이 동일합니다.");
    return params.oldValue;
  } else {
    if (
      params.data.source.getFeatureById(
        params.data.group + params.data.Index + "_" + params.newValue
      ) === null
    ) {
      alertService.sendMessage(
        "Error.",
        "해당하는 Link ID를 가진 오브젝트가 없습니다."
      );
      return params.oldValue;
    } else if (newValue === params.data.ID) {
      alertService.sendMessage(
        "Error.",
        "자기 자신을 Link ID로 등록 할 수 없습니다."
      );
      return params.oldValue;
    } else {
      return newValue;
    }
  }
}

export function linkIdCheck0Permit(params) {
  var newValue = Number(params.newValue);
  if (isNaN(newValue)) {
    alertService.sendMessage("Error.", "숫자만 입력 할 수 있습니다.");
    return params.oldValue;
  } else if (newValue === params.oldValue) {
    // alertService.sendMessage("Error.", "입력하신 값과 이전 값이 동일합니다.");
    return params.oldValue;
  } else if (newValue === 0) {
    if (
      params.data.source.getFeatureById(
        params.data.group + params.data.Index + "_" + params.oldValue
      ) !== null
    ) {
      let f = params.data.source.getFeatureById(
        params.data.group + params.data.Index + "_" + params.oldValue
      );

      let target = f;
      let prevTarget = f.clone();
      if (params.colDef.field === "RLinkID") f.set("LLinkID", 0);
      else if (params.colDef.field === "LLinkID") f.set("RLinkID", 0);
      let nextTarget = f.clone();
      UndoPush(
        "UPDATE",
        target.get("source"),
        target,
        prevTarget,
        nextTarget,
        getUnDoReDoIndex()
      );
    }

    return newValue;
  } else {
    if (
      params.data.source.getFeatureById(
        params.data.group + params.data.Index + "_" + params.newValue
      ) === null
    ) {
      alertService.sendMessage(
        "Error.",
        "해당하는 Link ID를 가진 오브젝트가 없습니다."
      );
      return params.oldValue;
    } else if (newValue === params.data.ID) {
      alertService.sendMessage(
        "Error.",
        "자기 자신을 Link ID로 등록 할 수 없습니다."
      );
      return params.oldValue;
    } else {
      if (params.data[params.colDef.field] !== 0) {
        let oldF = params.data.source.getFeatureById(
          params.data.group +
            params.data.Index +
            "_" +
            params.data[params.colDef.field]
        );
        let oldTarget = oldF;
        let oldPrevTarget = oldF.clone();
        if (params.colDef.field === "RLinkID") {
          oldF.set("LLinkID", 0);
        } else if (params.colDef.field === "LLinkID") {
          oldF.set("RLinkID", 0);
        }
        let oldNextTarget = oldF.clone();
        UndoPush(
          "UPDATE",
          oldTarget.get("source"),
          oldTarget,
          oldPrevTarget,
          oldNextTarget,
          getUnDoReDoIndex()
        );
      }

      let f = params.data.source.getFeatureById(
        params.data.group + params.data.Index + "_" + params.newValue
      );
      let target = f;
      let prevTarget = f.clone();
      if (params.colDef.field === "RLinkID") f.set("LLinkID", params.data.ID);
      else if (params.colDef.field === "LLinkID")
        f.set("RLinkID", params.data.ID);
      let nextTarget = f.clone();
      UndoPush(
        "UPDATE",
        target.get("source"),
        target,
        prevTarget,
        nextTarget,
        getUnDoReDoIndex()
      );

      // const instances = params.api.getCellEditorInstances();
      // if (instances?.length > 0) {
      //   // instances[0].eInput.value = message.features[0].get("ID");
      //   // let f = message.features[0];
      //   // let target = f;
      //   // let prevTarget = f.clone();
      //   // if (params.colDef.field === "RLinkID") f.set("LLinkID", params.data.ID);
      //   // else if (params.colDef.field === "LLinkID") f.set("RLinkID", params.data.ID);

      //   // let nextTarget = f.clone();
      //   // UndoPush("UPDATE", target.get("source"), target, prevTarget, nextTarget, getUnDoReDoIndex());
      // }
      return newValue;
    }
  }
}

export function linkIdCheckNoSelf(params) {
  var newValue = Number(params.newValue);
  if (isNaN(newValue)) {
    alertService.sendMessage("Error.", "숫자만 입력 할 수 있습니다.");
    return params.oldValue;
  } else if (newValue === params.oldValue) {
    // alertService.sendMessage("Error.", "입력하신 값과 이전 값이 동일합니다.");
    return params.oldValue;
  } else {
    if (
      params.data.source.getFeatureById(
        "LAYER_LN_LINK" + params.data.Index + "_" + params.newValue
      ) === null
    ) {
      alertService.sendMessage(
        "Error.",
        "해당하는 Link ID를 가진 오브젝트가 없습니다."
      );
      return params.oldValue;
    } else {
      return newValue;
    }
  }
}
