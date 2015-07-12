"use strict;"

import Rx from 'rx';
import React from 'react';
import MainView from './html_view';
import dispatchActions from './dispatcher';
import CanvasView from './canvas_view';
import {MorseState} from './state';


function getViewState(state, eventStream) {
    return {
        eventStream: eventStream,
        spans: state.get("spans"),
        words: state.get("words").filter((w) => w.length),
        img: state.get("img"),
        signalOn: state.get("signalOn"),
        islisteningForLetter: state.get("islisteningForLetter"),
        islisteningForWord: state.get("islisteningForWord"),
        loadingImg: state.get("loadingImg"),
        currentLetters: state.get("currentLetters").toArray().join("")
    }
}


function listenDocumentSpacePress(eventStream) {
    var spaceKeyDowns = Rx.Observable.fromEvent(document, 'keydown')
    .filter((ev) => ev.keyCode === 32)
    .map(() => "signal_start")

    var spaceKeyUps = Rx.Observable.fromEvent(document, 'keyup')
    .filter((ev) => ev.keyCode === 32)
    .map(() => "signal_end")
    
    Rx.Observable.merge(spaceKeyDowns, spaceKeyUps)
    .distinctUntilChanged().subscribe((action) => {
        eventStream.onNext({action})
    })
}


function initApp(node, canvas_node) {
    var eventStream = new Rx.Subject()
    var initialState = MorseState()
    var stateStream = dispatchActions(eventStream);
    var canvView = new CanvasView(canvas_node);

    listenDocumentSpacePress(eventStream);

    stateStream
    .scan(initialState, (state, action) => action(state))
    .startWith(initialState)
    .subscribe(
        (newProps) => {
            React.render(
                React.createElement(
                    MainView,
                    getViewState(newProps, eventStream)),
                node)
            canvView.render(getViewState(newProps, eventStream))
        }
    );

    
}


export default initApp;
