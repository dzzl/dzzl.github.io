const degreeExtremes = 10;

document.querySelectorAll('card').forEach(el => {

    const cardImage = el.querySelector('img');

    const setTransform = (x, y, z) => cardImage.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(${z}px)`;

    el.addEventListener('mousemove', event => {

        cardImage.style.transition = `0s`;

        const cardWidth = (el.clientWidth * degreeExtremes);
        const cardHeight = (el.clientHeight * degreeExtremes);

        let Xval = ((event.offsetX / cardWidth) * 100) - (degreeExtremes / 2);
        let Yval = ((event.offsetY / cardHeight) * 100) - (degreeExtremes / 2);
        const Zval = 60;

        Yval = -Yval;

        setTransform(Xval, Yval, Zval);

    })

    el.addEventListener('mouseout', event => {
        cardImage.style.transition = `0.5s`;
        setTransform(0, 0, 0);
    })

})