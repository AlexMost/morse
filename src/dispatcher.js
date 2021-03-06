"use strict;"

import Rx from 'rx';
import {addSpan, moveSpans, signalOff, 
    addToCurrentLetters, addNewWord, setCatImg, 
    setSOSImg, setIsListeningForLetter, 
    unsetIsListeningForLetter, setIsListeningForWord,
    unsetIsListeningForWord} from "./state";
import morse from 'morse';


const SPAN = 400
const LETTER_SPAN = SPAN * 3
const WORD_SPAN = SPAN * 7


function getSignalActions(eventStream) {
    var signalStarts = eventStream
    .filter(({action}) => action === "signal_start").timestamp()

    var signalEnds = eventStream
    .filter(({action}) => action === "signal_end").timestamp()

    var signalTimeSpans = signalStarts.flatMap((startArgs) => {
        return signalEnds.map((endArgs) => {
            console.log(endArgs.timestamp - startArgs.timestamp);
            return endArgs.timestamp - startArgs.timestamp
        }).first()
    })

    var dotsStream = signalTimeSpans.filter((v) => v <= SPAN).map(() => ".")
    var lineStream = signalTimeSpans.filter((v) => v > SPAN).map(() => "-")
    var dotsAndLines = Rx.Observable.merge(dotsStream, lineStream)

    var whiteSpaces = signalEnds.flatMap((endArgs) => {
        let timeout = Rx.Observable.return(LETTER_SPAN).delay(LETTER_SPAN)
        let starts = signalStarts
        .map((startArgs) => startArgs.timestamp - endArgs.timestamp)
        return Rx.Observable.merge(timeout, starts).first()
    })

    var letterWhitespaces = whiteSpaces.filter((v) => v >= LETTER_SPAN && v < WORD_SPAN)

    var wordsWhitespaces = letterWhitespaces.flatMap((span) => {
        var ms = WORD_SPAN - span
        return Rx.Observable.return(ms).delay(ms).first().takeUntil(signalStarts)
    })

    var letterCodes = dotsAndLines.buffer(letterWhitespaces)
    var lettersStream = letterCodes.map((codes) => morse.decode(codes.join(""))).share()

    var wordsStream = lettersStream.buffer(wordsWhitespaces).map((w) => w.join("")).share()

    return {
        signalStarts, signalEnds, 
        signalTimeSpans, dotsStream, lineStream, lettersStream, wordsStream, letterWhitespaces
    }
}


function dispatchActions(eventStream) {
    var {
        signalStarts, signalEnds, 
        signalTimeSpans, dotsStream, lineStream,
        lettersStream, wordsStream, letterWhitespaces
    } = getSignalActions(eventStream)   

    // canvas drawing
    var drawingLoop = Rx.Observable.interval(50).map(moveSpans)
    var addSpans = signalStarts.map(addSpan)
    var endSpans = signalEnds.map(signalOff)

    // letter spinner
    var showWordSpinner = signalStarts.map(setIsListeningForLetter)
    var hideWordSpinner = letterWhitespaces.map(unsetIsListeningForLetter)

    // sentense spinner
    var showSentenseSpinner = signalStarts.map(setIsListeningForWord)
    var hideSentenseSpinner = wordsStream.map(unsetIsListeningForWord)

    // letters and words processing
    var addLetterToLasWordStream = lettersStream.map(addToCurrentLetters)
    var addNewWordStream = wordsStream.map(addNewWord)
    var setCatImgStream = wordsStream.filter((word) => word == "CAT").map(setCatImg)
    var setSOSImgStream = wordsStream.filter((word) => word == "SOS").map(setSOSImg)

    return Rx.Observable.merge(
        drawingLoop, addSpans, endSpans, addLetterToLasWordStream, 
        addNewWordStream, setCatImgStream, setSOSImgStream, 
        showWordSpinner, hideWordSpinner, showSentenseSpinner,
        hideSentenseSpinner)
}


export default dispatchActions;
