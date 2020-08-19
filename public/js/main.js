import { Action } from "./Action.js";
import { Scene } from "./Scene.js";
import { MAPS_API_KEY } from "./config.js"

// Load Google Maps API
var mapScript = document.createElement("script");
mapScript.src = "https://maps.googleapis.com/maps/api/js?" +
                "key="+MAPS_API_KEY+"&libraries=&v=weekly";
document.head.appendChild(mapScript);

// Load GeoCharts API
google.charts.load("current", {
    "packages":["geochart"],
    "mapsApiKey": MAPS_API_KEY
});

window.addEventListener("load", () => {
    window.scene = new Scene();
    // Set Google Assistant Canvas Action at scene level
    window.scene.action = new Action(scene);
    // Call setCallbacks to register Interactive Canvas
    window.scene.action.setCallbacks();
});

// Get the header height of the device and set the top body padding accordingly
window.interactiveCanvas.getHeaderHeightPx().then((headerHeight) => {
    document.body.style.paddingTop = `${headerHeight}px`;
});
