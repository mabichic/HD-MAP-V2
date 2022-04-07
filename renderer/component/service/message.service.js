import { Subject } from "rxjs";

const feautreSubject = new Subject();
const layerSubject = new Subject();
const confirmSubject = new Subject();
const loadingSubject = new Subject();
export const featureService = {
  selected: (state, features) => feautreSubject.next({ state: state, features: features }),
  stopLineIdSelected: (state, features, select) => feautreSubject.next({ state: state, features: features, select:select }),
  dataVisible: (state, layer) => feautreSubject.next({ state: state, layer: layer }),
  sendMessage: (state, message) => feautreSubject.next({ state: state, text: message }),
  clearMessage: () => feautreSubject.next(),
  getMessage: () => feautreSubject.asObservable(),
};

export const layerService = {
  layerSort: (state, layer) => layerSubject.next({ state: state, layer: layer }),
  clearMessage: () => layerSubject.next(),
  getMessage: () => layerSubject.asObservable(),
};

export const confrimService = {
    sendMessage: (state, message, onConfirm, onCancel) => confirmSubject.next({ state: state, text: message, onConfirm : onConfirm,  onCancel: onCancel }),
    clearMessages: () => confirmSubject.next(),
    getMessage: () => confirmSubject.asObservable()
};

export const loadingService = { 
    sendMessage : (state) => loadingSubject.next({state:state}),
    clearMEssage : () => loadingSubject.next(),
    getMessage : () => loadingSubject.asObservable()
}