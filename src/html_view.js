"use strict;"

var React = require('react');
var {div, span, button} = React.DOM;


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
            div(null,
                this.props.words.map((word, key) => {
                    return span({key}, word.join(""))
                })),
            div(null, 
                button(
                    {
                        onMouseDown: this.onSignalOn,
                        onMouseUp: this.onSignalOff
                    },
                "Signal"))
        )
    }
}

export default MainView;