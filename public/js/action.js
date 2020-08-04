/**
 * This class is used as a wrapper for Google Assistant Canvas Action class
 * along with its callbacks.
 */
export class Action {
    /**
     * @param {*} scene which serves as a container of all visual elements
     */
    constructor(scene) {
        this.canvas = window.interactiveCanvas;
        this.scene = scene;
        this.commands = {
            // AOG Education Global Commands
            AOG_MAIN_MENU_SELECTION: (data) => {
                if (data.selection == "geography") {
                    this.scene.openGeography();
                } else if (data.selection == "language") {
                    this.scene.openLanguage();
                } else if (data.selection == "reading") {
                    this.scene.openReading();
                }
            },

            // AOG Education Geography Commands
            LOAD_STATE_MAP: (data) => {
                this.scene.loadStateMap();
            },
            LOAD_COUNTRY_MAP: (data) => {
                this.scene.loadCountryMap();
            },

            // AOG Education Language Commands
            // AOG Education Reading Commands
        };
        this.commands.AOG_MAIN_MENU_SELECTION.bind(this);
        
        // Bind AOG Education Geography Commands
        this.commands.LOAD_COUNTRY_MAP.bind(this);
        this.commands.LOAD_STATE_MAP.bind(this);
    }
    /**
     * Register all callbacks used by Interactive Canvas
     * executed during scene creation time.
     *
     */
    setCallbacks() {
        // declare Interactive Canvas callbacks
        const callbacks = {
            onUpdate: (data) => {
                try {
                    this.commands[data[0].command.toUpperCase()](data[0]);
                } catch (e) {
                    // do nothing, when no command is sent or found
                }
            },
        };
        callbacks.onUpdate.bind(this);
        // called by the Interactive Canvas web app once web app has loaded to
        // register callbacks
        this.canvas.ready(callbacks);
    }
}
