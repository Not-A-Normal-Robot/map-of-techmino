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

    function draw(_){
        // Pre-draw
        mapContext.clearRect(0, 0, mapCanvas.offsetWidth, mapCanvas.offsetHeight);

        if(mapCanvas.width !== mapCanvas.offsetWidth || mapCanvas.height !== mapCanvas.offsetHeight) {
            mapCanvas.width = mapCanvas.offsetWidth - 2;
            mapCanvas.height = mapCanvas.width * 0.5625;
        }

        // Draw modes
        for(mode of Object.values(map.modes)){
            // TODO: replace with drawing modeicon
            mapContext.fillStyle = "#FFFFFFFF";
            mapContext.fillRect(...getMapModeCoords(mode.x, mode.y, mode.size));

            // Draw connected mode lines
            mapContext.strokeStyle = "#FFFFFFAF";
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
                const dZoom = event.deltaY * -0.001;
                zoomMapScroll(dZoom);
            }
        });
    }
}