const mapCanvas = document.getElementById("map");
const mapContext = mapCanvas.getContext("2d");

const urlParams = new URLSearchParams(window.location.search);
const mapName = urlParams.get("m");

let map = null;
let hashmap = {};
let camX = 0;
let camY = 0;
let camZoom = 1;
let prevTimestamp = performance.now();
let selected = null;

function loadMapData(){
    let mapURL = "/data/" + mapName.replace(/-/g,"/") + ".json";

    fetch(mapURL)
        .then(response => {
            if (!response.ok) throw new Error("${response.status} - ${response.statusText}");
            return response.json();
        })
        .then(graphData => {
            map = graphData;
            for (let i = 0; i < map.length; i++) {
                hashmap[map[i].name]=map[i]
            }
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

    mapContext.scale()
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