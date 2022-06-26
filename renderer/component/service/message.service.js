import { Subject } from "rxjs";

const feautreSubject = new Subject();
const layerSubject = new Subject();
const confirmSubject = new Subject();
const confirmValueSubject = new Subject();
const alertSubject = new Subject();
const loadingSubject = new Subject();
const selectSubject = new Subject();
const featureCopySubject = new Subject();
const featureDelSubject = new Subject();
export const featureService = {
  selected: (state, features) => feautreSubject.next({ state: state, features: features }),
  stopLineIdSelected: (state, features, select) => feautreSubject.next({ state: state, features: features, select: select }),
  linkIdSelected: (state, features, select) => feautreSubject.next({ state: state, features: features, select: select }),
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
  sendMessage: (state, message, onConfirm, onCancel) => confirmSubject.next({ state: state, text: message, onConfirm: onConfirm, onCancel: onCancel}),
  clearMessages: () => confirmSubject.next(),
  getMessage: () => confirmSubject.asObservable(),
};
export const confrimValueService = {
  sendMessage: (state, message, onConfirm, onCancel, value, item) => confirmValueSubject.next({ state: state, text: message, onConfirm: onConfirm, onCancel: onCancel  , value: value, item:item}),
  clearMessages: () => confirmValueSubject.next(),
  getMessage: () => confirmValueSubject.asObservable(),
};
export const alertService = {
  sendMessage: (state, message) => alertSubject.next({ state: state, text: message }),
  clearMEssage: () => alertSubject.next(),
  getMessage: () => alertSubject.asObservable(),
};

export const loadingService = {
  sendMessage: (state) => loadingSubject.next({ state: state }),
  clearMEssage: () => loadingSubject.next(),
  getMessage: () => loadingSubject.asObservable(),
};

export const selectService = {
  selectActive: (state) => selectSubject.next({ state: state }),
  getMessage: () => selectSubject.asObservable(),
};

export const featureCopyService = {
  copyFeature: (state, features) => featureCopySubject.next({ state: state, features: features }),
  getMessage: () => featureCopySubject.asObservable(),
};

export const featureDelService = { 
  delFeature : (state, features) => featureDelSubject.next({state: state, features: features}),
  getMessage: () => featureDelSubject.asObservable(),
}