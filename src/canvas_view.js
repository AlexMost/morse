class CanvasView {
    constructor(canvas_node) {
        this.width = canvas_node.width;
        this.height = canvas_node.height;
        this.ctx = canvas_node.getContext('2d');
        this.render = this.render.bind(this);
    }

    render(props) {
        this.ctx.fillStyle = "#FFF"
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000"
        props.spans.map((span) => {
                this.ctx.fillRect(span.offset, 10, span.width, 5)
            });
    }
}


export default  CanvasView