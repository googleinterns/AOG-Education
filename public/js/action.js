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
                }
            },
            AOG_OPEN_MAIN_MENU: (data) => {
                this.scene.aogOpenMainMenu();
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
            LANG_ONE_PIC_SHOW_HINT: (data) => {
                this.scene.onePicShowHint(data.value);
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
            LANG_START_CONVERSATION: (data) => {
                this.scene.startConversation(data.value);
            },
            LANG_ADD_CONVERSATION_MESSAGE: (data) => {
                this.scene.addConversationMessage(data.value);
            },
            LANG_ADD_CONVERSATION_SEARCH_MESSAGE: (data) => {
                this.scene.addConversationSearchMessage(data.value);
            },
            LANG_VOCAB: (data) => {
                this.scene.openVocab(data.value);
            },

            ///////////////////////////////////////////
            // AOG Education Reading Commands /////////
            ///////////////////////////////////////////

            READ_WRITE_TO_LIBRARY: (data) => {
                this.scene.openReading();
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
            },
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
        this.commands.LANG_ONE_PIC_SHOW_ENGLISH.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_SPANISH.bind(this);
        this.commands.LANG_ONE_PIC_UPDATE_ATTEMPTS.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_HINT.bind(this);
        this.commands.LANG_ONE_PIC_SHOW_ANSWER.bind(this);
        this.commands.LANG_START_MULTIPLE_WORDS.bind(this);
        this.commands.LANG_MULTIPLE_WORDS_SHOW_ENGLISH.bind(this);
        this.commands.LANG_MULTIPLE_WORDS_SHOW_SPANISH.bind(this);
        this.commands.LANG_MULTIPLE_WORDS_SHOW_ANSWER.bind(this);
        this.commands.LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS.bind(this);
        this.commands.LANG_START_CONVERSATION.bind(this);
        this.commands.LANG_ADD_CONVERSATION_MESSAGE.bind(this);
        this.commands.LANG_ADD_CONVERSATION_SEARCH_MESSAGE.bind(this);
        this.commands.LANG_VOCAB.bind(this);
        this.commands.LANG_MENU.bind(this);

        // AOG Education Reading Commands
        this.commands.READ_WRITE_TO_LIBRARY.bind(this);
        this.commands.READ_BOOK_SELECTED.bind(this);
        this.commands.READ_CHANGE_TEXT.bind(this);
        this.commands.READ_OPEN_LIBRARY.bind(this);
        this.commands.READ_TEXT_FEEDBACK.bind(this);
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
                if (markName === "OK") {
                    //begining of assistants speech
                    this.scene.reading.getText().startHighlighting();
                }
            },
        };
        callbacks.onUpdate.bind(this);
        // called by the Interactive Canvas web app once web app has loaded to
        // register callbacks
        this.canvas.ready(callbacks);
    }
}
