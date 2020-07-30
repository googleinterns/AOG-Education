import { Action } from "./action.js";
import { Scene } from "./scene.js";

window.addEventListener("load", () => {
    window.scene = new Scene();
    // Set Google Assistant Canvas Action at scene level
    window.scene.action = new Action(scene);
    // Call setCallbacks to register Interactive Canvas
    window.scene.action.setCallbacks();
});
