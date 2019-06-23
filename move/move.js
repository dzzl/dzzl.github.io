
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
            }
        }, options);
    }

    move(x, y, perimeter) {

        this.bounds = {
            "up": this.position.y,
            "right": (this.position.x + this.dimensions.x),
            "down": (this.position.y + this.dimensions.y),
            "left": this.position.x
        }
        
        let destination = {
            "up": (this.bounds.up + (this.moveAmount * y)),
            "right": (this.bounds.right + (this.moveAmount * x)),
            "down": (this.bounds.down + (this.moveAmount * y)),
            "left": (this.bounds.left + (this.moveAmount * x))
        }

        let directionOob = {
            x: false,
            y: false
        }

        if ((y === -1) && (destination.up < perimeter.up)){
            directionOob.y = true;
        };
        if ((x === 1) && (destination.right > perimeter.right)){
            directionOob.x = true;
        };
        if ((y === 1) && (destination.down > perimeter.down)){
            directionOob.y = true;
        };
        if ((x === -1) && (destination.left < perimeter.left)){
            directionOob.x = true;
        };
        


        if (directionOob.x === false){
            this.position.x = (this.position.x + (this.moveAmount * x));
        }
        if (directionOob.y === false) {
            this.position.y = (this.position.y + (this.moveAmount * y));
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
            "bgColor": "#ff00ff"
        };
        let enemies = [
            {
                "name": "enemy1",
                "position": {
                    x: 100,
                    y: 50
                },
                "moveAmount": 1.5,
                "bgColor": "#0000ff"
            },
            {
                "name": "enemy2",
                "position": {
                    x: 200,
                    y: 200
                },
                "moveAmount": 2,
                "bgColor": "#008000"
            },
            {
                "name": "enemy3",
                "position": {
                    x: 5,
                    y: 100
                },
                "moveAmount": 0.5,
                "bgColor": "#a52a2a"
            }
        ];

        this.player = new Entity(player);

        this.enemies = [];
        enemies.forEach((e,i) => {
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
            this.canvasContext.fillStyle = e.bgColor;
            this.canvasContext.fillRect(
                e.position.x,
                e.position.y,
                e.dimensions.x,
                e.dimensions.y
            );
        });

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

    returnCurrentTick(){
        return ('tick: ' + this.tickCount + '   ');
    }



}

let theMover = new Move;
