const mapCanvas = document.getElementById("map");
const mapContext = mapCanvas.getContext("2d");

const urlParams = new URLSearchParams(window.location.search);
const mapName = urlParams.get("m") ?? 'vanilla';


let map = {};
let camX = 0;
let camY = 0;
let camZoom = 0.999;
let area = mapCanvas.width * mapCanvas.height;
let prevTimestamp = performance.now();
let selected = null;

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
            requestAnimationFrame(drawMap);
        })
        .catch(error => {
            alert("Error loading map: \n" + error +
                "\nPress OK to return to home page.");
            window.location.href = "/";
        })
}
loadMapData();

function getMapCoords(x, y, r) {
    let scaleFactor = camZoom * (1280 * 720) / area;
    x += camX; y += camY;
    x *= scaleFactor; y *= scaleFactor; r *= scaleFactor;
    x += mapCanvas.width / 2; y += mapCanvas.height / 2;
    return [x, y, r, r];
}

function drawMap(timestamp){
    let dt = timestamp - prevTimestamp;
    prevTimestamp = timestamp;

    
    mapContext.clearRect(0, 0, mapCanvas.offsetWidth, mapCanvas.offsetHeight);

    if(mapCanvas.width !== mapCanvas.offsetWidth || mapCanvas.height !== mapCanvas.offsetHeight) {
        mapCanvas.width = mapCanvas.offsetWidth - 2;
        mapCanvas.height = mapCanvas.width * 0.5625;
        area = mapCanvas.width * mapCanvas.height;
    }

    mapContext.fillStyle = "#FFFFFFFF";
    for(mode of Object.values(map.modes)){
        mapContext.fillRect(...getMapCoords(mode.x, mode.y, mode.size));
    }

    requestAnimationFrame(drawMap);
}

function moveMap(dx, dy){
    camX += dx;
    camY += dy;

    // clamp camX and camY in bounds
    camX = Math.min(Math.max(camX, map.min_x - mapCanvas.width / 2), map.max_x + mapCanvas.width / 2);
    camY = Math.min(Math.max(camY, map.min_y - mapCanvas.height / 2), map.max_y + mapCanvas.height / 2);
}
