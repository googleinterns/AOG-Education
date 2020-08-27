"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Action = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * This class is used as a wrapper for Google Assistant Canvas Action class
 * along with its callbacks.
 */
var Action =
/*#__PURE__*/
function () {
  /**
   * @param {*} scene which serves as a container of all visual elements
   */
  function Action(scene) {
    var _this = this;

    _classCallCheck(this, Action);

    this.canvas = window.interactiveCanvas;
    this.scene = scene;
    this.commands = {
      // AOG Education Global Commands
      AOG_MAIN_MENU_SELECTION: function AOG_MAIN_MENU_SELECTION(data) {
        if (data.selection == "geography") {
          _this.scene.openGeography();
        } else if (data.selection == "language") {
          _this.scene.openLanguage();
        }
      },
      AOG_OPEN_MAIN_MENU: function AOG_OPEN_MAIN_MENU(data) {
        _this.scene.aogOpenMainMenu();
      },
      // AOG Education Geography Commands
      GEO_MENU: function GEO_MENU(data) {
        _this.scene.geoMenu(data);
      },
      GEO_CAPITAL: function GEO_CAPITAL(data) {
        _this.scene.geoCapital(data);
      },
      GEO_LOAD_STATE_MAP: function GEO_LOAD_STATE_MAP(data) {
        _this.scene.geoLoadStateMap(data);
      },
      GEO_LOAD_COUNTRY_MAP: function GEO_LOAD_COUNTRY_MAP(data) {
        _this.scene.geoLoadCountryMap(data);
      },
      GEO_SHOW_RESULTS: function GEO_SHOW_RESULTS(data) {
        _this.scene.geoShowResults(data);
      },
      GEO_CHOOSE_CITY: function GEO_CHOOSE_CITY(data) {
        _this.scene.geoChooseCity(data);
      },
      GEO_CITY: function GEO_CITY(data) {
        _this.scene.geoCity(data);
      },
      GEO_UP: function GEO_UP(data) {
        _this.scene.geoUp();
      },
      GEO_DOWN: function GEO_DOWN(data) {
        _this.scene.geoDown();
      },
      GEO_LEFT: function GEO_LEFT(data) {
        _this.scene.geoLeft();
      },
      GEO_RIGHT: function GEO_RIGHT(data) {
        _this.scene.geoRight();
      },
      GEO_FORWARD: function GEO_FORWARD(data) {
        _this.scene.geoForward();
      },
      GEO_BACKWARD: function GEO_BACKWARD(data) {
        _this.scene.geoBackward();
      },
      // AOG Education Language Commands
      LANG_MENU: function LANG_MENU(data) {
        _this.scene.langOpenLanguageMenu(data.value);
      },
      LANG_START_ONE_PIC: function LANG_START_ONE_PIC(data) {
        _this.scene.startOnePicOneWord(data.value);
      },
      LANG_ONE_PIC_SHOW_ENGLISH: function LANG_ONE_PIC_SHOW_ENGLISH(data) {
        _this.scene.onePicOneWordShowEnglish(data.value);
      },
      LANG_ONE_PIC_SHOW_SPANISH: function LANG_ONE_PIC_SHOW_SPANISH(data) {
        _this.scene.onePicOneWordShowSpanish(data.value);
      },
      LANG_ONE_PIC_UPDATE_ATTEMPTS: function LANG_ONE_PIC_UPDATE_ATTEMPTS(data) {
        _this.scene.updateOnePicAttempts(data.value);
      },
      LANG_ONE_PIC_SHOW_HINT: function LANG_ONE_PIC_SHOW_HINT(data) {
        _this.scene.onePicShowHint(data.value);
      },
      LANG_ONE_PIC_SHOW_ANSWER: function LANG_ONE_PIC_SHOW_ANSWER(data) {
        _this.scene.showOnePicAnswer(data.value);
      },
      LANG_START_MULTIPLE_WORDS: function LANG_START_MULTIPLE_WORDS(data) {
        _this.scene.startOnePicMultipleWords(data.value);
      },
      LANG_MULTIPLE_WORDS_SHOW_ENGLISH: function LANG_MULTIPLE_WORDS_SHOW_ENGLISH(data) {
        _this.scene.onePicMultipleWordShowEnglish(data.value);
      },
      LANG_MULTIPLE_WORDS_SHOW_SPANISH: function LANG_MULTIPLE_WORDS_SHOW_SPANISH(data) {
        _this.scene.onePicMultipleWordShowSpanish(data.value);
      },
      LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS: function LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS(data) {
        _this.scene.updateMultipleWordsAttempts(data.value);
      },
      LANG_MULTIPLE_WORDS_SHOW_ANSWER: function LANG_MULTIPLE_WORDS_SHOW_ANSWER(data) {
        _this.scene.showMultipleWordsAnswer(data.value);
      },
      LANG_START_CONVERSATION: function LANG_START_CONVERSATION(data) {
        _this.scene.startConversation(data.value);
      },
      LANG_ADD_CONVERSATION_MESSAGE: function LANG_ADD_CONVERSATION_MESSAGE(data) {
        _this.scene.addConversationMessage(data.value);
      },
      LANG_ADD_CONVERSATION_SEARCH_MESSAGE: function LANG_ADD_CONVERSATION_SEARCH_MESSAGE(data) {
        _this.scene.addConversationSearchMessage(data.value);
      },
      LANG_VOCAB: function LANG_VOCAB(data) {
        _this.scene.openVocab(data.value);
      },
      ///////////////////////////////////////////
      // AOG Education Reading Commands /////////
      ///////////////////////////////////////////
      READ_WRITE_TO_LIBRARY: function READ_WRITE_TO_LIBRARY(data) {
        _this.scene.reading.getLibrary().clearLibrary();

        _this.scene.reading.getLibrary().addToLibrary(data.books);

        _this.scene.openReading();
      },
      READ_BOOK_SELECTED: function READ_BOOK_SELECTED(data) {
        _this.scene.reading.getText().setText(data.text);

        _this.scene.reading.openText();
      },
      READ_CHANGE_TEXT: function READ_CHANGE_TEXT(data) {
        _this.scene.reading.getText().flip();

        _this.scene.reading.getText().textFont(); //moved here to resolve async bug with TTS handlers


        _this.scene.reading.getText().setText(data.text);
      },
      READ_OPEN_LIBRARY: function READ_OPEN_LIBRARY(data) {
        _this.scene.reading.getLibrary().updateProgress(data.progress);

        _this.scene.reading.openLibrary();
      },
      READ_TEXT_FEEDBACK: function READ_TEXT_FEEDBACK(data) {
        _this.scene.reading.getText().setRanges(data.ranges);

        _this.scene.reading.getText().setWords(data.words);
      }
    };
    this.commands.AOG_MAIN_MENU_SELECTION.bind(this); // AOG Education Geography Commands

    this.commands.GEO_MENU.bind(this);
    this.commands.GEO_CAPITAL.bind(this);
    this.commands.GEO_LOAD_COUNTRY_MAP.bind(this);
    this.commands.GEO_LOAD_STATE_MAP.bind(this);
    this.commands.GEO_SHOW_RESULTS.bind(this);
    this.commands.GEO_CHOOSE_CITY.bind(this);
    this.commands.GEO_CITY.bind(this);
    this.commands.GEO_UP.bind(this);
    this.commands.GEO_DOWN.bind(this);
    this.commands.GEO_LEFT.bind(this);
    this.commands.GEO_RIGHT.bind(this);
    this.commands.GEO_FORWARD.bind(this);
    this.commands.GEO_BACKWARD.bind(this); // AOG Education Language Commands

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
    this.commands.LANG_MENU.bind(this); // AOG Education Reading Commands

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


  _createClass(Action, [{
    key: "setCallbacks",
    value: function setCallbacks() {
      var _this2 = this;

      // declare Interactive Canvas callbacks
      var callbacks = {
        onUpdate: function onUpdate(data) {
          try {
            _this2.commands[data[0].command.toUpperCase()](data[0]);
          } catch (e) {// do nothing, when no command is sent or found
          }
        },
        //Synchronize Assistant dialogue with text highlighting and page transition
        onTtsMark: function onTtsMark(markName) {
          return regeneratorRuntime.async(function onTtsMark$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(markName === "FIN")) {
                    _context.next = 4;
                    break;
                  }

                  _this2.scene.reading.getText().clearHighlights();

                  _context.next = 4;
                  return regeneratorRuntime.awrap(_this2.canvas.sendTextQuery("Go next"));

                case 4:
                  if (markName === 'OK') {
                    //begining of assistants speech
                    _this2.scene.reading.getText().startHighlighting();
                  }

                  if (markName === 'CHAP') {
                    _this2.scene.reading.getText().titleFont();
                  }

                  if (!(markName === 'ENDCHAP')) {
                    _context.next = 9;
                    break;
                  }

                  _context.next = 9;
                  return regeneratorRuntime.awrap(_this2.canvas.sendTextQuery("Go next"));

                case 9:
                case "end":
                  return _context.stop();
              }
            }
          });
        }
      };
      callbacks.onUpdate.bind(this); // called by the Interactive Canvas web app once web app has loaded to
      // register callbacks

      this.canvas.ready(callbacks);
    }
  }]);

  return Action;
}();

exports.Action = Action;