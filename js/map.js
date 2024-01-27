{
    const mapCanvas = document.getElementById("map");
    const mapContext = mapCanvas.getContext("2d");

    const urlParams = new URLSearchParams(window.location.search);
    const mapName = urlParams.get("m") ?? 'vanilla';

    let camX = 0, camY = 0, camZoom = 1;
    const MIN_ZOOM = 0.26;
    const MAX_ZOOM = 2.6;

    let map = {};
    let prevTimestamp = performance.now();
    let keysDown = new Set();
    let selected = null;
    let selectedLonger = null; // stores the last selected mode, even if it's not selected anymore
    let modeSelectAnimation = 0;
    const MODE_SELECT_ANIMATION_LENGTH = 300;
    let focused = false;
    let showCrosshair = false;

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
                requestAnimationFrame(update);
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
    function getMapModeCenterCoords(x, y, r) {
        let scaleFactor = camZoom * mapCanvas.width / 1280;
        x += camX; y += camY;
        x *= scaleFactor; y *= scaleFactor; r *= scaleFactor;
        x += mapCanvas.width / 2; y += mapCanvas.height / 2;
        return [x, y, r, r];
    }
    function isPointInMode(x, y, mode) {
        let [modeX, modeY, modeSize] = getMapModeCenterCoords(mode.x, mode.y, mode.size);
        
        // early returns for optimization
        const dx = Math.abs(x - modeX);
        const dy = Math.abs(y - modeY);
        const threshold = modeSize * 1.1;
        if(dx > threshold) return false;
        if(dy > threshold) return false;

        switch(mode.shape) {
            case 1: // square
                return dx <= modeSize && dy <= modeSize;
            case 2: // diamond
                modeSize *= 1.062;
                return dx + dy <= modeSize;
            default: // circle
                modeSize *= 1.062;
                return dx * dx + dy * dy <= modeSize * modeSize;
        }
    }
    function getModeAtPoint(x, y) {
        for(mode of Object.values(map.modes)){
            if(isPointInMode(x, y, mode)) return mode;
        }
        return null;
    }
    function selectModeAtPoint(x, y, clearSelectedIfNone = true) {
        const mode = getModeAtPoint(x, y);
        if(clearSelectedIfNone){
            selected = mode;
        } else {
            selected = mode ?? selected;
        }
        if(selected) selectedLonger = selected;
        return selected;
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
    
    // background color of modes based on rank, from 0 to 5
    const modeBackgroundColor = {
        0: "#0000004F", // no rank
        1: "#3366994F", // B rank
        2: "#99D9A64F", // A rank
        3: "#D9CC4D4F", // S rank
        4: "#D980664F", // U rank
        5: "#D94DCC4F", // X rank
    }

    function isModeOnScreen(x, y, size) {
        let [x2, y2, r] = getMapModeCoords(x, y, size * 1.125);
        r *= 2;
        if(x2 + r < 0 || x2 - r > mapCanvas.width) return false;
        if(y2 + r < 0 || y2 - r > mapCanvas.height) return false;
        return true;
    }

    function drawModeShape(x, y, size, shape, rank) {
        if(!rank || rank <= 5) { // static color
            mapContext.fillStyle = modeBackgroundColor[rank ?? 0];
        } else if(rank === 6) { // x rank + top 10
            let t = Math.sin(performance.now() / 300) / 2 + 0.5;
            const color1 = {r: 255, g: 0, b: 0}
            const color2 = {r: 230, g: 0, b: 212}
            mapContext.fillStyle = `rgba(${color1.r * (1-t) + color2.r * t}, ${color1.g * (1-t) + color2.g * t}, ${color1.b * (1-t) + color2.b * t}, 0.36)`;
        } else { // x rank + world record
            let t = performance.now() / 12 % 360;
            mapContext.fillStyle = `hsla(${t}, 100%, 50%, 0.36)`;
        }
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
    // #endregion
    
    // #region Modeicon draw functions
    // TODO: modeicon draw functions
    // #endregion

    function update(timestamp){
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
            // Draw connected mode lines
            mapContext.strokeStyle = "#FFFFFF5F";
            mode.unlock?.forEach(otherModeName => {
                const otherMode = map.modes[otherModeName];
                mapContext.beginPath();
                mapContext.moveTo(...getMapModeCenterCoords(mode.x, mode.y, mode.size));
                mapContext.lineTo(...getMapModeCenterCoords(otherMode.x, otherMode.y, otherMode.size));
                mapContext.stroke();
            });

            if(isModeOnScreen(mode.x, mode.y, mode.size)){
                mapContext.strokeStyle = mode === selected ? "#CFCF03FF" : "#CCCCCCFF";
                drawModeShape(mode.x, mode.y, mode.size, mode.shape);

                // Draw mode icon
                if(mode.icon) {
                    let [x, y, size] = getMapModeCoords(mode.x, mode.y, mode.size);
                    mapContext.strokeStyle = "#DBCFCEFF";
                    mapContext.fillStyle = "#DBCFCEFF";

                    getModeIconDrawFunction(mode.icon)(mapContext, x, y, size);
                }
            }
        }

        // Draw crosshair
        if(showCrosshair){
            mapContext.strokeStyle = "#FFFFFFDF";
            mapContext.lineWidth = 5;
            const crosshairLength = mapCanvas.height * 0.04;
            
            mapContext.save();
                mapContext.translate(mapCanvas.width / 2, mapCanvas.height / 2);
                mapContext.beginPath();
                mapContext.moveTo(-crosshairLength, 0);
                mapContext.lineTo(crosshairLength, 0);
                mapContext.moveTo(0, -crosshairLength);
                mapContext.lineTo(0, crosshairLength);
                mapContext.stroke();
            mapContext.restore();
        }

        // TODO: Draw selected mode details
        if(selected) {
            modeSelectAnimation = Math.min(modeSelectAnimation + dt, MODE_SELECT_ANIMATION_LENGTH);
        } else {
            modeSelectAnimation = Math.max(modeSelectAnimation - dt, 0);
        }
        if(selected || selectedLonger) {
            const t = modeSelectAnimation / MODE_SELECT_ANIMATION_LENGTH;
            const smoothT = t * t * (3 - 2 * t); // smoothstep(t)
            const panelWidth = mapCanvas.width * 0.3;
            const panelX = mapCanvas.width - panelWidth * smoothT;

            mapContext.fillStyle = "#FFFFFF8F";
            mapContext.fillRect(panelX, 0, panelWidth, mapCanvas.height);
        }

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
                showCrosshair = true;
                moveMap(dx * dt, dy * dt);
                selectModeAtPoint(mapCanvas.width / 2, mapCanvas.height / 2, false);
            }
        }
        // #endregion
        
        requestAnimationFrame(update);
    }

    // #region Controls
    const margin = 50;
    function moveMap(dx, dy){
        // switched up min and max and negated them because of the way the map is drawn
        const minX = map.min_x - margin;
        const maxX = map.max_x + margin;
        const minY = map.min_y - margin;
        const maxY = map.max_y + margin;
        camX = Math.min(Math.max(camX + (dx / camZoom), -maxX), -minX);
        camY = Math.min(Math.max(camY + (dy / camZoom), -maxY), -minY);
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
    // #endregion

    // #region Event listeners
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
                showCrosshair = false;
            } else {
                focused = true;
            }
        });
        mapCanvas.addEventListener('click', function(event) {
            if (focused) {
                let rect = mapCanvas.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                selectModeAtPoint(x, y);
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
                if(selected) {
                    selected = null;
                } else {
                    focused = false;
                    keysDown.clear();
                }
                return;
            }
            if(!focused) return;

            switch(event.key) {
                case "Enter":
                    selectModeAtPoint(mapCanvas.width / 2, mapCanvas.height / 2);
                    break;
                default:
                    keysDown.add(event.key);
                    break;
            }
        });
          
        window.addEventListener('keyup', (event) => {
            keysDown.delete(event.key);
        });
    }
    // #endregion
}