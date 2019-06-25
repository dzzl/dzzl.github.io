
class Entity {

    constructor(options = {}) {
        Object.assign(this, {
            name: "entityName",
            dimensions: [20,20],
            position: [50,50],
            bgColor: '#000',
            moveAmount: 1,
            momentum: [0,0],
            bounds: [0,0,0,0]
        }, options);
    }

    move(x, y, perimeter) {

        this.bounds = [
            this.position[1],
            (this.position[0] + this.dimensions[0]),
            (this.position[1] + this.dimensions[1]),
            this.position[0]
        ]
        
        let destination = [
            (this.bounds[0] + (this.moveAmount * y)),
            (this.bounds[1] + (this.moveAmount * x)),
            (this.bounds[2] + (this.moveAmount * y)),
            (this.bounds[3] + (this.moveAmount * x)),
        ]

        let directionOob = [false, false]
        
        if ((y === -1) && (destination[0] < perimeter[0])){
            directionOob[1] = true;
        };
        if ((x === 1) && (destination[1] > perimeter[1])){
            directionOob[0] = true;
            //works
        };
        if ((y === 1) && (destination[2] > perimeter[2])){
            directionOob[1] = true;
            //works
        };
        if ((x === -1) && (destination[3] < perimeter[3])){
            directionOob[0] = true;
        };
        


        if (directionOob[0] === false){
            this.position[0] = (this.position[0] + (this.moveAmount * x));
        }
        if (directionOob[1] === false) {
            this.position[1] = (this.position[1] + (this.moveAmount * y));
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
            "x": 0,
            "y": -1
        },
        {
            "x": 1,
            "y": 0
        },
        {
            "x": 0,
            "y": 1
        }, {
            "x": -1,
            "y": 0
        }];

        this.keyStates = new Array(this.keyCodes.length);
        this.keyStates.fill(false);

        this.keyTaps = new Array(this.keyCodes.length);
        this.keyTaps.fill(false);


        //drawables
        this.canvas = document.querySelector("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.perim = [0, this.canvas.width, this.canvas.height, 0]

        //entities
        let player = {
            "name": "player",
            "position": [150,150],
            "moveAmount": 2.5,
            "bgColor": "#ff00ff"
        };
        let enemies = [
            {
                "name": "enemy1",
                "dimensions": [40,40],
                "position": [100,50],
                "moveAmount": 1.5,
                "bgColor": "#0000ff"
            },
            {
                "name": "enemy2",
                "dimensions": [40, 40],
                "position": [200,200],
                "moveAmount": 2,
                "bgColor": "#008000"
            },
            {
                "name": "enemy3",
                "dimensions": [40, 40],
                "position": [5,100],
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
                e.position[0],
                e.position[1],
                e.dimensions[0],
                e.dimensions[1]
            );
        });

        //draw player
        this.canvasContext.fillStyle = this.player.bgColor;
        this.canvasContext.fillRect(
            this.player.position[0],
            this.player.position[1],
            this.player.dimensions[0],
            this.player.dimensions[1]
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
            this.enemies.forEach(e => {
                let randomDirection = Math.floor(Math.random() * Math.floor(4))
                this.doMove(e, this.moveDirection[randomDirection]);
            });

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
