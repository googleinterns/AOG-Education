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

      };
      this.commands.LOAD_MAP.bind(this);
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