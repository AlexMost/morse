"use strict;"

import React from 'react';
var {div, span, button, a, img} = React.DOM;


class RoundButton extends React.Component {
    render() {
        return div({className: "round-button"},
            div({className: this.props.signalOn && "round-button-circle-active" || "round-button-circle"},
                a({className: this.props.signalOn && "round-button-active noselect" || "round-button noselect",
                   onMouseDown: this.props.onMouseDown,
                   onMouseUp: this.props.onMouseUp},
                   "Signal"))
        )
    }
}


class MainView extends React.Component {
    constructor(props) {
        super(props);

        this.onSignalOn = this.onSignalOn.bind(this);
        this.onSignalOff = this.onSignalOff.bind(this);
        this.render = this.render.bind(this);
    }

    onSignalOn() {
        this.props.eventStream.onNext({
            action: "signal_start"
        })
    }

    onSignalOff() {
        this.props.eventStream.onNext({
            action: "signal_end"
        })
    }
    
    render() {
        return div(null,
            div(null, "Sentence"),
            div({className: "decoded"},
                this.props.words.map((word, key) => {
                    return span({key, style: {marginRight: "10px"}}, word)    
                }),
                this.props.islisteningForWord && img({src: this.props.loadingImg}) || null),

            div(null, "Current word"),
            div({className: "decoded"},
                span({style: {marginRight: "10px"}}, this.props.currentLetters),
                this.props.islisteningForLetter && img({src: this.props.loadingImg}) || null),

            div({className: "h-center"}, 
                React.createElement(
                    RoundButton,
                    {
                        onMouseDown: this.onSignalOn,
                        onMouseUp: this.onSignalOff,
                        signalOn: this.props.signalOn
                    })),

            div({className: "h-center h-mt-20"},
                img({src: this.props.img}))
        )
    }
}

export default MainView;