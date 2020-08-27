"use strict";

var _require = require("@assistant/conversation"),
    conversation = _require.conversation,
    Canvas = _require.Canvas;

var functions = require("firebase-functions");

var admin = require("firebase-admin");

admin.initializeApp();
var auth = admin.auth();

var config = require("./config");

var firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
var INSTRUCTIONS = "Hello user, This is AOG Education."; // The Client Id of the Actions Project (set it in the env file).

var CLIENT_ID = config.keys.clientID;
var app = conversation({
  debug: true,
  clientId: CLIENT_ID
});
/**
 * AOG Education Global Handlers
 */
// This handler is called after the user has successfully linked their account.
// Saves the user name in a session param to use it in dialogs, and inits the
// Firestore db to store orders for the user.

app.handle("create_user", function _callee(conv) {
  var payload, email;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          payload = conv.user.params.tokenPayload; // write user name in session to use in dialogs

          conv.user.params.name = payload.given_name;
          email = payload.email;

          if (!email) {
            _context.next = 17;
            break;
          }

          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(auth.getUserByEmail(email));

        case 7:
          conv.user.params.uid = _context.sent.uid;
          _context.next = 17;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](4);

          if (!(_context.t0.code !== "auth/user-not-found")) {
            _context.next = 14;
            break;
          }

          throw _context.t0;

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(auth.createUser({
            email: email
          }));

        case 16:
          conv.user.params.uid = _context.sent.uid;

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 10]]);
}); // Used to reset the slot for account linking status to allow the user to try
// again if a system or network error occurred.

app.handle("system_error", function _callee2(conv) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          conv.session.params.AccountLinkingSlot = "";

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.handle("welcome", function _callee3(conv) {
  var payload, name, email;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (conv.device.capabilities.includes("INTERACTIVE_CANVAS")) {
            _context3.next = 4;
            break;
          }

          conv.add("Sorry, this device does not support Interactive Canvas!");
          conv.scene.next.name = "actions.page.END_CONVERSATION";
          return _context3.abrupt("return");

        case 4:
          payload = conv.user.params.tokenPayload;
          name = payload.given_name;

          if (!(conv.user.params.uid == undefined)) {
            _context3.next = 22;
            break;
          }

          email = payload.email;

          if (!email) {
            _context3.next = 22;
            break;
          }

          _context3.prev = 9;
          _context3.next = 12;
          return regeneratorRuntime.awrap(auth.getUserByEmail(email));

        case 12:
          conv.user.params.uid = _context3.sent.uid;
          _context3.next = 22;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](9);

          if (!(_context3.t0.code !== "auth/user-not-found")) {
            _context3.next = 19;
            break;
          }

          throw _context3.t0;

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(auth.createUser({
            email: email
          }));

        case 21:
          conv.user.params.uid = _context3.sent.uid;

        case 22:
          conv.add("Welcome ".concat(name, ", thank you for choosing AOG Education"));
          conv.add(new Canvas({
            url: "https://step-capstone.web.app"
          }));

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[9, 15]]);
});
app.handle("aog_open_main_menu", function (conv) {
  conv.add("Returning to main menu");
  conv.add(new Canvas({
    data: {
      command: "AOG_OPEN_MAIN_MENU"
    }
  }));
});
app.handle("empty", function (conv) {
  conv.add(new Canvas());
});
app.handle("fallback", function (conv) {
  conv.add("I don't understand. Ask for help to get assistance.");
  conv.add(new Canvas());
});
app.handle("aog_instructions", function (conv) {
  conv.add(INSTRUCTIONS);
  conv.add(new Canvas());
});
app.handle("aog_main_menu_selection", function (conv) {
  var selection = conv.intent.params.selection ? conv.intent.params.selection.resolved : null;
  conv.add("Ok, starting ".concat(selection, "."));

  if (selection == "language") {
    conv.add(new Canvas({
      data: {
        command: "AOG_MAIN_MENU_SELECTION",
        selection: selection
      }
    }));
    conv.scene.next.name = "lang_menu";
  }

  if (selection == "geography") {
    conv.add(new Canvas({
      data: {
        command: "AOG_MAIN_MENU_SELECTION",
        selection: selection
      }
    }));
    conv.scene.next.name = "geo_menu";
  }

  if (selection == "reading") {
    var books = [];
    var keys = Object.keys(database);

    for (i in keys) {
      var imgSrc = database[keys[i]]["Image"];
      var title = keys[i];
      var chunkNumber = getProgress(title, conv);
      var book = {
        imgSrc: imgSrc,
        title: title,
        chunkNumber: chunkNumber
      };
      books.push(book);
    }

    conv.add(new Canvas({
      data: {
        command: "READ_WRITE_TO_LIBRARY",
        books: books
      }
    }));
    conv.scene.next.name = "READ_LIBRARY";
  }
});
/**
 * GEOGRAPHY SECTION
 */
// Load functions and state coordinates data.

var geo_functions = require("./geography/functions");

var geo_state_coords_file = require("./geography/state_coords");

var geo_cities_file = require("./geography/cities");

var geo_state_coords = geo_state_coords_file.stateCoords;
var geo_cities = geo_cities_file.cities;
app.handle("geo_setup", function (conv) {
  geo_functions.setup(conv);
  conv.add("Choose a category.");
  conv.add(new Canvas({
    data: {
      command: "GEO_MENU"
    }
  }));
});
/**
 * Ask US capital question.
 */

app.handle("geo_us_capital", function (conv) {
  conv.session.params.geo_category = "US_CAPITAL";
  geo_functions.getQuestion(conv);
  conv.add("What is the capital of ".concat(conv.session.params.geo_name, "?"));
  conv.add(new Canvas({
    data: {
      command: "GEO_CAPITAL",
      name: conv.session.params.geo_name,
      answer: geo_functions.getCorrectAnswer(conv)
    }
  }));
});
/**
 * Ask world capital question.
 */

app.handle("geo_world_capital", function (conv) {
  conv.session.params.geo_category = "WORLD_CAPITAL";
  geo_functions.getQuestion(conv);
  conv.add("What is the capital of ".concat(conv.session.params.geo_name, "?"));
  conv.add(new Canvas({
    data: {
      command: "GEO_CAPITAL",
      name: conv.session.params.geo_name,
      answer: geo_functions.getCorrectAnswer(conv)
    }
  }));
});
/**
 * Ask US state question and load the state map in question.
 */

app.handle("geo_state", function (conv) {
  conv.session.params.geo_category = "STATE";
  geo_functions.getQuestion(conv);
  conv.add("What is the state pictured?");
  conv.add(new Canvas({
    data: {
      command: "GEO_LOAD_STATE_MAP",
      coords: geo_state_coords[conv.session.params.geo_name]
    }
  }));
});
/**
 * Ask country question and load the country map in question.
 */

app.handle("geo_country", function (conv) {
  conv.session.params.geo_category = "COUNTRY";
  geo_functions.getQuestion(conv);
  conv.add("What is the country pictured?");
  conv.add(new Canvas({
    data: {
      command: "GEO_LOAD_COUNTRY_MAP",
      country: conv.session.params.geo_name,
      region: conv.session.params.geo_region
    }
  }));
});
/**
 * Have user choose a place to visit.
 */

app.handle("geo_choose_city", function (conv) {
  conv.add("Choose a place to visit.");
  conv.add(new Canvas({
    data: {
      command: "GEO_CHOOSE_CITY",
      cities: geo_cities
    }
  }));
});
/**
 * Load street view map for place user has chosen. Give instructions for
 * navigation using voice commands.
 */

app.handle("geo_city", function (conv) {
  // Place is available if user said the name of a city, country, or
  // landmark that is available.
  var city = geo_cities.find(function (element) {
    return conv.intent.params.answer.resolved.includes(element[0]) || conv.intent.params.answer.resolved.includes(element[1]) || conv.intent.params.answer.resolved.includes(element[2]);
  }); // If place is available, display it. Otherwise, let user choose a different
  // place.

  if (city == undefined) {
    conv.add("Sorry, we do not support that city.");
    conv.add(new Canvas());
    conv.scene.next.name = "geo_visit";
  } else {
    conv.add("To move, say forward or backward. To change directions, say " + "up, down, left, or right.");
    conv.add(new Canvas({
      data: {
        command: "GEO_CITY",
        lat: city[3],
        lng: city[4],
        heading: city[5]
      }
    }));
  }
});
/**
 * Shifts street view map up or down, turns it left or right, or moves it
 * forward or backward.
 */

app.handle("geo_move", function (conv) {
  switch (conv.intent.params.answer.resolved) {
    case "up":
      conv.add("Shifting up.");
      conv.add(new Canvas({
        data: {
          command: "GEO_UP"
        }
      }));
      break;

    case "down":
      conv.add("Shifting down.");
      conv.add(new Canvas({
        data: {
          command: "GEO_DOWN"
        }
      }));
      break;

    case "left":
      conv.add("Turning left.");
      conv.add(new Canvas({
        data: {
          command: "GEO_LEFT"
        }
      }));
      break;

    case "right":
      conv.add("Turning right.");
      conv.add(new Canvas({
        data: {
          command: "GEO_RIGHT"
        }
      }));
      break;

    case "forward":
      conv.add("Moving forward.");
      conv.add(new Canvas({
        data: {
          command: "GEO_FORWARD"
        }
      }));
      break;

    case "backward":
      conv.add("Moving backward.");
      conv.add(new Canvas({
        data: {
          command: "GEO_BACKWARD"
        }
      }));
  }
});
/**
 * Load results page displaying questions answered correctly and incorrectly.
 */

app.handle("geo_results", function (conv) {
  conv.add(new Canvas({
    data: {
      command: "GEO_SHOW_RESULTS",
      correct: conv.session.params.geo_correct,
      incorrect: conv.session.params.geo_incorrect
    }
  }));
});
/**
 * Check whether the answer is correct and display the corresponding message.
 */

app.handle("geo_check_answer", function (conv) {
  var answer = geo_functions.getCorrectAnswer(conv); // Store question as correct or incorrect based on user's last response.

  if (conv.session.params.geo_correct.includes(answer)) {
    geo_functions.removeElementByValue(conv.session.params.geo_correct, answer);
  } else if (conv.session.params.geo_incorrect.includes(answer)) {
    geo_functions.removeElementByValue(conv.session.params.geo_incorrect, answer);
  } // Remove question from question bank if user answered correctly.


  if (geo_functions.isCorrect(conv, answer)) {
    conv.session.params.geo_correct.push(answer);
    geo_functions.removeQuestion(conv);
    conv.session.params.geo_try = 0;
    conv.add("".concat(answer, " is correct!"));
  } else {
    conv.session.params.geo_incorrect.push(answer);

    if (conv.session.params.geo_try == 0) {
      conv.session.params.geo_try++;
      conv.add("Try again. It begins with the letter " + answer.charAt(0) + ".");
    } else {
      conv.session.params.geo_try = 0;
      conv.add("Sorry, that's incorrect. The correct answer is ".concat(answer, "."));
    }
  }

  conv.add(new Canvas());
});
/**
 * LANGUAGE SECTION
 */
// AOG Language Headers

var translation = require("./language/translation");

var imageAnalysis = require("./language/image_analysis");

var langGameState = require("./language/lang_game_state");

var search = require("./language/news");

var LANG_INSTRUCTIONS = "Hello user, you can open a new level or change questions.";
/**
 * Sets the Canvas for a webhook
 * @param {*} conv brings the actions SDK to the webapp
 * @param {*} convText is said to the user
 * @param {*} command updates the UI in action.js
 * @param {*} value that the UI should be updated to
 */

function langSetCanvas(conv, convText, command, value) {
  conv.add(new Canvas({
    data: {
      command: command,
      value: value
    }
  }));
  if (String(convText).length > 0) conv.add(convText);
}
/**
 * Stores the translated word to firebase
 * @param {*} userID of the user
 * @param {*} englishWord to store
 * @param {*} spanishWord to store
 */


function storeTranslatedWordsToFirebase(userID, englishWord, spanishWord) {
  var firestoreUser = admin.firestore().doc("AOGUsers/".concat(userID));
  firestoreUser.set({
    TranslatedWords: admin.firestore.FieldValue.arrayUnion({
      english: englishWord,
      spanish: spanishWord
    })
  }, {
    merge: true
  });
}
/**
 * Fallback handler for when an input is not matched
 */


app.handle("lang_fallback", function (conv) {
  conv.add("I don't understand. You can open a new level or change questions.");
  conv.add(new Canvas());
});
/**
 * Handler to start the language one pic one word section
 */

app.handle("lang_start_one_pic", function (conv) {
  if (conv.session.params.startedOnePic == undefined || conv.session.params.startedOnePic == false) {
    conv.add("Ok, starting one pic one word");
    conv.add("To play this game, please guess the english word shown by the picture.");
    conv.session.params.startedOnePic = true;
  }

  return imageAnalysis.imageAnalysis(true).then(function (value) {
    value.attempts = 10;
    conv.session.params.onePicHints = [];
    conv.session.params.onePicAnswer = value.word;
    conv.session.params.onePicAnswerTranslated = value.wordTranslated;
    conv.session.params.onePicAttemptsLeft = value.attempts;
    langSetCanvas(conv, "", "LANG_START_ONE_PIC", value);
  })["catch"](function (error) {
    console.log(error);
  });
});
/**
 * Handler to start the language one pic multiple words section
 */

app.handle("lang_start_multiple_words", function (conv) {
  conv.session.params.englishWordsGuessed = 0;
  conv.session.params.spanishWordsGuessed = 0;

  if (conv.session.params.startedMultipleWords == undefined || conv.session.params.startedMultipleWords == false) {
    conv.add("Ok, starting one pic multiple word");
    conv.add("To play this game, please guess several english words shown by the picture.");
    conv.session.params.startedMultipleWords = true;
  }

  return imageAnalysis.imageAnalysis(false).then(function (value) {
    value.attempts = 10;
    conv.session.params.multipleWordsHints = [];
    conv.session.params.multipleWordsAnswer = value.words;
    conv.session.params.multipleWordsAnswerTranslated = value.wordsTranslated;
    conv.session.params.multipleWordsAttemptsLeft = value.attempts;
    langSetCanvas(conv, "", "LANG_START_MULTIPLE_WORDS", value);
  })["catch"](function (error) {
    console.log(error);
  });
});
/**
 * Handler to manage the word the user guesses
 */

app.handle("lang_one_pic_answer", function _callee4(conv) {
  var word, userAnswer, correctAnswer, convText, value, attempts, _convText, _value, hints, randomIndex, _convText3, _value3, hint, i, _convText2, _value2, _convText4;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          word = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
          conv.add("Ok, let's see if ".concat(word, " is correct"));
          userAnswer = String(word);
          correctAnswer = String(conv.session.params.onePicAnswer);

          if (!(userAnswer.toLowerCase() == correctAnswer)) {
            _context4.next = 11;
            break;
          }

          convText = "That is correct! Try translating it to spanish";
          value = {
            word: correctAnswer,
            spanish: conv.session.params.onePicAnswerTranslated
          };
          langSetCanvas(conv, convText, "LANG_ONE_PIC_SHOW_ENGLISH", value);
          conv.scene.next.name = "lang_one_pic_translation";
          _context4.next = 39;
          break;

        case 11:
          conv.session.params.onePicAttemptsLeft--;
          attempts = conv.session.params.onePicAttemptsLeft;

          if (!(attempts == 0)) {
            _context4.next = 19;
            break;
          }

          _convText = "You have ran out of attempts. The correct answers are shown below.";
          _value = {
            english: conv.session.params.onePicAnswer,
            spanish: conv.session.params.onePicAnswerTranslated
          };
          langSetCanvas(conv, _convText, "LANG_ONE_PIC_SHOW_ANSWER", _value);
          _context4.next = 39;
          break;

        case 19:
          if (!(attempts % 2 == 0)) {
            _context4.next = 37;
            break;
          }

          hints = conv.session.params.onePicHints;
          randomIndex = Math.floor(Math.random() * correctAnswer.length);

          while (hints.includes(randomIndex) || correctAnswer.charAt(randomIndex) == " ") {
            randomIndex = Math.floor(Math.random() * correctAnswer.length);
          }

          conv.session.params.onePicHints.push(randomIndex);

          if (!(conv.session.params.onePicHints.length == correctAnswer.length)) {
            _context4.next = 30;
            break;
          }

          _convText3 = "You have ran out of hints. The correct english word is ".concat(correctAnswer, ". Try translating it to spanish");
          _value3 = {
            word: correctAnswer,
            spanish: conv.session.params.onePicAnswerTranslated,
            attempts: attempts
          };
          langSetCanvas(conv, _convText3, "LANG_ONE_PIC_SHOW_ENGLISH", _value3);
          conv.scene.next.name = "lang_one_pic_translation";
          return _context4.abrupt("return");

        case 30:
          hint = "".concat(correctAnswer, " : ");

          for (i = 0; i < correctAnswer.length; i++) {
            if (correctAnswer.charAt(i) == " ") {
              hint += "&nbsp&nbsp&nbsp&nbsp";
            } else if (conv.session.params.onePicHints.includes(i)) {
              hint += "".concat(correctAnswer.charAt(i), " ");
            } else {
              hint += "_ ";
            }
          }

          _convText2 = "That is incorrect! You can try again but here's a hint.";
          _value2 = {
            word: hint,
            scene: conv.scene.name,
            attempts: attempts
          };
          langSetCanvas(conv, _convText2, "LANG_ONE_PIC_SHOW_HINT", _value2);
          _context4.next = 39;
          break;

        case 37:
          _convText4 = "That is incorrect! Try again.";
          langSetCanvas(conv, _convText4, "LANG_ONE_PIC_UPDATE_ATTEMPTS", attempts);

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  });
});
/**
 * Handler to manage the word the user guesses
 */

app.handle("lang_multiple_words_answer", function _callee5(conv) {
  var word, userAnswer, correctAnswers, wordIndex, value, attempts, _convText5, _value4, hints, randomIndex, convText, _value5, _convText6;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          word = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
          conv.add("Ok, let's see if ".concat(word, " is correct"));
          userAnswer = String(word);
          correctAnswers = Array.from(conv.session.params.multipleWordsAnswer);
          wordIndex = correctAnswers.indexOf(userAnswer);

          if (wordIndex > -1) {
            conv.session.params.englishWordsGuessed++;

            if (conv.session.params.englishWordsGuessed == correctAnswers.length) {
              conv.add("Sweet! Try translating these words to spanish");
              conv.session.params.multipleWordsHints = [];
              conv.scene.next.name = "lang_multiple_words_translation";
            } else {
              conv.add("That is a correct word");
            }

            value = {
              word: correctAnswers[wordIndex],
              index: wordIndex,
              showSpanish: conv.session.params.englishWordsGuessed == correctAnswers.length,
              spanishWords: conv.session.params.multipleWordsAnswerTranslated
            };
            langSetCanvas(conv, "", "LANG_MULTIPLE_WORDS_SHOW_ENGLISH", value);
          } else {
            conv.session.params.multipleWordsAttemptsLeft--;
            attempts = conv.session.params.multipleWordsAttemptsLeft;

            if (attempts == 0) {
              _convText5 = "You have ran out of attempts. The correct answers are shown below.";
              _value4 = {
                english: conv.session.params.multipleWordsAnswer,
                spanish: conv.session.params.multipleWordsAnswerTranslated
              };
              langSetCanvas(conv, _convText5, "LANG_MULTIPLE_WORDS_SHOW_ANSWER", _value4);
            } else if (attempts % 2 == 0) {
              conv.session.params.englishWordsGuessed++;
              hints = conv.session.params.multipleWordsHints;
              randomIndex = Math.floor(Math.random() * 3);

              while (hints.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * 3);
              }

              conv.session.params.multipleWordsHints.push(randomIndex);
              convText = "";

              if (conv.session.params.multipleWordsHints.length == 3) {
                convText = "You have ran out of english hints. The correct english words are shown below. Try translating them to spanish";
                conv.session.params.multipleWordsHints = [];
                conv.scene.next.name = "lang_multiple_words_translation";
              } else {
                convText = "That is incorrect! You can try again but here's a hint.";
              }

              _value5 = {
                word: correctAnswers[randomIndex],
                index: randomIndex,
                showSpanish: conv.session.params.multipleWordsHints.length == 3,
                spanishWords: conv.session.params.multipleWordsAnswerTranslated
              };
              langSetCanvas(conv, convText, "LANG_MULTIPLE_WORDS_SHOW_ENGLISH", _value5);
            } else {
              _convText6 = "That is incorrect! Try again.";
              langSetCanvas(conv, _convText6, "LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS", attempts);
            }
          }

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
/**
 * Handler to manage to spanish input from the user
 */

app.handle("lang_one_pic_answer_translation", function (conv) {
  var word = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
  conv.add("Ok, let's see if ".concat(word, " is correct"));
  var userAnswer = String(word);
  var userID = conv.user.params.uid;
  var englishAnswer = conv.session.params.onePicAnswer;
  var correctAnswer = conv.session.params.onePicAnswerTranslated;

  if (userAnswer.toLowerCase() == correctAnswer) {
    var convText = "That is correct! You can say \"Next Question\" to see something else or \"Questions\" to go back to the main menu.";
    langSetCanvas(conv, convText, "LANG_ONE_PIC_SHOW_SPANISH", correctAnswer);
    storeTranslatedWordsToFirebase(userID, englishAnswer, correctAnswer);
  } else {
    conv.session.params.onePicAttemptsLeft--;
    var attempts = conv.session.params.onePicAttemptsLeft;

    if (attempts == 0) {
      var _convText7 = "You have ran out of attempts. The correct answers are shown below.";
      var value = {
        english: conv.session.params.onePicAnswer,
        spanish: conv.session.params.onePicAnswerTranslated
      };
      langSetCanvas(conv, _convText7, "LANG_ONE_PIC_SHOW_ANSWER", value);
    } else if (attempts % 2 == 0) {
      var hints = conv.session.params.onePicHints;
      var randomIndex = Math.floor(Math.random() * correctAnswer.length);

      while (hints.includes(randomIndex) || correctAnswer.charAt(randomIndex) == " ") {
        randomIndex = Math.floor(Math.random() * correctAnswer.length);
      }

      conv.session.params.onePicHints.push(randomIndex);

      if (conv.session.params.onePicHints.length == correctAnswer.length) {
        var _convText9 = "You have ran out of hints. The correct spanish word is ".concat(correctAnswer, ". Try translating it to spanish");

        var _value7 = {
          word: correctAnswer,
          attempts: attempts
        };
        langSetCanvas(conv, _convText9, "LANG_ONE_PIC_SHOW_SPANISH", _value7);
        return;
      }

      var hint = "".concat(correctAnswer, " : ");

      for (var i = 0; i < correctAnswer.length; i++) {
        if (correctAnswer.charAt(i) == " ") {
          hint += "&nbsp&nbsp&nbsp&nbsp";
        } else if (conv.session.params.onePicHints.includes(i)) {
          hint += "".concat(correctAnswer.charAt(i), " ");
        } else {
          hint += "_ ";
        }
      }

      var _convText8 = "That is incorrect! You can try again but here's a hint.";
      var _value6 = {
        word: hint,
        scene: conv.scene.name,
        attempts: attempts
      };
      langSetCanvas(conv, _convText8, "LANG_ONE_PIC_SHOW_HINT", _value6);
    } else {
      var _convText10 = "That is incorrect! Try again.";
      langSetCanvas(conv, _convText10, "LANG_ONE_PIC_UPDATE_ATTEMPTS", attempts);
    }
  }
});
/**
 * Handler to manage to spanish input from the user
 */

app.handle("lang_multiple_words_answer_translation", function (conv) {
  var word = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
  conv.add("Ok, let's see if ".concat(word, " is correct"));
  var userAnswer = String(word);
  var userID = conv.user.params.uid;
  var spanishAnswers = Array.from(conv.session.params.multipleWordsAnswerTranslated);
  var englishAnswers = Array.from(conv.session.params.multipleWordsAnswer);
  var wordIndex = spanishAnswers.indexOf(userAnswer);

  if (wordIndex > -1) {
    conv.session.params.spanishWordsGuessed++;

    if (conv.session.params.spanishWordsGuessed == spanishAnswers.length) {
      conv.add("You've got them all! You can say \"Next Question\" to see something else or \"Questions\" to go back to the main menu.");
    } else {
      conv.add("That is a correct word");
    }

    var value = {
      word: spanishAnswers[wordIndex],
      index: wordIndex
    };
    langSetCanvas(conv, "", "LANG_MULTIPLE_WORDS_SHOW_SPANISH", value);
    storeTranslatedWordsToFirebase(userID, englishAnswers[wordIndex], spanishAnswers[wordIndex]);
  } else {
    conv.session.params.multipleWordsAttemptsLeft--;
    var attempts = conv.session.params.multipleWordsAttemptsLeft;

    if (attempts == 0) {
      var _convText11 = "You have ran out of attempts. The correct answers are shown below.";
      var _value8 = {
        english: conv.session.params.multipleWordsAnswer,
        spanish: conv.session.params.multipleWordsAnswerTranslated
      };
      langSetCanvas(conv, _convText11, "LANG_MULTIPLE_WORDS_SHOW_ANSWER", _value8);
    } else if (attempts % 2 == 0) {
      conv.session.params.spanishWordsGuessed++;
      var hints = conv.session.params.multipleWordsHints;
      var randomIndex = Math.floor(Math.random() * 3);

      while (hints.includes(randomIndex)) {
        randomIndex = Math.floor(Math.random() * 3);
      }

      conv.session.params.multipleWordsHints.push(randomIndex);
      var convText = "";

      if (conv.session.params.multipleWordsHints.length == 3) {
        convText = "You have ran out of spanish hints. The correct spanish words are shown below.";
      } else {
        convText = "That is incorrect! You can try again but here's a hint.";
      }

      var _value9 = {
        word: spanishAnswers[randomIndex],
        index: randomIndex
      };
      langSetCanvas(conv, convText, "LANG_MULTIPLE_WORDS_SHOW_SPANISH", _value9);
    } else {
      var _convText12 = "That is incorrect! Try again.";
      langSetCanvas(conv, _convText12, "LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS", attempts);
    }
  }
});
/**
 * Handler to start the next question
 */

app.handle("lang_next_question", function (conv) {
  conv.add("Ok, starting next question");

  if (conv.scene.name == "lang_one_pic" || conv.scene.name == "lang_one_pic_translation") {
    conv.scene.next.name = "lang_one_pic";
  } else if (conv.scene.name == "lang_multiple_words" || conv.scene.name == "lang_multiple_words_translation") {
    conv.scene.next.name = "lang_multiple_words";
  }
});
/**
 * Handler to return to the main menu
 */

app.handle("lang_change_game", function (conv) {
  conv.add("Ok, returning to the main menu.");

  if (conv.scene.name == "lang_one_pic" || conv.scene.name == "lang_one_pic_translation") {
    conv.session.params.startedOnePic = false;
  } else if (conv.scene.name == "lang_multiple_words" || conv.scene.name == "lang_multiple_words_translation") {
    conv.session.params.startedMultipleWords = false;
  }

  langSetCanvas(conv, "", "LANG_MENU", conv.scene.name);
});
/**
 * Conversation Section
 */

var salutationsIndex = {
  HOW_ARE_YOU: 0,
  WHERE_ARE_YOU_FROM: 1,
  CAREER: 2,
  COUNTRIES_VISITED: 3,
  NUM_OF_PEOPLE_LIVED_WITH: 4,
  FAVORITE_FOOD: 5,
  HOBBIES: 6,
  SCHOOL_ATTENDED: 7
};
var salutations = {
  HOW_ARE_YOU: {
    english: "How are you",
    spanish: "Estoy",
    example: "Estoy muy bien"
  },
  WHERE_ARE_YOU_FROM: {
    english: "Where are you from",
    spanish: "Soy de",
    example: "Soy de Jamaica"
  },
  CAREER: {
    english: "What do you want to be in the future",
    spanish: "Quiero ser",
    example: "Quiero ser mecanico"
  },
  COUNTRIES_VISITED: {
    english: "Which countries have you visited",
    spanish: "He estado en",
    example: "He estado en estados unidos, canadá y mexico"
  },
  NUM_OF_PEOPLE_LIVED_WITH: {
    english: "How many people do you live with",
    spanish: "Vivo con",
    example: "Vivo con cinco personas"
  },
  FAVORITE_FOOD: {
    english: "What is your favorite food",
    spanish: "Mi comida favorita",
    example: "Mi comida favorita son los plátanos"
  },
  HOBBIES: {
    english: "What are your hobbies",
    spanish: "Mis pasatiempos son",
    example: "Mis pasatiempos son jugar futbol y videojuegos"
  },
  SCHOOL_ATTENDED: {
    english: "Which school do you attend",
    spanish: "Asisto a",
    example: "Asisto a Williams College"
  }
};
/**
 * Handler to welcome the user to the conversation section
 */

app.handle("lang_conversation_welcome", function (conv) {
  var date = new Date();
  var greeting;

  if (date.getHours() < 12) {
    greeting = "Buenos d\xEDas";
  } else if (date.getHours() >= 12 && date.getHours() < 17) {
    greeting = "Buenas tardes";
  } else {
    greeting = "Buena noches";
  }

  var message = "".concat(greeting, " ").concat(conv.user.params.tokenPayload.given_name, ", c\xF3mo estas.");
  var value = {
    sender: true,
    text: message
  };
  conv.session.params.salutation = salutations.HOW_ARE_YOU;
  conv.session.params.salutationsIndex = salutationsIndex.HOW_ARE_YOU;
  langSetCanvas(conv, message, "LANG_START_CONVERSATION", value);
});
/**
 * Handler to manage the responses by the user during the conversation
 */

app.handle("lang_conversation_response", function (conv) {
  var word = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
  var salutation = conv.session.params.salutationsIndex;

  if (salutation == salutationsIndex.HOW_ARE_YOU) {
    howAreYou(conv, word);
  } else {}
});
var GOOD_WELCOME = ["estupendo", "muy bien", "así así"];
var BAD_WELCOME = ["mal", "fatal", "exhausto"];

function howAreYou(conv, word) {
  var senderMessage;

  if (GOOD_WELCOME.includes(word)) {
    senderMessage = "Estoy feliz de escuchar eso. De d\xF3nde eres?";
  } else if (BAD_WELCOME.includes(word)) {
    senderMessage = "Siento o\xEDr eso. De d\xF3nde eres?";
  } else {
    senderMessage = "Vale, se d\xF3nde eres?";
  }

  conv.session.params.salutation = salutations.WHERE_ARE_YOU_FROM;
  conv.session.params.salutationsIndex = salutationsIndex.WHERE_ARE_YOU_FROM;
  var value = {
    senderMessage: senderMessage,
    receiverMessage: conv.intent.query,
    receiverImage: conv.user.params.tokenPayload.picture
  };
  langSetCanvas(conv, senderMessage, "LANG_ADD_CONVERSATION_MESSAGE", value);
}
/**
 * Handler to translate the word that the user requested
 */


app.handle("lang_conversation_translate", function (conv) {
  var translationRequest = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
  return translation.translateFunction(translationRequest).then(function (translatedText) {
    var senderMessage = "The translation is: " + translatedText;
    var value = {
      senderMessage: senderMessage,
      receiverMessage: conv.intent.query,
      receiverImage: conv.user.params.tokenPayload.picture
    };
    langSetCanvas(conv, senderMessage, "LANG_ADD_CONVERSATION_MESSAGE", value);
  })["catch"](function (error) {
    return console.log(error);
  });
});
/**
 * Handler to search up the results that the user requested
 */

app.handle("lang_conversation_search", function (conv) {
  var query = conv.intent.params.lang_words ? conv.intent.params.lang_words.resolved : null;
  return search.searchFunction(query).then(function (results) {
    var senderMessage = "Here is a result of your searches. Please select a article number below to learn more about it.";
    var value = {
      senderMessage: senderMessage,
      receiverMessage: conv.intent.query,
      receiverImage: conv.user.params.tokenPayload.picture,
      results: results
    };
    conv.session.params.search_results = results;
    langSetCanvas(conv, senderMessage, "LANG_ADD_CONVERSATION_SEARCH_MESSAGE", value);
  })["catch"](function (error) {
    return console.log(error);
  });
});
/**
 * Handler to read the article number requested by the user
 */

app.handle("lang_conversation_article", function (conv) {
  var articleNumber = conv.intent.params.article_number ? conv.intent.params.article_number.resolved : null;
  var senderMessage = "Okay opening article ".concat(articleNumber);
  var results = conv.session.params.search_results;
  var article = results[articleNumber - 1];
  var words = article.description.split(".");
  senderMessage += ". " + words[0];
  conv.session.params.search_results_description = words[0];
  var value = {
    senderMessage: senderMessage,
    receiverMessage: conv.intent.query,
    receiverImage: conv.user.params.tokenPayload.picture
  };
  langSetCanvas(conv, senderMessage, "LANG_ADD_CONVERSATION_MESSAGE", value);
});
/**
 * Handler to translate the article number requested by the user
 */

app.handle("lang_conversation_article_translate", function (conv) {
  var description = conv.session.params.search_results_description;
  return translation.translateFunction(conv.session.params.search_results_description).then(function (translatedText) {
    var senderMessage = "The translated text is: " + translatedText;
    var value = {
      senderMessage: senderMessage,
      receiverMessage: conv.intent.query,
      receiverImage: conv.user.params.tokenPayload.picture
    };
    langSetCanvas(conv, senderMessage, "LANG_ADD_CONVERSATION_MESSAGE", value);
  })["catch"](function (error) {
    return console.log(error);
  });
});
/**
 * Translate the current message shown to the user
 */

app.handle("lang_conversation_help", function (conv) {
  var salutation = conv.session.params.salutation;
  senderMessage = "This translation is ".concat(salutation.english, ". You typically start with ").concat(salutation.spanish, " followed by your answer. For example, ").concat(salutation.example);
  var value = {
    senderMessage: senderMessage,
    receiverMessage: conv.intent.query,
    receiverImage: conv.user.params.tokenPayload.picture
  };
  langSetCanvas(conv, senderMessage, "LANG_ADD_CONVERSATION_MESSAGE", value);
});
/**
 * Starts the vocab section of the app
 */

app.handle("lang_start_vocab", function (conv) {
  var userID = conv.user.params.uid;
  var firestoreUser = admin.firestore().doc("AOGUsers/".concat(userID));
  return firestoreUser.get().then(function (value) {
    var words = value.data()["TranslatedWords"];
    langSetCanvas(conv, "Okay, fetching translated word", "LANG_VOCAB", words);
  });
});
app.handle("lang_instructions", function (conv) {
  conv.add(INSTRUCTIONS);
  conv.add(new Canvas());
}); //////////////////////////////////////////////

/*
    Reading Action Handlers
*/

var Diff = require("diff");

var database = require("./reading/reformattedX.json");

app.handle("read_fallback", function (conv) {
  conv.add("I don't understand, please repeat yourself.");
  conv.add(new Canvas());
});
app.handle("read_bookSelected", function (conv) {
  //Selection of a book from the library scene
  var bookTitle = toTitleCase(conv.session.params.bookTitle); //user input

  if (conv.user.params[bookTitle] == undefined || conv.user.params[bookTitle]["chunk"] == undefined) {
    //define key value pair if it doesnt exist
    conv.user.params[bookTitle] = {
      chunk: 0,
      size: database[bookTitle]["Text"].length
    };
  }

  conv.user.params.currentBook = bookTitle;
  var text = getText(conv);
  checkForchapter(conv, text);
  conv.add(new Canvas({
    data: {
      command: "READ_BOOK_SELECTED",
      text: text
    }
  }));
});
app.handle("read_analyseUserInput", function (conv) {
  var bookTitle = conv.user.params.currentBook;
  var chunk = conv.user.params[bookTitle]["chunk"];
  var bookText = database[bookTitle]["Text"][chunk]; //An Array of Sentences

  var userInput = splitIntoSentences(conv.session.params.userInput); //split by puncuation

  var response = analyseText(bookText, userInput);

  if (response.assistantOutput != "") {
    conv.add(new Canvas({
      data: {
        command: "READ_TEXT_FEEDBACK",
        words: response.words,
        ranges: response.ranges
      }
    }));
    var ssml = "<speak><mark name=\"OK\"/>".concat(response.assistantOutput, "<mark name=\"FIN\"/></speak>");
    conv.add(ssml);
  } else {
    //go next logic
    conv.user.params[bookTitle]["chunk"] += 1;
    var text = getText(conv);
    conv.add(new Canvas({
      data: {
        command: "READ_CHANGE_TEXT",
        text: text
      }
    })); //audio feedback + google requires some text in an ssml object, so we add "filler text" to the audio tag

    var _ssml = "<speak>\n          <audio src=\"https://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg\">text\n          </audio>\n        </speak>";
    conv.add(_ssml);
  }
});
app.handle("read_openLibrary", function (conv) {
  //scene progression handled by AOG GOTO_LIBRARY intent
  var progress = [];
  var keys = Object.keys(database);

  for (i in keys) {
    var title = keys[i];
    var chunkNumber = getProgress(title, conv);
    progress.push(chunkNumber);
  }

  conv.user.params.currentBook = null;
  conv.add(new Canvas({
    data: {
      command: "READ_OPEN_LIBRARY",
      progress: progress
    }
  }));
});
app.handle("read_nextChunk", function (conv) {
  //scene progression handled by AOG NEXT intent
  var bookTitle = conv.user.params.currentBook;
  conv.user.params[bookTitle]["chunk"] += 1; //increment page

  var text = getText(conv); //send appropriate response based on user's position in the book

  conv.add(new Canvas({
    data: {
      command: "READ_CHANGE_TEXT",
      text: text
    }
  }));
  checkForchapter(conv, text);
});
app.handle("read_restartBook", function (conv) {
  var bookTitle = conv.user.params.currentBook;
  conv.user.params[bookTitle]["chunk"] = 0; //setting the chunk number to 0

  conv.scene.next.name = "READ_TEXT";
  var text = getText(conv);
  conv.add(new Canvas({
    data: {
      command: "READ_CHANGE_TEXT",
      text: text
    }
  }));
  checkForchapter(conv, text);
});

function getProgress(title, conv) {
  if (conv.user.params[title] != undefined && conv.user.params[title]["chunk"] != undefined) {
    return conv.user.params[title]["chunk"] / conv.user.params[title]["size"]; //percentage
  } else {
    return 0;
  }
}

function getText(conv) {
  var bookTitle = conv.user.params.currentBook;
  var _conv$user$params$boo = conv.user.params[bookTitle],
      chunk = _conv$user$params$boo.chunk,
      size = _conv$user$params$boo.size;
  var text = "";

  if (chunk >= size) {
    text = "The End.";
    conv.add("You can Reread this book or Go Back To The Library to find a new book.");
    conv.scene.next.name = "READ_FINISH";
  } else {
    var temp = database[bookTitle]["Text"][chunk];

    for (var _i = 0; _i < temp.length; _i++) {
      text = text + temp[_i] + " ";
    }
  }

  return text;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
} //assumes book paragraph and userParagraph are arrays of sentences


function analyseText(bookParagraph, userParagraph) {
  var wordsWrong = [];
  var sentencesWrong = [];
  var apostropheDictionary = {};

  for (var _i2 = 0; _i2 < bookParagraph.length; _i2++) {
    if (_i2 >= userParagraph.length) {
      //if true, the user did not say this sentence and will be considered wrong
      sentencesWrong.push(_i2);
    } else {
      var apos = bookParagraph[_i2].match(/[\w]\w*'\w*/gm); //captures all words with an apostrophe


      if (apos != null) {
        for (var y = 0; y < apos.length; y++) {
          var key = apos[y].replace(/'/gm, "");
          apostropheDictionary[key] = apos[y]; //key value pairs-> hes : he's
        }
      }

      var bookText = removeMarks(stripPunctuation(bookParagraph[_i2])).trim();
      var userText = removeMarks(stripPunctuation(userParagraph[_i2])).trim();
      var analysis = Diff.diffWords(bookText, userText, {
        ignoreCase: true
      });
      var toggle = false;

      for (var j = 0; j < analysis.length; j++) {
        //if user adds a word, we cant highlight that word on the screen so no
        //need to pass it into the wrong words array, just mark the sentence as wrong as compensation
        if (analysis[j].removed) {
          wordsWrong.push(analysis[j].value.trim());
          toggle = true;
        }
      }

      if (toggle) {
        sentencesWrong.push(_i2); //at least one wrong word in the sentence makes the entire sentence wrong
      }
    }
  }

  var sentenceRanges = [];

  for (var _i3 = 0; _i3 < sentencesWrong.length; _i3++) {
    var ans = findRange(bookParagraph, sentencesWrong[_i3]);
    sentenceRanges.push(ans);
  } //condenses book paragraph into one string, to easily index the paragraph


  var bookCollapsed = "";

  for (var _i4 = 0; _i4 < bookParagraph.length; _i4++) {
    bookCollapsed += bookParagraph[_i4];
  } //combine wrong sentences into one string so the assistant can read it


  var recompile = "";

  for (var x = 0; x < sentenceRanges.length; x++) {
    var _ans = sentenceRanges[x];

    for (var k = _ans.start; k < _ans.start + _ans.chars; k++) {
      recompile += bookCollapsed.charAt(k);
    }
  }

  for (var _i5 = 0; _i5 < wordsWrong.length; _i5++) {
    if (apostropheDictionary.hasOwnProperty(wordsWrong[_i5])) {
      wordsWrong[_i5] = apostropheDictionary[wordsWrong[_i5]]; //replacing hes with he's for example
    }
  }

  var responseJSON = {
    ranges: sentenceRanges,
    words: wordsWrong,
    assistantOutput: recompile
  };
  return responseJSON;
} //given a paragraph, and a sentence number(index), return the starting index of the sentence and its length


function findRange(para, index) {
  //calculate the starting index of the given sentence by summing the length of all previous sentences.
  var startIndex = 0;

  for (var j = index - 1; j >= 0; j--) {
    startIndex += para[j].length;
  }

  var length = para[index].length;
  var ans = {
    start: startIndex,
    length: 0,
    chars: length
  };
  return ans;
}

function removeMarks(str) {
  return str.replace(/(?<=(mr|Mr|Ms|md|Md|Dr|dr|mrs|Mrs|Sr|Jr|jr|sr))\./g, "").replace(/\./, ". ");
}

function stripPunctuation(str) {
  return str.replace(/[,\/#!$%\^&\*;:'"{}=\_`~()]/g, "").replace(/-/g, " ");
}

function splitIntoSentences(str) {
  if (/[^.?!]+[.!?]+[\])'"`’”]*/g.test(str)) {
    //prevent null return on .match() call
    var split = str.replace(/(?<=(mr|Mr|Ms|md|Md|Dr|dr|mrs|Mrs|Sr|Jr|jr|sr))\./g, "@").match(/[^.?!]+[.!?]+[\])'"`’”]*/g);

    for (var _i6 = 0; _i6 < split.length; _i6++) {
      split[_i6] = split[_i6].replace(/\@/g, ".");
    }

    return split;
  } else {
    return [str];
  }
}

function checkForchapter(conv, text) {
  var bookTitle = conv.user.params.currentBook;

  if (/^CHAPTER/gi.test(text) || conv.user.params[bookTitle]["chunk"] == 0) {
    //if this chunk is a new chapter
    var ssml = "<speak><mark name=\"CHAP\"/>".concat(text, "<mark name=\"ENDCHAP\"/></speak>");
    conv.add(ssml);
  }
}

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);