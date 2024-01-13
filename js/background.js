{
    const bgCanvas = document.getElementById("bg");
    const bgContext = bgCanvas.getContext("2d");

    let bgEnabled = localStorage.getItem('bgEnabled');
    if(bgEnabled === null) {
        bgEnabled = "true";
        localStorage.setItem('bgEnabled', bgEnabled);
    }
    bgEnabled = bgEnabled === "true";

    const bgToggle = document.getElementById("bg-toggle");
    if(bgToggle !== null) {
        bgToggle.checked = bgEnabled;
        bgToggle.addEventListener('change', () => {
            bgEnabled = bgToggle.checked;
            localStorage.setItem('bgEnabled', bgEnabled);
        });
    }

    let width  = bgCanvas.offsetWidth;
    let height = bgCanvas.offsetHeight;

    let lastTimestamp = performance.now();
    let stars = [];

    function random(min, max){ return Math.random() * (min - max) + max }

    function resize(){
        width = bgCanvas.offsetWidth;
        height = bgCanvas.offsetHeight;

        bgCanvas.width = width;
        bgCanvas.height = height;

        let starCount = Math.floor(width * height * 6e-4)
        stars = new Array(starCount);

        for (let i = 0; i < starCount; i++) {
            let size = random(2.6, 4)
            stars[i] = {
                size: size,
                x: random(-10, width + 10),
                y: random(-10, height + 10),
                dx: random(-0.001, 0.001) * size,
                dy: random(-0.001, 0.001) * size
            }
        }
    }

    function draw(timestamp){
        let dt = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        if(width !== bgCanvas.offsetWidth || height !== bgCanvas.offsetHeight) resize();

        bgContext.clearRect(0, 0, width, height);

        if(!bgEnabled) {
            return requestAnimationFrame(draw);
        }
        
        // move stars
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            star.x += (star.dx * dt)
            star.y += (star.dy * dt)
            star.x %= width  + 10
            star.y %= height + 10
        }

        // draw stars
        bgContext.fillStyle = "#FFFFFFAF"
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            bgContext.fillRect(star.x, star.y, star.size, star.size);
        }
        requestAnimationFrame(draw);
    }

    resize();
    draw(performance.now());
}