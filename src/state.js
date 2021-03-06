"use strict;"

import {Record, List, fromJS} from 'immutable';

const INTERVAL = 5

const MORSE_IMG = "./public/MorseCode.png"
const CAT_IMG = "./public/cat.jpg"
const SOS_IMG = "./public/sos.jpg"
const LOADING_IMG = "./public/ajax-loader.gif"


export var MorseState = Record({
    spans: [],
    signalOn: false,
    words: List(),
    currentLetters: List(),
    img: MORSE_IMG,
    islisteningForLetter: false,
    islisteningForWord: false,
    loadingImg: LOADING_IMG
})


export var signalOn = () => (state) => state.set("signalOn", true)


export var signalOff = () => (state) => state.set("signalOn", false)


function moveSpan(span) {
    span.offset += INTERVAL
    return span
}


function enlargeSpan(span) {
    span.width += INTERVAL
    return span
}


export var moveSpans = () => {
    return (state) => {
        if (state.get("signalOn")) {
            var js_spans = state.get("spans")
            var [firstSpan, ...others] = js_spans
            var moved = others && others.map(moveSpan) || []
            var result = [enlargeSpan(firstSpan)].concat(moved)
            return state.set("spans", result)
        } else {
            return state.set("spans", state.get("spans").map(moveSpan))
        }
    }
}


export var addSpan = () => {
    return (state) => {
        var state = state.set("signalOn", true)
        var newSpan = {offset: 0, width: INTERVAL}
        var spans = state.get("spans")
        spans.unshift(newSpan)
        return state.set("spans", spans)
    }
}


export var addToCurrentLetters = (letter) => {
    return (state) => {
        return state.set(
            "currentLetters",
            state.get("currentLetters").push(letter))
    }
}


export var addNewWord = (word) => {
    return (state) => {
        return state
            .set("currentLetters", List())
            .set("words",state.get("words").push(word)
        )   
    }
}


export var setCatImg = () => {
    return (state) => {
        return state.set("img", CAT_IMG)
    }
}


export var setSOSImg = () => {
    return (state) => state.set("img", SOS_IMG)
}


export var setIsListeningForLetter = () => {
    return (state) => state.set("islisteningForLetter", true)
}


export var unsetIsListeningForLetter = () => {
    return (state) => state.set("islisteningForLetter", false)
}


export var setIsListeningForWord = () => {
    return (state) => state.set("islisteningForWord", true)
}


export var unsetIsListeningForWord = () => {
    return (state) => state.set("islisteningForWord", false)
}