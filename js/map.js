import {getModeIconDrawFunction, getModeIconDrawFunctionMap} from "/js/modeicon.js";
import {getLanguageEntry} from "/js/lang.js";

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
        for(let mode of Object.values(map.modes)){
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
    const cos45 = Math.sqrt(2) / 2;
    function drawOctagon(x, y, size) {
        let [x2, y2, r] = getMapModeCoords(x, y, size * 1.125);
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
    function getModeBackgroundColor(rank) {
        if(!rank || rank <= 5) return modeBackgroundColor[rank ?? 0]; // static color
        else if(rank < 14) { // x rank + top 10
            let t = Math.sin(performance.now() / 300) / 2 + 0.5;
            const color1 = {r: 255, g: 0, b: 0}
            const color2 = {r: 230, g: 0, b: 212}
            return `rgba(${color1.r * (1-t) + color2.r * t}, ${color1.g * (1-t) + color2.g * t}, ${color1.b * (1-t) + color2.b * t}, 0.36)`;
        } else { // x rank + world record
            let t = performance.now() / 12 % 360;
            mapContext.fillStyle = `hsla(${t}, 100%, 50%, 0.36)`;
        }
    }
    const modeRankTextColor = {
        0: "#0000", // no rank
        1: "#CCDBE6", // B rank
        2: "#99E6B3", // A rank
        3: "#EDEDA6", // S rank
        4: "#FF8066", // U rank
        5: "#F280F2", // X rank
    }
    function getModeRankTextColor(rank) {
        if(!rank || rank <= 5) return modeRankTextColor[rank ?? 0]; // static color
        else if(rank < 14) { // x rank + top 10
            let t = Math.sin(performance.now() / 300) / 2 + 0.5;
            const color1 = {r: 255, g: 40, b: 50}
            const color2 = {r: 220, g: 70, b: 220}
            let r = color1.r * (1-t) + color2.r * t;
            let g = color1.g * (1-t) + color2.g * t;
            let b = color1.b * (1-t) + color2.b * t;
            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        } else { // x rank + world record
            let t = performance.now() / 12 % 360;
            return `hsla(${t}, 100%, 75%, 0.8)`;
        }
    }

    function isModeOnScreen(x, y, size) {
        let [x2, y2, r] = getMapModeCoords(x, y, size * 1.125);
        r *= 2;
        if(x2 + r < 0 || x2 - r > mapCanvas.width) return false;
        if(y2 + r < 0 || y2 - r > mapCanvas.height) return false;
        return true;
    }

    // const RANK_OVERRIDE = 14; // DEBUG
    function drawModeShape(x, y, size, shape, rank) {
        // rank ??= RANK_OVERRIDE; // DEBUG
        mapContext.fillStyle = getModeBackgroundColor(rank);

        // Draw mode shape
        mapContext.lineWidth = 8 * camZoom / (window.devicePixelRatio || 1);
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
    function drawModeRankText(x, y, size, rank) {
        // rank ??= RANK_OVERRIDE; // DEBUG
        if(!rank || rank <= 0) return;

        let [screenspace_x, screenspace_y, screenspace_size] = getMapModeCoords(x, y, size);
        
        let rankText;
        switch(rank) {
            case 1: rankText = "\u{F00B7}"; break; // B
            case 2: rankText = "\u{F00B6}"; break; // A
            case 3: rankText = "\u{F00C2}"; break; // S
            case 4: rankText = "\u{F00B5}"; break; // U
            case 5: rankText = "\u{F00B4}"; break; // X
            default:
                if(rank < 14) rankText = (15 - rank).toString();
                else rankText = "WR";
                break;
        }
        
        {
            screenspace_x += screenspace_size * 2;
            screenspace_y += screenspace_size * 0.5;

            mapContext.font = `bold ${screenspace_size * 2}px techmino-proportional`;
            mapContext.textAlign = "right";
            mapContext.fillStyle = "#292929CC";
            mapContext.fillText(rankText, screenspace_x, screenspace_y);

            screenspace_x += screenspace_size * 0.1;
            screenspace_y -= screenspace_size * 0.1;

            mapContext.fillStyle = getModeRankTextColor(rank);
            mapContext.fillText(rankText, screenspace_x, screenspace_y);
        }
    }
    // #endregion

    // modified from https://stackoverflow.com/a/16599668
    function getWrappedText(ctx, text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
    
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    function drawSelectedPane() {
        if(!selected && !selectedLonger) return;

        const t = modeSelectAnimation / MODE_SELECT_ANIMATION_LENGTH;

        if(t <= 0) return;
        
        const smoothT = t * t * (3 - 2 * t); // smoothstep(t)
        const panelWidth = mapCanvas.width * 0.3;
        const panelX = mapCanvas.width - panelWidth * smoothT;
        const title = getLanguageEntry(`modes.${selectedLonger.name}.title`, `[${selectedLonger.name}]`);
        const subtitle = getLanguageEntry(`modes.${selectedLonger.name}.subtitle`, "");
        let description = getLanguageEntry(`modes.${selectedLonger.name}.description`, "");
        let version_info = getLanguageEntry(`modes.${selectedLonger.name}.version_info`, "");
        if(version_info.length > 0) version_info = `(${version_info})`;

        mapContext.save();
            mapContext.fillStyle = "#9E9E9ECC";
            mapContext.translate(panelX, 0);
            mapContext.fillRect(0, 0, panelWidth, mapCanvas.height);
            mapContext.font = `bold ${mapCanvas.height * 0.062}px techmino-proportional`;
            mapContext.textAlign = "center";
            mapContext.fillStyle = "white";
            mapContext.fillText(title, panelWidth * 0.5, mapCanvas.height * 0.09);
            mapContext.font = `bold ${mapCanvas.height * 0.042}px techmino-proportional`;
            mapContext.fillText(subtitle, panelWidth * 0.5, mapCanvas.height * 0.145);
            mapContext.font = `bold ${mapCanvas.height * 0.03}px techmino-proportional`;
            mapContext.fillText(version_info, panelWidth * 0.5, mapCanvas.height * 0.2);
            mapContext.font = `normal ${mapCanvas.height * 0.035}px techmino-proportional`;
            description = getWrappedText(mapContext, description, panelWidth * 0.9);
            for(let i = 0; i < description.length; i++){
                mapContext.fillText(description[i], panelWidth * 0.5, mapCanvas.height * (0.24 + i * 0.036));
            }
        mapContext.restore();
    }

    function update(timestamp){
        const dt = timestamp - prevTimestamp;
        prevTimestamp = timestamp;

        // #region Graphics
        // Pre-draw
        mapContext.clearRect(0, 0, mapCanvas.offsetWidth, mapCanvas.offsetHeight);
        mapContext.textRendering = "optimizeSpeed";

        if(mapCanvas.width !== mapCanvas.offsetWidth || mapCanvas.height !== mapCanvas.offsetHeight) {
            mapCanvas.width = mapCanvas.offsetWidth - 2;
            mapCanvas.height = mapCanvas.width * 0.5625;
        }

        // Draw modes
        {
            let modes = Object.values(map.modes);

            // Draw connected mode lines
            mapContext.lineWidth = 8 * camZoom / (window.devicePixelRatio || 1);
            mapContext.strokeStyle = "#FFFFFF5F";
            modes.forEach(mode => {
                mode.unlock?.forEach(otherModeName => {
                    const otherMode = map.modes[otherModeName];
                    mapContext.beginPath();
                    mapContext.moveTo(...getMapModeCenterCoords(mode.x, mode.y, mode.size));
                    mapContext.lineTo(...getMapModeCenterCoords(otherMode.x, otherMode.y, otherMode.size));
                    mapContext.stroke();
                });
            })

            let visibleModes = modes.filter(mode => isModeOnScreen(mode.x, mode.y, mode.size));

            // Draw mode shapes
            visibleModes.forEach(mode => {
                mapContext.strokeStyle = mode === selected ? "#CFCF03" : "#CCCCCC";
                drawModeShape(mode.x, mode.y, mode.size, mode.shape);
            });

            // Draw mode icons
            mapContext.strokeStyle = "#DBCFCE";
            mapContext.fillStyle = "#DBCFCE";
            visibleModes.forEach(mode => {
                let [screenspace_x, screenspace_y, screenspace_size] = getMapModeCoords(mode.x, mode.y, mode.size);
                getModeIconDrawFunction(mode.icon)(mapContext, screenspace_x, screenspace_y, screenspace_size);
            });

            // Draw mode rank text
            visibleModes.forEach(mode => {
                drawModeRankText(mode.x, mode.y, mode.size, mode.rank);
            });
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

        if(selected) {
            modeSelectAnimation = Math.min(modeSelectAnimation + dt, MODE_SELECT_ANIMATION_LENGTH);
        } else {
            modeSelectAnimation = Math.max(modeSelectAnimation - dt, 0);
        }
        drawSelectedPane();

        // Draw "click here to focus" layer
        if(!focused){
            mapContext.fillStyle = "#0000008F";
            mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
            mapContext.fillStyle = "#FFFFFFFF";
            mapContext.font = `bold ${mapCanvas.height * 0.05}px techmino-proportional`;
            mapContext.textAlign = "center";
            mapContext.fillText(getLanguageEntry("map.unfocused"), mapCanvas.width * 0.5, mapCanvas.height * 0.5);
        }
        // #endregion

        // #region Handle inputs
        if(focused){
            const speed = -0.35;
            let dx = 0, dy = 0;

            if (keysDown.has("a") || keysDown.has("A") || keysDown.has("ArrowLeft")) dx -= speed;
            if (keysDown.has("d") || keysDown.has("D") || keysDown.has("ArrowRight")) dx += speed;
            if (keysDown.has("w") || keysDown.has("W") || keysDown.has("ArrowUp")) dy -= speed;
            if (keysDown.has("s") || keysDown.has("S") || keysDown.has("ArrowDown")) dy += speed;

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
        if(typeof camX !== "number" || isNaN(camX)) camX = 0;
        if(typeof camY !== "number" || isNaN(camY)) camY = 0;

        // switched up min and max and negated them because of the way the map is drawn
        const minX = map.min_x - margin;
        const maxX = map.max_x + margin;
        const minY = map.min_y - margin;
        const maxY = map.max_y + margin;
        camX = Math.min(Math.max(camX + (dx / camZoom), -maxX), -minX);
        camY = Math.min(Math.max(camY + (dy / camZoom), -maxY), -minY);
    }
    function dragMap(dx, dy) {
        const pixelRatio = (window.devicePixelRatio || 1);
        moveMap(dx * pixelRatio, dy * pixelRatio);
    }

    function clampZoom(){
        if(typeof camZoom !== "number" || isNaN(camZoom)) camZoom = 1;
        camZoom = Math.min(Math.max(camZoom, MIN_ZOOM), MAX_ZOOM);
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
                    dragMap(dx, dy);
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
            if(event.key.startsWith("Arrow")) event.preventDefault();
        });
          
        window.addEventListener('keyup', (event) => {
            keysDown.delete(event.key);
        });
    }
    { // Touch events
        let touchPrevX = 0, touchPrevY = 0;
        let touchStartDist = 1, touchStartZoom = 1;

        mapCanvas.addEventListener('touchstart', function(event) {
            if(!focused) focused = true;
            if(event.touches.length === 1) {
                touchPrevX = event.touches[0].clientX;
                touchPrevY = event.touches[0].clientY;
            } else if(event.touches.length === 2) {
                touchStartDist = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
            }
            touchStartZoom = camZoom;
        });
        mapCanvas.addEventListener('touchmove', function(event) {
            if(!focused) return;
            if(event.touches.length === 1) {
                const dx = event.touches[0].clientX - touchPrevX;
                const dy = event.touches[0].clientY - touchPrevY;
                touchPrevX = event.touches[0].clientX;
                touchPrevY = event.touches[0].clientY;
                dragMap(dx, dy);
            } else if(event.touches.length === 2) {
                const dist = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
                const zoomMultipler = dist / touchStartDist;
                camZoom = touchStartZoom * zoomMultipler;
                clampZoom();
            }
            event.preventDefault();
        });
        mapCanvas.addEventListener('touchend', function(event) {
            if(event.touches.length === 0) {
                touchPrevX = 0;
                touchPrevY = 0;
            } else if(event.touches.length === 1) {
                touchPrevX = event.touches[0].clientX;
                touchPrevY = event.touches[0].clientY;
            }
        });
    }
    // #endregion
}