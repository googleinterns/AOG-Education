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
        this.scene.loadStateMap(data);
      },
      LOAD_COUNTRY_MAP: (data) => {
        this.scene.loadCountryMap(data);
      },

      // AOG Education Language Commands
      LANG_MENU: (data) => {
        this.scene.langOpenLanguageMenu();
      },
      LANG_START_ONE_PIC: (data) => {
        this.scene.langStartOnePicOneWord(data);
      },
      LANG_ONE_PIC_SHOW_ENGLISH: (data) => {
        this.scene.langOnePicOneWordShowEnglish(data);
      },
      LANG_ONE_PIC_SHOW_SPANISH: (data) => {
        this.scene.langOnePicOneWordShowSpanish(data);
      },

      ///////////////////////////////////////////
      // AOG Education Reading Commands /////////
      ///////////////////////////////////////////

      READ_WRITE_TO_LIBRARY: (data) => {
        this.scene.reading.getLibrary().clearLibrary();
        this.scene.reading.getLibrary().addToLibrary(data.books);
      },
      READ_BOOK_SELECTED: (data) => {
        this.scene.reading.getText().setText(data.text);
        this.scene.reading.openText();
      },
      READ_CHANGE_TEXT: (data) => {
        this.scene.reading.getText().setText(data.text);
      },
      READ_OPEN_LIBRARY: (data) => {
        this.scene.reading.openLibrary();
      },
      READ_TEXT_FEEDBACK: (data) => {
        this.scene.reading.getText().setRanges(data.ranges);
        this.scene.reading.getText().setWords(data.words);
      }

    };
    this.commands.AOG_MAIN_MENU_SELECTION.bind(this);

    // AOG Education Language Commands
    this.commands.LANG_START_ONE_PIC.bind(this);
    this.commands.LANG_ONE_PIC_SHOW_ENGLISH.bind(this);
    this.commands.LANG_ONE_PIC_SHOW_SPANISH.bind(this);
    this.commands.LANG_MENU.bind(this);

    // AOG Education Reading Commands
    this.commands.READ_WRITE_TO_LIBRARY.bind(this);
    this.commands.READ_BOOK_SELECTED.bind(this);
    this.commands.READ_CHANGE_TEXT.bind(this);
    this.commands.READ_OPEN_LIBRARY.bind(this);
    this.commands.READ_TEXT_FEEDBACK.bind(this);

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

      //Synchronize Assistant dialogue with text highlighting and page transition
      onTtsMark: async (markName) => {
        if (markName === "FIN") {
          this.scene.reading.getText().clearHighlights();
          await this.canvas.sendTextQuery("Go next"); //move to next page once assistant is done reading
        }
        if (markName ==='OK') { //begining of assistants speech
          this.scene.reading.getText().startHighlighting();
        }
      }
    };
    callbacks.onUpdate.bind(this);
    // called by the Interactive Canvas web app once web app has loaded to
    // register callbacks
    this.canvas.ready(callbacks);
  }
}
