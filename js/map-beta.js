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

    let camX = 0; let camY = 0; let camZoom = 1;

    let map = {};
    let heldKeyCodes = new Set();

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
            `Keys: {${Array.from(heldKeyCodes).join()}}\n`;
        
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
        addMapToHtml();
        generateEdgeSVG();
    }

    function addMapToHtml() {
        for(const mode of Object.values(map.modes)) {
            let element = document.createElement('button');

            element.classList.add("mode");
            element.setAttribute("type", "button");
            element.id = MODE_ID_PREFIX + mode.name;
            
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

            element.setAttribute("shape", shape);
            element.setAttribute("icon", mode.icon);
            element.setAttribute("title", LANG.getModeFullName(mode.name));
            element.style.setProperty("--mode-x", mode.x);
            element.style.setProperty("--mode-y", mode.y);
            element.style.setProperty("--mode-size", mode.size);

            MAIN_ELEMENT.appendChild(element);
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

                edge.style.setProperty("stroke-width", "calc(20px * var(--cam-zoom))");
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

    function moveMap(dx, dy) {
        camX += dx;
        camY += dy;

        camX = clamp(map.min_x, camX, map.max_x);
        camY = clamp(map.min_y, camY, map.max_y);

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