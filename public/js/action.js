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
            GEO_MENU: (data) => {
                this.scene.geoMenu(data);
            },
            GEO_CAPITAL: (data) => {
                this.scene.geoCapital(data);
            },
            GEO_LOAD_STATE_MAP: (data) => {
                this.scene.geoLoadStateMap(data);
            },
            GEO_LOAD_COUNTRY_MAP: (data) => {
                this.scene.geoLoadCountryMap(data);
            },
            GEO_SHOW_RESULTS: (data) => {
                this.scene.geoShowResults(data);
            },

            // AOG Education Language Commands
            LANG_MENU: (data) => {
                this.scene.langOpenLanguageMenu(data.value);
            },
            LANG_START_ONE_PIC: (data) => {
                this.scene.startOnePicOneWord(data.value);
            },
            LANG_ONE_PIC_SHOW_ENGLISH: (data) => {
                this.scene.onePicOneWordShowEnglish(data.value);
            },
            LANG_ONE_PIC_SHOW_SPANISH: (data) => {
                this.scene.onePicOneWordShowSpanish(data.value);
            },
            LANG_ONE_PIC_UPDATE_ATTEMPTS: (data) => {
                this.scene.updateOnePicAttempts(data.value);
            },
            LANG_ONE_PIC_SHOW_ANSWER: (data) => {
                this.scene.showOnePicAnswer(data.value);
            },
            LANG_START_MULTIPLE_WORDS: (data) => {
                this.scene.startOnePicMultipleWords(data.value);
            },
            LANG_MULTIPLE_WORDS_SHOW_ENGLISH: (data) => {
                this.scene.onePicMultipleWordShowEnglish(data.value);
            },
            LANG_MULTIPLE_WORDS_SHOW_SPANISH: (data) => {
                this.scene.onePicMultipleWordShowSpanish(data.value);
            },
            LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS: (data) => {
                this.scene.updateMultipleWordsAttempts(data.value);
            },
            LANG_MULTIPLE_WORDS_SHOW_ANSWER: (data) => {
                this.scene.showMultipleWordsAnswer(data.value);
            },
            // AOG Education Reading Commands
        };
        this.commands.AOG_MAIN_MENU_SELECTION.bind(this);

        // AOG Education Geography Commands
        this.commands.GEO_MENU.bind(this);
        this.commands.GEO_CAPITAL.bind(this);
        this.commands.GEO_LOAD_COUNTRY_MAP.bind(this);
        this.commands.GEO_LOAD_STATE_MAP.bind(this);
        this.commands.GEO_SHOW_RESULTS.bind(this);

        // AOG Education Language Commands
        this.commands.LANG_START_ONE_PIC.bind(this);
        this.commands.LANG_ONE_PIC_UPDATE_ATTEMPTS.bind(this);
        this.commands.LANG_START_MULTIPLE_WORDS.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_ENGLISH.bind(this);
        this.commands.LANG_MULTIPLE_WORDS_SHOW_ENGLISH.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_SPANISH.bind(this);
        this.commands.LANG_MULTIPLE_WORDS_SHOW_SPANISH.bind(this);
        this.commands.LANG_MENU.bind(this);

        // AOG Education Reading Commands
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
