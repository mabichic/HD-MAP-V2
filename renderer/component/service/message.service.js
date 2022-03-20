import {Subject} from 'rxjs'

const feautreSubject = new Subject();

export const featureService = { 
    selected : (state, features) => feautreSubject.next({state:state, features:features}),
    sendMessage : (state, message) => feautreSubject.next({state:state, text:message}),
    clearMessage : () => feautreSubject.next(),
    getMessage : () => feautreSubject.asObservable()
}