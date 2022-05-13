const numberAndrestRegex = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"a-zA-Zㄱ-하-ㅣ가-힣]/; //특수문자 영소대 한글 체크

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
  if (!pattern_eng.test(params.newValue) && !pattern_spc.test(params.newValue) && !pattern_kor.test(params.newValue)) {
      if(params.node.data.group === "LAYER_ROADMARK"){
          params.data.StopLineID = Array.from(new Set(params.newValue.split(",").filter(Boolean).map(Number))).filter(value=>{ 
              return value != params.node.data.ID;
          });
      }else{
        params.data.StopLineID = Array.from(new Set(params.newValue.split(",").filter(Boolean).map(Number)));
      }
    return true;
  } else {
    return false;
  }
}

export function arrayValueSetter(params) {}
