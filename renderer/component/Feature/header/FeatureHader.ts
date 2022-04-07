
const numberAndrestRegex = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"a-zA-Zㄱ-하-ㅣ가-힣]/; //특수문자 영소대 한글 체크
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

export function valueToArry(params){
    console.log(params);
    if(numberAndrestRegex.test(params.newValue)){
        console.log(params);
        params.data.StopLineID = JSON.parse("[" + params.newValue + "]"[0]);
        return true;
    }else{
        return false;
    }

}

export function arrayValueSetter(params){
    
}
