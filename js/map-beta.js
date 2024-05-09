"use strict";
import * as LANG from "./lang.js";
{
    const INIT_TIME = performance.now();
    const DEBUG_MODE = true;
    const IS_IN_IFRAME = window.self === window.top;

    const ROOT = document.documentElement;
    const BODY = document.body;
    const DEBUG_ELEMENT = document.getElementById("debug-info");
    const MAIN_ELEMENT = document.getElementById("main");
    const EDGES_SVG = document.getElementById("edge-display");

    const MODE_ID_PREFIX = "mode_";
    const MOVE_SPEED_MULT = 0.26;
    const ZOOM_SPEED_MULT = 0.00262;
    const MIN_ZOOM = 0.126;
    const MAX_ZOOM = 1.26;
    const MAP_MARGIN = 62;

    let camX = 0; let camY = 0; let camZoom = 1;

    let map = {};
    let heldKeyCodes = new Set();
    let selected = null;

    let isUpdateRunning = false;
    let prevTime = performance.now();

    function init() {
        if(IS_IN_IFRAME) {
            // for easier viewing if directly accessing the page
            ROOT.style.backgroundColor = "black";
        }
        loadMapData();
        onResize();
        document.getElementById("init-error-message")?.remove();
    }
    init();

    function handleKeys(dt) {
        if(heldKeyCodes.has("ControlLeft") || heldKeyCodes.has("ControlRight")) {
            // Zoom in/out
            const zoomExp =
                heldKeyCodes.has("ArrowUp")
              + heldKeyCodes.has("ArrowRight")
              - heldKeyCodes.has("ArrowLeft")
              - heldKeyCodes.has("ArrowDown")
              + heldKeyCodes.has("KeyW")
              - heldKeyCodes.has("KeyA")
              - heldKeyCodes.has("KeyS")
              + heldKeyCodes.has("KeyD")
            
            const zoomMultiplier =
                Math.exp(zoomExp * dt * ZOOM_SPEED_MULT);

            const oldZoom = camZoom;
            camZoom *= zoomMultiplier;

            camZoom = clamp(MIN_ZOOM, camZoom, MAX_ZOOM);
            onMapZoom(oldZoom, camZoom);
        } else {
            // Move
            let dx =
                heldKeyCodes.has("ArrowLeft")
              - heldKeyCodes.has("ArrowRight")
              + heldKeyCodes.has("KeyA")
              - heldKeyCodes.has("KeyD");
            
            let dy =
                heldKeyCodes.has("ArrowUp")
              - heldKeyCodes.has("ArrowDown")
              + heldKeyCodes.has("KeyW")
              - heldKeyCodes.has("KeyS");

            dx *= dt * MOVE_SPEED_MULT / camZoom;
            dy *= dt * MOVE_SPEED_MULT / camZoom;

            moveMap(dx, dy);
        }
    }

    function update(forceRun = false) {
        if(isUpdateRunning && !forceRun) return;
        isUpdateRunning = true;
        let continueUpdate = heldKeyCodes.size > 0;

        const dt = performance.now() - prevTime;
        prevTime = performance.now();

        handleKeys(dt);

        if(DEBUG_MODE) {
            updateDebugInfo(dt);
        }

        if(continueUpdate) {
            return requestAnimationFrame(() => update(true));
        }
        isUpdateRunning = false;
    }

    function updateDebugInfo(dt) {
        const debugText =
            `Time: ${(performance.now() - INIT_TIME).toFixed(1)}ms\n` +
            `dt: ${dt.toFixed(1)}\n` +
            `Camera: ${camX.toFixed(2)}, ${camY.toFixed(2)} @ ${camZoom.toFixed(5)}x\n` +
            (
                heldKeyCodes.size > 0 ?
                    `Keys: {${Array.from(heldKeyCodes).join()}}\n` :
                    `No keys held (update stopped)\n`
            );
        
        DEBUG_ELEMENT.innerText = debugText;
        // console.log(debugText);
    }

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
            })
            .catch(error => {
                alert(`Error loading map: \n${error}\n\nPress OK to return to home page.`);
                window.location.href = "/";
            })
            .then(onMapLoad)
            .catch(error => {
                alert(`Error after loading map: \n${error}\n\nYou may experience issues if you continue.`);
            });
    }
    
    function onMapLoad() {
        BODY.style.setProperty("--min-x", map.min_x);
        BODY.style.setProperty("--max-x", map.max_x);
        BODY.style.setProperty("--min-y", map.min_y);
        BODY.style.setProperty("--max-y", map.max_y);
        addMapToHtml();
        generateEdgeSVG();
    }

    function addMapToHtml() {
        for(const mode of Object.values(map.modes)) {
            let modeElement = document.createElement("button");

            modeElement.classList.add("mode");
            modeElement.setAttribute("type", "button");
            modeElement.id = MODE_ID_PREFIX + mode.name;
            
            let shape;
            switch(mode.shape) {
                case 1:
                    shape = "square";
                    break;
                case 2:
                    shape = "diamond";
                    break;
                case 3:
                    shape = "octagon";
                    break;
                default:
                    shape = "circle";
                    break;
            }

            modeElement.setAttribute("shape", shape);
            modeElement.setAttribute("icon", mode.icon);
            modeElement.setAttribute("title", LANG.getModeFullName(mode.name));
            modeElement.style.setProperty("--mode-x", mode.x);
            modeElement.style.setProperty("--mode-y", mode.y);
            modeElement.style.setProperty("--mode-size", mode.size);

            if(shape === "diamond") {
                modeElement.innerHTML = `<svg class="border" xmlns="http://www.w3.org/2000/svg" viewBox="-4.5 -4.5 109 109"><polygon points="100,50 50,100 0,50 50,0"stroke-width="8"/></svg>`;
            } else if(shape === "octagon") {
                modeElement.innerHTML = `<svg class="border" xmlns="http://www.w3.org/2000/svg" viewBox="-4.5 -4.5 109 109"><polygon points="100,50 85.36,85.36 50,100 14.64,85.36 0,50 14.64,14.64 50,0 85.36,14.64"stroke-width="8"/></svg>`;
            }

            modeElement.addEventListener("click", () => onModeClicked(mode.name));

            MAIN_ELEMENT.appendChild(modeElement);
        }
    }

    function generateEdgeSVG() {
        EDGES_SVG.setAttribute("viewBox", `${map.min_x} ${map.min_y} ${map.max_x - map.min_x} ${map.max_y - map.min_y}`);

        for(const mode of Object.values(map.modes)) {
            for(const mode2Name of mode.unlock) {
                const mode2 = map.modes[mode2Name];

                const x1 = mode.x;  const y1 = mode.y;
                const x2 = mode2.x; const y2 = mode2.y;

                const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
                edge.setAttribute("x1", x1); edge.setAttribute("y1", y1);
                edge.setAttribute("x2", x2); edge.setAttribute("y2", y2);

                edge.style.setProperty("stroke-width", "8px");
                edge.style.setProperty("stroke", "#FFFFFF5F");
                edge.style.setProperty("stroke-linecap", "round");

                EDGES_SVG.appendChild(edge);
            }
        }
    }

    function getScaleFactor() {
        const viewportWidth = ROOT.clientWidth || 0;
        const viewportHeight = ROOT.clientHeight || 0;
        const viewportDimension = Math.sqrt(viewportWidth * viewportHeight);
        
        const targetDimension = Math.sqrt(1280 * 720);
        return viewportDimension / targetDimension * (IS_IN_IFRAME ? 2.62 : 2.26);
    }

    function onResize() {
        BODY.style.setProperty("--scale-factor", getScaleFactor());
    }

    function onMapZoom(oldZoom, newZoom = camZoom) {
        BODY.style.setProperty("--cam-zoom", newZoom);
    }

    function onModeClicked(modeName) {
        if(selected) {
            document.getElementById(MODE_ID_PREFIX + selected).classList.remove("selected");
        }
        selected = modeName;
        document.getElementById(MODE_ID_PREFIX + modeName).classList.add("selected");
    }

    function moveMap(dx, dy) {
        camX += dx;
        camY += dy;

        camX = clamp(-map.max_x - MAP_MARGIN, camX, -map.min_x + MAP_MARGIN);
        camY = clamp(-map.max_y - MAP_MARGIN, camY, -map.min_y + MAP_MARGIN);

        BODY.style.setProperty("--cam-x", camX);
        BODY.style.setProperty("--cam-y", camY);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", (event) => {
        heldKeyCodes.add(event.code);

        if(
            (event.code.includes("Key") || event.code.includes("Arrow"))
            && !(event.code == "KeyI" && event.ctrlKey && event.shiftKey)
        ) {
            event.preventDefault();
        }

        if(!isUpdateRunning) {
            prevTime = performance.now();
            update();
        }
    });
    window.addEventListener("keyup", (event) => {
        heldKeyCodes.delete(event.code);
    });
    
    function clamp(min, val, max) {
        return Math.min(Math.max(min, val), max);
    }
}