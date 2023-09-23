const canvas = document.getElementById("bg");

const context = canvas.getContext("2d");

let width  = canvas.offsetWidth;
let height = canvas.offsetHeight;

let lastTimestamp = performance.now();
let stars = [];

function random(min, max){ return Math.random() * (min - max) + max }

function resize(){
    let starCount = Math.floor(width * height * 6e-4)
    stars = new Array(starCount);

    for (let i = 0; i < starCount; i++) {
        let size = random(2.6, 4)
        stars[i] = {
            size: size,
            x: random(-10, width + 10),
            y: random(-10, height + 10),
            dx: random(-0.005, 0.005) * size,
            dy: random(-0.005, 0.005) * size
        }
    }
}

function draw(timestamp){
    let dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // check resize
    if(width !== canvas.offsetWidth || height !== canvas.offsetHeight || isNaN(stars[1].x)){
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;

        canvas.width = width;
        canvas.height = height;
        resize();
    }

    // move stars
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += (star.dx * dt / 10) % (width  + 10)
        star.y += (star.dy * dt / 10) % (height + 10)
    }

    // draw stars
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#FFFFFFAF"
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        context.fillRect(star.x, star.y, star.size, star.size);
    }
    requestAnimationFrame(draw);
}

resize();
draw();