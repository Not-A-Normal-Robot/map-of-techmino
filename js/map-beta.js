{
    const root = document.documentElement;
    const body = document.body;
    const edgeDisplayCanvas = document.getElementById("edge-display");
    const edgeDisplayContext = edgeDisplayCanvas.getContext("2d");

    let camX = 0; let camY = 0; let camZoom = 1;

    let map = {};

    function init() {
        if(window.self === window.top) {
            // for easier viewing if directly accessing the page
            document.getElementsByTagName("body")[0].style.backgroundColor = "black";
        }
        loadMapData();
        onResize();
    }
    init();

    function loadMapData(){
        const urlParams = new URLSearchParams(window.location.search);
        const mapName = urlParams.get("m") ?? 'vanilla';

        let mapURL = "/data/map/" + mapName.replace(/-/g,"/") + ".json";

        fetch(mapURL)
            .then(response => {
                if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
                return response.json();
            })
            .then(_map => {
                map = _map;
                prevTimestamp = performance.now();
            })
            .catch(error => {
                alert("Error loading map: \n" + error +
                    "\nPress OK to return to home page.");
                window.location.href = "/";
            });
    }

    function onResize() {
        const viewportWidth = root.clientWidth || 0;
        const viewportHeight = root.clientHeight || 0;
        const viewportDimension = Math.sqrt(viewportWidth * viewportHeight);
        
        const targetDimension = Math.sqrt(1280 * 720);
        const scaleFactor = Math.sqrt(viewportDimension / targetDimension);
        body.style.setProperty("--scale-factor", scaleFactor);
    }

    function onMapZoom() {

    }

    window.addEventListener("resize", onResize);
}