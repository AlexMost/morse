"use strict;"

var Rx = require('rx');
var React = require('react');
var MainView = require('./html_view');
var dispatchActions = require('./dispatcher');
var CanvasView = require('./canvas_view');
var {MorseState} = require('./state')


function getViewState(state, eventStream) {
    return {
        eventStream: eventStream,
        spans: state.get("spans")
    }
}

function onlyIfChanged(oldState, newState) {
    if (oldState && newState) {
        return oldState !== newState
    }
}


function initApp(node, canvas_node) {
    var eventStream = new Rx.Subject()
    var initialState = MorseState()
    var stateStream = dispatchActions(eventStream);
    var canvView = new CanvasView(canvas_node);

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
