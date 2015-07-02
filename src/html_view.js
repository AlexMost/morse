"use strict;"

var React = require('react');
var {div, span, button, a, img} = React.DOM;

class RoundButton extends React.Component {
    render() {
        return div({className: "round-button"},
            div({className: "round-button-circle"},
                a({className: "round-button noselect",
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
    //
    // <div class="round-button"><div class="round-button-circle"><a href="http://example.com" class="round-button">Button!!</a></div></div
    render() {
        return div(null,
            div({className: "decoded"},
                this.props.words.map((word, key) => {
                    return span(
                        {key, style: {marginRight: "10px"}}, 
                        word.join(""))
                })),
            div({className: "h-center"}, 
                React.createElement(
                    RoundButton,
                    {
                        onMouseDown: this.onSignalOn,
                        onMouseUp: this.onSignalOff
                    })),
            div({className: "h-center h-mt-20"},
                img({src: this.props.img}))
        )
    }
}

export default MainView;