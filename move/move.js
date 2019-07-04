
class Entity {

    constructor(options = {}) {
        Object.assign(this, {
            "name": "entityName",
            "dimensions": {
                x: 20,
                y: 20
            },
            "position": {
                x: 50,
                y: 50
            },
            "bgColor": "#000",
            "moveAmount": 1,
            "momentum": {
                x: 50,
                y: 50
            },
            "bounds": {
                "up": 0,
                "right": 0,
                "down": 0,
                "left": 0
            },
            "dead": false,
            "shape": "square"
        }, options);
        this.bounds = {
            "up": this.position.y,
            "right": (this.position.x + this.dimensions.x),
            "down": (this.position.y + this.dimensions.y),
            "left": this.position.x
        }
    }

    move(x, y, perimeter) {

        let destination = {
            "x": (this.bounds.left + (this.moveAmount * x)),
            "y": (this.bounds.up + (this.moveAmount * y))
        }

        if (y) {
            if ((y === -1) && (destination.y <= perimeter.up)) {
                destination.y = 0;
            }
            if ((y === 1) && ((destination.y + this.dimensions.y) >= perimeter.down)) {
                destination.y = (perimeter.down - this.dimensions.y);
            }
        }
        if (x) {
            if ((x === 1) && ((destination.x + this.dimensions.x) >= perimeter.right)) {
                destination.x = (perimeter.right - this.dimensions.x);
            }
            if ((x === -1) && (destination.x <= perimeter.left)) {
                destination.x = 0;
            }
        }

        this.position.x = destination.x;
        this.position.y = destination.y;

        this.bounds = {
            "up": this.position.y,
            "right": (this.position.x + this.dimensions.x),
            "down": (this.position.y + this.dimensions.y),
            "left": this.position.x
        }

    }

}


class Move {

    constructor() {

        //keys
        this.monitorKeypresses();

        this.keysHeld = '';
        this.tickCount = 0;

        this.keyCodes = [38, 39, 40, 37];
        this.keyDirection = ["⬆", "▶", "⬇", "◀"]
        this.moveDirection = [{
            x: 0,
            y: -1
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 1
        }, {
            x: -1,
            y: 0
        }];

        this.keyStates = new Array(this.keyCodes.length);
        this.keyStates.fill(false);

        this.keyTaps = new Array(this.keyCodes.length);
        this.keyTaps.fill(false);


        //drawables
        this.canvas = document.querySelector("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.perim = {
            "up": 0,
            "right": this.canvas.width,
            "down": this.canvas.height,
            "left": 0
        };

        //entities
        let player = {
            "name": "player",
            "position": {
                x: 150,
                y: 150
            },
            "moveAmount": 2.5,
            "bgColor": "red",
            "shape": "circle"
        };
        let enemies = [
            {
                "name": "enemy1",
                "position": {
                    x: 100,
                    y: 50
                },
                "moveAmount": 3.5,
                "bgColor": "#0000ff"
            },
            {
                "name": "enemy2",
                "position": {
                    x: 200,
                    y: 200
                },
                "dimensions": {
                    x: 40,
                    y: 40
                },
                "moveAmount": 5,
                "bgColor": "#008000"
            },
            {
                "name": "enemy3",
                "position": {
                    x: 5,
                    y: 100
                },
                "dimensions": {
                    x: 30,
                    y: 60
                },
                "moveAmount": 6.5,
                "bgColor": "#a52a2a"
            },
            {
                "name": "enemy4",
                "position": {
                    x: 260,
                    y: 260
                },
                "dimensions": {
                    x: 10,
                    y: 10
                },
                "moveAmount": 0.5,
                "bgColor": "#a52a2a"
            },
            {
                "name": "enemy5",
                "position": {
                    x: 260,
                    y: 50
                },
                "dimensions": {
                    x: 20,
                    y: 20
                },
                "moveAmount": 1.5,
                "bgColor": "#a52a2a"
            }
        ];

        this.tailLength = 0;

        this.playerHistory = [];

        this.player = new Entity(player);

        this.enemies = [];
        enemies.forEach((e, i) => {
            this.enemies[i] = new Entity(e);
        })


        //go
        this.draw();
        this.tick();

    }


    doMove(entity, direction) {

        entity.move(direction.x, direction.y, this.perim);

    }


    draw() {

        //clear whole canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw enemies
        this.enemies.forEach(e => {

            if (e.dead != true) {
                this.checkCollision(e);
                this.canvasContext.fillStyle = e.bgColor;
                this.canvasContext.fillRect(
                    e.position.x,
                    e.position.y,
                    e.dimensions.x,
                    e.dimensions.y
                );
            };
        });


        let tailPiece = [];
        for (let i = 1; i < this.tailLength + 1; i++) {
            
            if (this.playerHistory[(i * 10)-1] !== undefined) {
                

                tailPiece[i] = {
                    x: this.playerHistory[(i * 10)-1].x,
                    y: this.playerHistory[(i * 10)-1].y
                }

                this.canvasContext.fillStyle = "limegreen";
                this.canvasContext.fillRect(
                    tailPiece[i].x,
                    tailPiece[i].y,
                    this.player.dimensions.x,
                    this.player.dimensions.y
                );
            }

        }



        //draw player
        this.canvasContext.fillStyle = this.player.bgColor;
        this.canvasContext.fillRect(
            this.player.position.x,
            this.player.position.y,
            this.player.dimensions.x,
            this.player.dimensions.y
        );
    }

    tick() {

        requestAnimationFrame(t => {

            this.draw();

            this.keysHeld = '';

            this.keyCodes.forEach((k, i) => {
                if (this.keyStates[i] || this.keyTaps[i]) {
                    this.keysHeld += this.keyDirection[i];

                    this.doMove(this.player, this.moveDirection[i]);

                    if (this.playerHistory.length < (this.tailLength * 10)) {
                        this.playerHistory.unshift({
                            "x": this.player.position.x,
                            "y": this.player.position.y
                        });
                    } else {
                        this.playerHistory.pop();
                        this.playerHistory.unshift({
                            "x": this.player.position.x,
                            "y": this.player.position.y
                        });
                    }


                }
                if (this.keyTaps[i] === true) {
                    this.keyTaps[i] = false;
                }
            });



            //move each enemy random direction
            //this.enemies.forEach(e => {
            //    let randomDirection = Math.floor(Math.random() * Math.floor(4))
            //    this.doMove(e, this.moveDirection[randomDirection]);
            //});

            //console.log('tick ' + this.tickCount + ': ' + this.keysHeld);
            this.tickCount++;
            this.tick();
        })
    }

    checkCollision(e) {

        if (
            (this.player.bounds.left < e.bounds.right)
            &&
            (this.player.bounds.right > e.bounds.left)
            &&
            (this.player.bounds.up < e.bounds.down)
            &&
            (this.player.bounds.down > e.bounds.up)
        ) {
            e.dead = true;
            this.tailLength++;
        }
    }

    monitorKeypresses() {
        document.addEventListener('keydown', e => {

            this.keyCodes.forEach((k, i) => {
                if (e.keyCode === this.keyCodes[i]) {
                    this.keyStates[i] = true;
                    if (this.keyTaps[i] === false) {
                        this.keyTaps[i] = true;
                    }
                }
            });

        });

        document.addEventListener('keyup', e => {

            this.keyCodes.forEach((k, i) => {
                if (e.keyCode === this.keyCodes[i]) {
                    this.keyStates[i] = false;
                }
            });

        });
    }

    returnCurrentTick() {
        return ('tick: ' + this.tickCount + '   ');
    }



}

let theMover = new Move;
