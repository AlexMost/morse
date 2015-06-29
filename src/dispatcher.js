"use strict;"

var Rx = require('rx');
var {addSpan, moveSpans, signalOff} = require("./state");


function dispatchActions(eventStream) {
    var drawingLoop = Rx.Observable.interval(50).map(() => moveSpans())

    var signalStarts = eventStream
    .filter(({action}) => action === "signal_start")
    .timestamp()
    .map(() => addSpan())

    var signalEnds = eventStream
    .filter(({action}) => action === "signal_end")
    .timestamp()
    .map(() => signalOff())

    var signalTimeSpans = signalStarts.flatMap((startArgs) => {
        return signalEnds
        .map((endArgs) => endArgs.timestamp - startArgs.timestamp)
        .first()})

    var dotsStream = signalTimeSpans.filter((v) => v <= 400)

    var lineStream = signalTimeSpans.filter((v) => v > 400)

    return Rx.Observable.merge(signalStarts, drawingLoop, signalEnds)
}


export default dispatchActions;