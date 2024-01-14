let camX = 0, camY = 0, camZoom = 1; // TODO: place back inside closure after debugging
{
    const mapCanvas = document.getElementById("map");
    const mapContext = mapCanvas.getContext("2d");

    const urlParams = new URLSearchParams(window.location.search);
    const mapName = urlParams.get("m") ?? 'vanilla';

    const MIN_ZOOM = 0.26;
    const MAX_ZOOM = 2.6;

    let map = {};
    let prevTimestamp = performance.now();
    let keysDown = new Set();
    let selected = null;
    let focused = false;

    function loadMapData(){
        let mapURL = "/data/map/" + mapName.replace(/-/g,"/") + ".json";

        fetch(mapURL)
            .then(response => {
                if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
                return response.json();
            })
            .then(_map => {
                map = _map;
                prevTimestamp = performance.now();
                requestAnimationFrame(draw);
            })
            .catch(error => {
                alert("Error loading map: \n" + error +
                    "\nPress OK to return to home page.");
                window.location.href = "/";
            })
    }
    loadMapData();

    function getMapModeCoords(x, y, r) {
        let scaleFactor = camZoom * mapCanvas.width / 1280;
        // r *= 1.5;
        x += camX; y += camY;
        x -= r / 2; y -= r / 2;
        x *= scaleFactor; y *= scaleFactor; r *= scaleFactor;
        x += mapCanvas.width / 2; y += mapCanvas.height / 2;
        return [x, y, r, r];
    }
    function getMapEdgeCoords(x, y, r) {
        let scaleFactor = camZoom * mapCanvas.width / 1280;
        x += camX; y += camY;
        x *= scaleFactor; y *= scaleFactor; r *= scaleFactor;
        x += mapCanvas.width / 2; y += mapCanvas.height / 2;
        return [x, y, r, r];
    }

    // #region Mode draw functions
    function drawDiamond(x, y, size) {
        let [x2, y2, r] = getMapModeCoords(x, y, size * 1.125);
        x2 += r/2; y2 += r/2;
        mapContext.save();
            mapContext.translate(x2, y2);
            mapContext.beginPath();
            mapContext.moveTo(r, 0);
            mapContext.lineTo(0, r);
            mapContext.lineTo(-r, 0);
            mapContext.lineTo(0, -r);
            mapContext.closePath();
            mapContext.fill();
            mapContext.stroke();
        mapContext.restore();
    }
    function drawOctagon(x, y, size) {
        let [x2, y2, r] = getMapModeCoords(x, y, size * 1.125);
        const cos45 = Math.sqrt(2) / 2;
        x2 += r/2; y2 += r/2;
        mapContext.save();
            mapContext.translate(x2, y2);
            mapContext.beginPath();
            mapContext.moveTo(r, 0);
            mapContext.lineTo(r * cos45, r * cos45);
            mapContext.lineTo(0, r);
            mapContext.lineTo(-r * cos45, r * cos45);
            mapContext.lineTo(-r, 0);
            mapContext.lineTo(-r * cos45, -r * cos45);
            mapContext.lineTo(0, -r);
            mapContext.lineTo(r * cos45, -r * cos45);
            mapContext.closePath();
            mapContext.fill();
            mapContext.stroke();
        mapContext.restore();
    }
    // #endregion
    
    // background color of modes based on rank, from 0 to 5
    const modeBackgroundColor = {
        0: "#0000004F", // no rank
        1: "#3366994F", // B rank
        2: "#99D9A64F", // A rank
        3: "#D9CC4D4F", // S rank
        4: "#D980664F", // U rank
        5: "#D94DCC4F", // X rank
    }
    function drawModeShape(x, y, size, shape, rank) {
        if(!rank || rank <= 5) { // static color
            mapContext.fillStyle = modeBackgroundColor[rank ?? 0];
        } // TODO: "former world record" and "world record" ranks
        mapContext.strokeStyle = "#CCCCCCFF"
        mapContext.lineWidth = 4 * camZoom;
        switch(shape) {
            case 1:
                mapContext.fillRect(...getMapModeCoords(x, y, size * 2));
                mapContext.strokeRect(...getMapModeCoords(x, y, size * 2));
                break;
            case 2:
                drawDiamond(x, y, size);
                break;
            case 3:
                drawOctagon(x, y, size);
                break;
            default:
                mapContext.beginPath();
                mapContext.arc(...getMapModeCoords(x, y, size), 0, 2 * Math.PI);
                mapContext.fill();
                mapContext.stroke();
        }
    }
    function draw(timestamp){
        const dt = timestamp - prevTimestamp;
        prevTimestamp = timestamp;

        // #region Graphics
        // Pre-draw
        mapContext.clearRect(0, 0, mapCanvas.offsetWidth, mapCanvas.offsetHeight);

        if(mapCanvas.width !== mapCanvas.offsetWidth || mapCanvas.height !== mapCanvas.offsetHeight) {
            mapCanvas.width = mapCanvas.offsetWidth - 2;
            mapCanvas.height = mapCanvas.width * 0.5625;
        }

        // Draw modes
        for(mode of Object.values(map.modes)){
            // TODO: replace with drawing modeicon
            drawModeShape(mode.x, mode.y, mode.size, mode.shape);

            // Draw connected mode lines
            mapContext.strokeStyle = "#FFFFFF5F";
            mode.unlock?.forEach(otherModeName => {
                const otherMode = map.modes[otherModeName];
                mapContext.beginPath();
                mapContext.moveTo(...getMapEdgeCoords(mode.x, mode.y, mode.size));
                mapContext.lineTo(...getMapEdgeCoords(otherMode.x, otherMode.y, otherMode.size));
                mapContext.stroke();
            });
        }

        // Draw selected mode details
        // TODO

        // Draw "click here to focus" layer
        if(!focused){
            mapContext.fillStyle = "#0000008F";
            mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
            mapContext.fillStyle = "#FFFFFFFF";
            mapContext.font = `bold ${Math.min(mapCanvas.width, mapCanvas.height) * 0.05}px techmino-proportional`;
            mapContext.textAlign = "center";
            mapContext.fillText("Unfocused - Click here to focus", mapCanvas.width / 2, mapCanvas.height / 2);
        }
        // #endregion

        // #region Handle inputs
        if(focused){
            const speed = -1;
            let dx = 0, dy = 0;

            if (keysDown.has("a") || keysDown.has("A")) dx -= speed;
            if (keysDown.has("d") || keysDown.has("D")) dx += speed;
            if (keysDown.has("w") || keysDown.has("W")) dy -= speed;
            if (keysDown.has("s") || keysDown.has("S")) dy += speed;

            if (dx !== 0 || dy !== 0) {
                moveMap(dx * dt, dy * dt);
            }
        }
        // #endregion
        requestAnimationFrame(draw);
    }

    function moveMap(dx, dy){
        // switched up min and max and negated them because of the way the map is drawn
        camX = Math.min(Math.max(camX + (dx / camZoom), -map.max_x), -map.min_x);
        camY = Math.min(Math.max(camY + (dy / camZoom), -map.max_y), -map.min_y);
    }

    function clampZoom(){
        camZoom = Math.min(Math.max(camZoom, MIN_ZOOM), MAX_ZOOM);
    }
    function zoomMap(dZoom){
        camZoom += dZoom;
        clampZoom();
    }
    function zoomMapScroll(scrollAmount) {
        camZoom += scrollAmount * camZoom; // multiplicative zoom for scrolling
        clampZoom();
    }

    { // Mouse events
        mapCanvas.addEventListener('mousedown', function(event) {
            if (focused) {
                let startX = event.clientX;
                let startY = event.clientY;
    
                function handleMouseMove(event) {
                    const dx = event.clientX - startX;
                    const dy = event.clientY - startY;
                    startX = event.clientX;
                    startY = event.clientY;
                    moveMap(dx, dy);
                }
    
                function handleMouseUp() {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                }
    
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            } else {
                focused = true;
            }
        });
    
        mapCanvas.addEventListener('wheel', function(event) {
            if (focused) {
                event.preventDefault(); // disable scrolling
                const dZoom = event.deltaY * -0.001;
                zoomMapScroll(dZoom);
            }
        });
    }
    { // Keyboard events
        window.addEventListener('keydown', (event) => {
            if(event.key === "Escape") {
                focused = false;
            } else if(focused) {
                keysDown.add(event.key);
                console.log(event.key); // DEBUG
            }
        });
          
        window.addEventListener('keyup', (event) => {
            keysDown.delete(event.key);
        });
    }
}