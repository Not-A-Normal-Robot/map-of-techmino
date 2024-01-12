const mapCanvas = document.getElementById("map");
const mapContext = mapCanvas.getContext("2d");

const urlParams = new URLSearchParams(window.location.search);
const mapName = urlParams.get("m") ?? 'vanilla';

let map = {};
let camX = 0;
let camY = 0;
let camZoom = 1;
let prevTimestamp = performance.now();
let selected = null;

function loadMapData(){
    let mapURL = "/data/map/" + mapName.replace(/-/g,"/") + ".json";

    fetch(mapURL)
        .then(response => {
            if (!response.ok) throw new Error("${response.status} - ${response.statusText}");
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
loadMapData(); // Error loading map: TypeError: map is undefined  Press OK to return to home page.

function drawMap(timestamp){
    let dt = timestamp - prevTimestamp;
    prevTimestamp = timestamp;

    mapCanvas.width = mapCanvas.offsetWidth;
    mapCanvas.height = mapCanvas.offsetHeight;

    mapContext.translate(camX, camY);
    mapContext.scale(camZoom, camZoom);
    for (let i = 0; i < map.length; i++) {
        const node = map[i];
        
        // node.name;
        // node.x;
        // node.y;
        // node.size;
        // node.icon;
        // node.unlock;
        // node.shape;
    }

    requestAnimationFrame(drawMap);
}