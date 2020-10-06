class Entity {


}


class Move {

    constructor() {

        //drawables
        this.canvas = document.querySelector("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.shapes = [];

        this.bindClick();
        this.tick();

    }

    bindClick() {
        this.canvas.addEventListener("mousemove", e => {
            this.addShape(e.x, e.y);
        });
    }

    addShape(x, y) {
        this.shapes.push({ x, y });
    }

    drawShape(position) {

        this.canvasContext.fillStyle = "#000000";
        let shape = "circle";

        switch (shape) {
            case "square":
                this.canvasContext.fillRect(
                    position.x,
                    position.y,
                    dimensions.x,
                    dimensions.y
                );
                break;
            case "circle":
                this.canvasContext.beginPath();
                this.canvasContext.arc(position.x, position.y, (20 / 2), 0, 2 * Math.PI);
                this.canvasContext.fill();
                break;
        }

    }


    draw() {

        //blitz canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw enemies
        this.shapes.forEach(e => {
            this.drawShape(e);
        });

    }

    tick() {

        requestAnimationFrame(t => {

            this.draw();

            this.tickCount++;
            this.tick();
        })
    }


    returnCurrentTick() {
        return ('tick: ' + this.tickCount + '   ');
    }



}

let theMover = new Move;