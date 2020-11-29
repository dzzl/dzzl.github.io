class Card {

    constructor(el) {

        this.element = el;

        this.card = this.element.querySelector('.image');

        this.degreeExtremes = 10;
    
        this.cardWidth = (this.card.clientWidth * this.degreeExtremes);
        this.cardHeight = (this.card.clientHeight * this.degreeExtremes);

        this.isMoving = false;
        this.mouseOut = true;

        this.matrix = {
            x: 0,
            y: 0,
            z: 0
        }

        this.bindEvents();

    }

    bindEvents() {
        this.element.addEventListener('mousemove', event => this.onMouseMove(event));
        this.element.addEventListener('mouseout', event => this.onMouseOut(event));
        this.element.addEventListener('mouseenter', event => this.onMouseEnter(event));
    }

    onMouseOut() {

        this.mouseOut = true;

        this.card.style.transition = `0.5s`;

        this.matrix = {
            x: 0,
            y: 0,
            z: 0
        }

        this.doMove();
    }

    onMouseMove(event) {

        this.card.style.transition = `0s`;

        let Xval = ((event.offsetX / this.cardWidth) * 100) - (this.degreeExtremes / 2);
        let Yval = ((event.offsetY / this.cardHeight) * 100) - (this.degreeExtremes / 2);
        Yval = -Yval;

        this.matrix.x = Xval;
        this.matrix.y = Yval;

        if (this.isMoving !== true){
            this.doMove();
        }

    }

    onMouseEnter() {

        this.mouseOut = false;
        this.isMoving = true;

        const step = () => {
            this.matrix.z = (this.matrix.z + 10);
            if ((this.matrix.z < 100) && (this.mouseOut === false)) {
                window.requestAnimationFrame(step);
                this.doMove();
            } else {
                this.isMoving = false;
            }
        }

        window.requestAnimationFrame(step);

    }

    doMove() {

        

        let x = this.matrix.x;
        let y = this.matrix.y;
        let z = this.matrix.z;

        this.card.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(${z}px)`;

    }

}




document.querySelectorAll('card').forEach(el => {
    let card = new Card(el);
})
