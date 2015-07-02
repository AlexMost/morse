"use strict;"

var {Record, List, fromJS} = require('immutable');

const INTERVAL = 5

const MORSE_IMG = "./public/MorseCode.png"
const CAT_IMG = "./public/cat.jpg"

export var MorseState = Record({
    spans: [],
    signalOn: false,
    words: [[]],
    img: MORSE_IMG
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

export var addLetterToLastWord = (letter) => {
    return (state) => {
        var words = state.get("words")
        words[words.length-1].push(letter)
        return state.set("words", words)
    }
}

export var addNewWord = (word) => {
    return (state) => {
        var words = state.get("words")
        words.push([])
        return state.set("words", words)   
    }
}

export var setCatImg = () => {
    return (state) => {
        return state.set("img", CAT_IMG)
    }
}