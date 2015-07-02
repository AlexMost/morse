"use strict;"

var Rx = require('rx');
var RxDOM = require('rx-dom');
var React = require('react');
var MainView = require('./html_view');
var dispatchActions = require('./dispatcher');
var CanvasView = require('./canvas_view');
var {MorseState} = require('./state')


function getViewState(state, eventStream) {
    return {
        eventStream: eventStream,
        spans: state.get("spans"),
        words: state.get("words").filter((w) => w.length),
        img: state.get("img"),
        signalOn: state.get("signalOn")
    }
}


function listenDocumentSpacePress(eventStream) {
    var spaceKeyDowns = Rx.DOM.keydown(document).filter((ev) => ev.keyCode == 32)
        .map(() => "signal_start")

    var spaceKeyUps = Rx.DOM.keyup(document).filter((ev) => ev.keyCode == 32)
        .map(() => "signal_end")
    
    Rx.Observable.merge(spaceKeyDowns, spaceKeyUps).distinctUntilChanged().subscribe((action) => {
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
