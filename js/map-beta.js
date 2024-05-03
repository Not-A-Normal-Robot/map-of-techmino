"use strict";
import * as LANG from "./lang.js";
{
    
    const IS_IN_IFRAME = window.self === window.top;

    const ROOT = document.documentElement;
    const BODY = document.body;
    const MAIN_ELEMENT = document.getElementById("main");
    const EDGE_DSP_CANVAS = document.getElementById("edge-display");
    const EDGE_DSP_CTX = EDGE_DSP_CANVAS.getContext("2d");

    const MODE_ID_PREFIX = "mode_";

    let camX = 0; let camY = 0; let camZoom = 1;

    let map = {};

    function init() {
        if(IS_IN_IFRAME) {
            // for easier viewing if directly accessing the page
            document.getElementsByTagName("body")[0].style.backgroundColor = "black";
        }
        loadMapData();
        onResize();
        document.getElementById("init-error-message")?.remove();
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
                addMapToHtml();
            })
            .catch(error => {
                alert("Error loading map: \n" + error +
                    "\nPress OK to return to home page.");
                window.location.href = "/";
            });
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

    function onMapZoom() {

    }

    window.addEventListener("resize", onResize);
}