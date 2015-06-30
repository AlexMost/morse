"use strict;"

var Rx = require('rx');
var {addSpan, moveSpans, signalOff, addLetterToLastWord} = require("./state");
var morse = require('morse');


const SPAN = 400
const LETTER_SPAN = SPAN * 3
const WORD_SPAN = SPAN * 7


function getSignalActions(eventStream) {
    var signalStarts = eventStream
    .filter(({action}) => action === "signal_start")
    .timestamp()

    var signalEnds = eventStream
    .filter(({action}) => action === "signal_end")
    .timestamp()

    var signalTimeSpans = signalStarts.flatMap((startArgs) => {
        return signalEnds
        .map((endArgs) => endArgs.timestamp - startArgs.timestamp)
        .first()})

    var dotsStream = signalTimeSpans.filter((v) => v <= SPAN)
    .map(() => ".")

    var lineStream = signalTimeSpans.filter((v) => v > SPAN)
    .map(() => "-")

    var dotsAndLines = Rx.Observable.merge(dotsStream, lineStream)

    var whiteSpaces = signalEnds.flatMap((endArgs) => {
        let timeout = Rx.Observable.return(LETTER_SPAN).delay(LETTER_SPAN)
        let starts = signalStarts
        .map((startArgs) => startArgs.timestamp - endArgs.timestamp)
        return Rx.Observable.merge(timeout, starts).first()
    });

    var letterWhitespaces = whiteSpaces.filter((v) => {
        return v >= LETTER_SPAN && v < WORD_SPAN})

    var letters = dotsAndLines.buffer(letterWhitespaces)

    return {
        signalStarts, signalEnds, 
        signalTimeSpans, dotsStream, lineStream, letters
    }
}


function dispatchActions(eventStream) {
    var {
        signalStarts, signalEnds, 
        signalTimeSpans, dotsStream, lineStream,
        letters
    } = getSignalActions(eventStream)   

    var drawingLoop = Rx.Observable.interval(50).map(() => moveSpans())

    var addSpans = signalStarts.map(() => addSpan())

    var signalOffs = signalEnds.map(() => signalOff())

    var lettersLog = letters.map((codes) => {
        var letter = morse.decode(codes.join(""))
        console.log("letter", letter)
        return addLetterToLastWord(letter)
    })        

    return Rx.Observable.merge(
        drawingLoop, addSpans, signalOffs, lettersLog)
}


export default dispatchActions;