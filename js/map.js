"use strict";
import * as LANG from "./lang.js";

/**
 * @typedef {{
 *   name: string,
 *   shape: number,
 *   unlock: string[],
 *   size: number,
 *   x: number, y: number,
 *   icon: string,
 *   source: string
 * }} Mode
 * 
 * @typedef {{
 *   modes: {[name: string]: Mode},
 *   min_x: number, max_x: number,
 *   min_y: number, max_y: number,
 *   starting_mode: string
 * }} Map
 */
{
    const INIT_TIME = performance.now();
    const IS_IN_IFRAME = window.self === window.top;

    const MODE_ID_PREFIX = "mode_";
    const MODE_RANK_DISPLAY_CLASSES = ["q-req", "b-req", "a-req", "s-req", "u-req", "x-req"];
    const MOVE_SPEED_MULT = 0.26;
    const ZOOM_SPEED_MULT = 0.00262;
    const ZOOM_SCROLL_MULT = -0.6;
    const MIN_ZOOM = 0.126;
    const MAX_ZOOM = 1.26;
    const MAP_MARGIN = 62;

    const ROOT = document.documentElement;
    const BODY = document.body;
    const MAIN = document.getElementById("main");
    const EDGES_SVG = document.getElementById("edge-display");
    const CROSSHAIR = document.getElementById("crosshair");
    
    const MODE_INFO_ELEMENT = document.getElementById("mode-info");

    /**
     * @type {{
     * outer: HTMLElement,
     * title: HTMLElement,
     * subtitle: HTMLElement,
     * version: HTMLElement,
     * description: HTMLElement,
     * name: HTMLElement,
     * rankReqs: HTMLElement,
     * rankReqElements: HTMLCollectionOf<HTMLCollectionOf<HTMLElement>>,
     * expandButton: HTMLElement,
     * closeButton: HTMLElement,
     * collapseButton: HTMLElement,
     * article: HTMLElement,
     * featuredVideo: HTMLVideoElement,
     * featuredVideoText: HTMLElement,
     * entries: {
     *      difficulty: HTMLElement,
     *      diffContent: HTMLElement,
     *      length: HTMLElement,
     *      lengthContent: HTMLElement,
     *      version: HTMLElement,
     *      versionContent: HTMLElement,
     *      sourceLink: HTMLAnchorElement
     * }
     * }} MODE_INFO_ELEMENTS
     */
    const MODE_INFO_ELEMENTS = {
        outer:              MODE_INFO_ELEMENT,
        title:              MODE_INFO_ELEMENT.querySelector(".title"),
        subtitle:           MODE_INFO_ELEMENT.querySelector(".subtitle"),
        version:            MODE_INFO_ELEMENT.querySelector(".version-info"),
        description:        MODE_INFO_ELEMENT.querySelector(".description"),
        name:               MODE_INFO_ELEMENT.querySelector(".name"),
        rankReqs:           MODE_INFO_ELEMENT.querySelector(".rank-reqs"),
        rankReqElements:    MODE_RANK_DISPLAY_CLASSES.map(c => document.getElementsByClassName(c)),
        expandButton:       document.getElementById("expand-mode-info"),
        closeButton:        document.getElementById("close-mode-info"),
        collapseButton:     document.getElementById("collapse-mode-info"),
        article:            document.getElementById("mode-article"),
        featuredVideo:      document.getElementById("featured-video"),
        featuredVideoText:  document.getElementById("featured-video-text"),
        entries: {
            difficulty:     document.getElementById("difficulty-entry"),
            diffContent:    document.getElementById("difficulty-entry-content"),
            length:         document.getElementById("length-entry"),
            lengthContent:  document.getElementById("length-entry-content"),
            version:        document.getElementById("version-entry"),
            versionContent: document.getElementById("version-entry-content"),
            sourceLink:     document.getElementById("src-entry")
        }
    }
    
    const DIAMOND_SVG =
        `<svg class="border" xmlns="http://www.w3.org/2000/svg" viewBox="-4.5 -4.5 109 109">
            <polygon points="100,50 50,100 0,50 50,0"stroke-width="5"/>
        </svg>`;
    const OCTAGON_SVG =
        `<svg class="border" xmlns="http://www.w3.org/2000/svg" viewBox="-4.5 -4.5 109 109">
            <polygon points="100,50 85.36,85.36 50,100 14.64,85.36 0,50 14.64,14.64 50,0 85.36,14.64"stroke-width="5"/>
        </svg>`;

    let camX = 0; let camY = 0; let camZoom = 1;

    /** @type {Map} */
    let map = {};
    let mapLoaded = false;
    let heldKeyCodes = new Set();
    let selected = null;
    let isDragging = false;
    let cancelNextModeSelect = false;
    let pendingUnselect = false;
    /**@type {"closed" | "open" | "expanded"}*/
    let modeInfoExpansionState = "closed";

    let isUpdateRunning = false;
    let prevTime = performance.now();

    function init() {
        if(IS_IN_IFRAME) {
            // for easier viewing if directly accessing the page
            ROOT.style.backgroundColor = "black";

            const bgCanvas = document.createElement("canvas");
            bgCanvas.id = "bg";
            BODY.appendChild(bgCanvas);

            const bgScript = document.createElement("script");
            bgScript.src = "/js/background.js";
            BODY.appendChild(bgScript);
        }
        loadMapData();
        onResize();
        document.getElementById("init-error-message")?.remove();
    }
    init();

    function handleKeys(dt) {
        if(!mapLoaded) return;

        if(heldKeyCodes.has("Escape")) {
            if(modeInfoExpansionState === "expanded") {
                modeInfoCollapseToSmall();
            } else if(selected) {
                unselectMode();
            }
            heldKeyCodes.delete("Escape");
        }

        if(heldKeyCodes.has("Enter")) {
            if(modeInfoExpansionState === "open") {
                modeInfoExpandFull();
            }
        }

        if(modeInfoExpansionState === "expanded") return;

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


            if(zoomMultiplier !== 1) {
                const oldZoom = camZoom;
                camZoom *= zoomMultiplier;
                
                camZoom = clamp(MIN_ZOOM, camZoom, MAX_ZOOM);
                onMapZoom(oldZoom, camZoom);

                CROSSHAIR.style.display = "none";
            }
            
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

            if(dx !== 0 || dy !== 0) {
                CROSSHAIR.style.display = "block";
                moveMap(dx, dy);
                const modeAtCenter = getModeAtScreenCenter();
                if(modeAtCenter && selected !== modeAtCenter.name) {
                    selectMode(modeAtCenter.name);
                }
            }
        }
    }

    function update(forceRun = false) {
        if(isUpdateRunning && !forceRun) return;
        isUpdateRunning = true;
        let continueUpdate = heldKeyCodes.size > 0;

        const dt = performance.now() - prevTime;
        prevTime = performance.now();

        handleKeys(dt);

        if(continueUpdate) {
            return requestAnimationFrame(() => update(true));
        }
        isUpdateRunning = false;
    }

    function getInvalidValueList() {
        let list = [];
        if(!isFinite(camX)) list.push(`Cam. X is ${camX}`);
        if(!isFinite(camY)) list.push(`Cam. Y is ${camY}`);
        if(!isFinite(camZoom)) list.push(`Zoom is ${camZoom}`);
        const scaleFactor = getScaleFactor();
        if(!isFinite(scaleFactor)) list.push(`Scale factor is ${scaleFactor}`);
        if(!mapLoaded) list.push("Map data not loaded");
        if(
            modeInfoExpansionState !== "closed" &&
            modeInfoExpansionState !== "expanded" &&
            modeInfoExpansionState !== "open"
        ) list.push(`Mode info exp. state: ${modeInfoExpansionState}`);
        if(!MAIN) list.push("MAIN not found");
        if(!EDGES_SVG) list.push("EDGES_SVG not found");
        if(!CROSSHAIR) list.push("CROSSHAIR not found");
        if(!MODE_INFO_ELEMENT) list.push("MODE_INFO_ELEMENT not found");
        return list;
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
        mapLoaded = true;
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
                modeElement.innerHTML = DIAMOND_SVG;
            } else if(shape === "octagon") {
                modeElement.innerHTML = OCTAGON_SVG;
            }

            modeElement.addEventListener("click", () => onModeClicked(mode.name));

            MAIN.appendChild(modeElement);
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
        camZoom = clamp(MIN_ZOOM, newZoom, MAX_ZOOM);
        BODY.style.setProperty("--cam-zoom", camZoom);
    }

    function getModeAtScreenCenter() {
        if(!mapLoaded) return;

        const isSquareInCenter = (cx, cy, size) => {
            const L = cx - size; const R = cx + size;
            const U = cy - size; const D = cy + size;
            
            return (
                L < camX && camX < R &&
                U < camY && camY < D
            );
        }

        const isCircleInCenter = (cx, cy, maxDist) => {
            const maxDistSq = maxDist * maxDist;
            const dx = cx - camX;
            const dy = cy - camY;
            const distSq = dx * dx + dy * dy;

            return distSq < maxDistSq;
        }

        const isDiamondInCenter = (cx, cy, maxManhDist) => {
            const dx = Math.abs(cx - camX);
            const dy = Math.abs(cy - camY);

            return dx + dy < maxManhDist;
        }

        const isModeInCenter = (mode) => {
            if(typeof mode === "string") {
                mode = map.modes[mode];
            }

            const x = -mode.x; const y = -mode.y;

            switch(mode.shape) {
                case 1:
                    return isSquareInCenter(x, y, mode.size);
                case 2:
                    return isDiamondInCenter(x, y, mode.size);
                default:
                    return isCircleInCenter(x, y, mode.size);
            }
        }

        // Small optimization if cursor only moved a little
        if(selected) {
            if(isModeInCenter(selected)) {
                return map.modes[selected];
            }
        }

        for(const mode of Object.values(map.modes)) {
            if(isModeInCenter(mode)) {
                return mode;
            }
        }

        return null;
    }

    function onModeClicked(modeName) {
        if(cancelNextModeSelect) {
            cancelNextModeSelect = false;
            return;
        }
        selectMode(modeName);
    }

    function selectMode(modeName) {
        if(selected === modeName) {
            modeInfoExpandFull();
            return;
        }

        if(selected) {
            document.getElementById(MODE_ID_PREFIX + selected)?.classList.remove("selected");
        }
        selected = modeName;
        document.getElementById(MODE_ID_PREFIX + modeName)?.classList.add("selected");

        modeInfoExpand();
    }

    function updateModeInfo() {
        if(!selected) return;
        const mode = map.modes[selected];

        MODE_INFO_ELEMENTS.title.innerText = LANG.getLanguageEntry(`modes.${selected}.title`);
        MODE_INFO_ELEMENTS.subtitle.innerText = LANG.getLanguageEntry(`modes.${selected}.subtitle`, "");
        MODE_INFO_ELEMENTS.description.innerText = LANG.getLanguageEntry(`modes.${selected}.description`, "");
        MODE_INFO_ELEMENTS.version.innerText = LANG.getLanguageEntry(`modes.${selected}.version_info`, "");
        MODE_INFO_ELEMENTS.name.innerText = LANG.getModeFullName(selected);

        for(let rank = 0; rank < MODE_INFO_ELEMENTS.rankReqElements.length; rank++) {
            const req = LANG.getLanguageEntry(`modes.${selected}.rank_reqs.${rank}`, "(impossible)");
            for(let i = 0; i < MODE_INFO_ELEMENTS.rankReqElements[rank].length; i++) {
                MODE_INFO_ELEMENTS.rankReqElements[rank][i].textContent = req;
            }
        }
    }
    function updateExpandedModeInfo() {
        LANG.getArticle(`modes.${selected}`, "Article unavailable")
            .then(article => {
                MODE_INFO_ELEMENTS.article.innerHTML = article;
            })
            .catch(err => {
                const errMsg = `Error loading article 'modes.${selected}': `
                console.error(errMsg, err);
                alert(errMsg + "\n" + err);
            });
        
        const vid = LANG.getLanguageEntry(`modes.${selected}.featured_video`, false);
        const vidElement = MODE_INFO_ELEMENTS.featuredVideo,
              vidText = MODE_INFO_ELEMENTS.featuredVideoText;

        if(vid) {
            vidElement.classList.remove("hide-important");
            vidText.classList.remove("hide-important");
            vidElement.src = vid;
        } else {
            vidElement.classList.add("hide-important");
            vidText.classList.add("hide-important");
        }

        const entries = MODE_INFO_ELEMENTS.entries;

        let difficulty = LANG.getLanguageEntry(`modes.${selected}.difficulty`, null) ??
            LANG.getLanguageEntry(`map.not_available`);
        
        let length = LANG.getLanguageEntry(`modes.${selected}.length`, null) ??
            LANG.getLanguageEntry(`map.not_available`);
        
        let version = LANG.getLanguageEntry(`modes.${selected}.version_info`, null);
        
        entries.diffContent.textContent = difficulty;
        entries.lengthContent.textContent = length;
        if(version) {
            entries.versionContent.textContent = version;
            entries.version.classList.remove("hide-important");
        } else {
            entries.version.classList.add("hide-important");
        }

        let src = map.modes[selected].source ?? null;

        if(src) {
            entries.sourceLink.href = src;
            entries.sourceLink.classList.remove("hide-important");
        } else {
            entries.sourceLink.classList.add("hide-important");
        }
    }

    function unselectMode() {
        if(selected) {
            document.getElementById(MODE_ID_PREFIX + selected)?.classList.remove("selected");
        }
        selected = null;
        modeInfoCollapseToNothing();
    }

    function modeInfoExpand() {
        const classes = MODE_INFO_ELEMENT.classList;
        if(!classes.contains("expand")) {
            classes.add("expand-anim");
        }
        classes.add("expand");
        classes.remove("expand-full", "expand-full-anim", "collapse-anim", "collapse-full-anim");
        modeInfoExpansionState = "open";
        updateModeInfo();
    }
    function modeInfoExpandFull() {
        const classes = MODE_INFO_ELEMENT.classList;
        classes.add("expand-full", "expand-full-anim");
        classes.remove("expand", "expand-anim", "collapse-anim", "collapse-full-anim");
        modeInfoExpansionState = "expanded";
        updateExpandedModeInfo();
    }
    function modeInfoCollapseToNothing() {
        const classes = MODE_INFO_ELEMENT.classList;
        classes.add("collapse-anim");
        classes.remove("expand", "expand-anim", "expand-full", "expand-full-anim", "collapse-full-anim");
        modeInfoExpansionState = "closed";
    }
    function modeInfoCollapseToSmall() {
        const classes = MODE_INFO_ELEMENT.classList;
        classes.add("collapse-full-anim", "expand");
        classes.remove("expand-anim", "expand-full", "expand-full-anim", "collapse-anim");
        modeInfoExpansionState = "open";
    }

    function moveMap(dx, dy) {
        if(!mapLoaded) return;

        camX += dx;
        camY += dy;

        camX = clamp(-map.max_x - MAP_MARGIN, camX, -map.min_x + MAP_MARGIN);
        camY = clamp(-map.max_y - MAP_MARGIN, camY, -map.min_y + MAP_MARGIN);

        BODY.style.setProperty("--cam-x", camX);
        BODY.style.setProperty("--cam-y", camY);
    }

    window.addEventListener("resize", onResize);

    // #region Events
    // Keyboard events
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

    // Mouse events
    window.addEventListener("mousedown", (event) => {
        if(event.button === 0 && !MODE_INFO_ELEMENTS.rankReqs.contains(event.target) && modeInfoExpansionState !== "expanded") {
            isDragging = true;
            CROSSHAIR.style.display = "none";
        }
        if(event.target === MAIN) {
            pendingUnselect = true;
        }
        cancelNextModeSelect = false;
    });
    window.addEventListener("mousemove", (event) => {
        if(isDragging) {
            let scaleFactor = getScaleFactor();
            let camScale = camZoom * scaleFactor;
            moveMap(event.movementX / camScale, event.movementY / camScale);
            cancelNextModeSelect = true;
        }
        pendingUnselect = false;
    });
    window.addEventListener("mouseup", (event) => {
        if(pendingUnselect) {
            pendingUnselect = false;
            unselectMode();
        }
        isDragging = false;
    });
    window.addEventListener("wheel", (event) => {
        if(MODE_INFO_ELEMENTS.rankReqs.contains(event.target) || modeInfoExpansionState === "expanded") return;

        event.preventDefault();
        
        const dZoom = event.deltaY * ZOOM_SCROLL_MULT * ZOOM_SPEED_MULT * camZoom;
        onMapZoom(camZoom, camZoom + dZoom);
    }, {passive: false});

    // Touch events
    let prevTouches = [];
    window.addEventListener("touchstart", (event) => {
        if(event.touches.length === 1 && !MODE_INFO_ELEMENTS.rankReqs.contains(event.target) && modeInfoExpansionState !== "expanded") {
            isDragging = true;
            CROSSHAIR.style.display = "none";
        }
        if(event.target === MAIN && event.touches.length === 1) {
            pendingUnselect = true;
        }
        if(event.touches.length > 1) {
            isDragging = false;
        }
        cancelNextModeSelect = false;

        prevTouches = event.touches;
    });
    window.addEventListener("touchmove", (event) => {
        if(isDragging) {
            const scaleFactor = getScaleFactor();
            const camScale = camZoom * scaleFactor;
            const dx = event.touches[0].clientX - prevTouches[0].clientX;
            const dy = event.touches[0].clientY - prevTouches[0].clientY;
            moveMap(dx / camScale, dy / camScale);
            cancelNextModeSelect = true;
        } else if(event.touches.length >= 2) {
            event.preventDefault();
            const prevTouchA = prevTouches[0];
            const prevTouchB = prevTouches[1];
            const touchA = event.touches[0];
            const touchB = event.touches[1];

            const prevTouchDist = 
                Math.hypot(prevTouchA.clientX - prevTouchB.clientX,
                    prevTouchA.clientY - prevTouchB.clientY);
            
            const touchDist =
                Math.hypot(touchA.clientX - touchB.clientX,
                    touchA.clientY - touchB.clientY);
            
            const zoomFactor = touchDist / prevTouchDist;
            onMapZoom(camZoom, camZoom * zoomFactor);
        }
        pendingUnselect = false;

        prevTouches = event.touches;
    });
    window.addEventListener("touchend", (event) => {
        if(pendingUnselect) {
            pendingUnselect = false;
            unselectMode();
        }
        isDragging = event.touches.length === 1;

        prevTouches = event.touches;
    });

    // Button events
    MODE_INFO_ELEMENTS.closeButton?.addEventListener("click", unselectMode);
    MODE_INFO_ELEMENTS.expandButton?.addEventListener("click", modeInfoExpandFull);
    MODE_INFO_ELEMENTS.collapseButton?.addEventListener("click", modeInfoCollapseToSmall);
    // #endregion
    
    function clamp(min, val, max) {
        return Math.min(Math.max(min, val), max);
    }
}