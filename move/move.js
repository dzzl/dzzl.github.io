
class Entity {

    constructor(options = {}) {
        Object.assign(this, {
            "name": "entityName",
            "dimensions": {
                x: 50,
                y: 50
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
            "dead": false,
            "shape": "square"
        }, options);

        let boundsCalc = {};

        // switch (this.shape) {
        //     case "square":
                boundsCalc.up = this.position.y;
                boundsCalc.right = (this.position.x + this.dimensions.x);
                boundsCalc.down = (this.position.y + this.dimensions.y);
                boundsCalc.left = this.position.x;
         //         break;
         //     case "circle":
         //         boundsCalc.up = this.position.y - (this.dimensions.x / 2);
         //         boundsCalc.right = (this.position.x + (this.dimensions.x / 2));
         //         boundsCalc.down = (this.position.y + (this.dimensions.x / 2));
         //         boundsCalc.left = this.position.x - (this.dimensions.x / 2);
         //         break;
         // }

        this.bounds = {
            up: boundsCalc.up,
            right: boundsCalc.right,
            down: boundsCalc.down,
            left: boundsCalc.left
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
                "bgColor": "#0000ff",
                "shape": "circle"
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
                "bgColor": "#008000",
                "shape": "circle"
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

        //use pre defined enemies
        enemies.forEach((e, i) => {
            this.enemies[i] = new Entity(e);
        })

        this.tick();

    }


    doMove(entity, direction) {

        entity.move(direction.x, direction.y, this.perim);

    }


    drawShape(fillColour, position, dimensions, shape){

        this.canvasContext.fillStyle = fillColour;

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
                this.canvasContext.arc(position.x, position.y,   (dimensions.x / 2), 0, 2 * Math.PI);
                this.canvasContext.fill();
                break;
        }

    }


    draw() {

        //blitz canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw enemies
        this.enemies.forEach(e => {
            if (e.dead != true) {
                this.checkCollision(this.player,e);
                
                this.drawShape(e.bgColor, e.position, e.dimensions, e.shape);

            }
        });


        //draw tail pieces
        let tailPiece = [];
        for (let i = 1; i < this.tailLength + 1; i++) {
            
            if (this.playerHistory[(i * 10)-1] !== undefined) {
                
                tailPiece[i] = {
                    x: this.playerHistory[(i * 10)-1].x,
                    y: this.playerHistory[(i * 10)-1].y
                };

                this.drawShape("limegreen", tailPiece[i], this.player.dimensions, this.player.shape);

            }

        }


        //draw player

        this.drawShape(this.player.bgColor, this.player.position, this.player.dimensions, this.player.shape);

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



            //gen random enemies
            // if (this.tickCount % 100 === 0){
            //
            //     let newEnemyDimensions = {
            //         x: Math.floor(Math.random() * (30 - 5 + 1) + 5),
            //         y: Math.floor(Math.random() * (30 - 5 + 1) + 5)
            //     }
            //
            //     let newEnemyPosition = {
            //         x: Math.floor(Math.random() * ((this.perim.right - newEnemyDimensions.x) - this.perim.left + 1) + this.perim.left),
            //         y: Math.floor(Math.random() * ((this.perim.down - newEnemyDimensions.y) - this.perim.up + 1) + this.perim.up)
            //     }
            //
            //     let newRandomEnemy = {
            //         "name": "EnemyGen",
            //         "dimensions": {
            //             x: newEnemyDimensions.x,
            //             y: newEnemyDimensions.y
            //         },
            //         "position": {
            //             x: newEnemyPosition.x,
            //             y: newEnemyPosition.y
            //         },
            //         "bgColor": "#" + Math.floor(Math.random() * 16777215).toString(16),
            //         "moveAmount": 2,
            //         "shape": "square"
            //     };
            //     this.enemies[this.enemies.length] = new Entity(newRandomEnemy);
            // }

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


    checkCollision(entity1, entity2) {


        //switch (shape) {
        //    case "square":
        //        this.canvasContext.fillStyle = fillColour;
        //        this.canvasContext.fillRect(
        //            position.x,
        //            position.y,
        //            dimensions.x,
        //            dimensions.y
        //        );
        //        break;
        //    case "circle":
        //        this.canvasContext.beginPath();
        //        this.canvasContext.arc(position.x, position.y,   (dimensions.x / 2), 0, 2 * Math.PI);
        //        this.canvasContext.fill();
        //        break;
        //}




        if (
            (entity1.bounds.left < entity2.bounds.right)
            &&
            (entity1.bounds.right > entity2.bounds.left)
            &&
            (entity1.bounds.up < entity2.bounds.down)
            &&
            (entity1.bounds.down > entity2.bounds.up)
        ) {
            entity2.dead = true;
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
