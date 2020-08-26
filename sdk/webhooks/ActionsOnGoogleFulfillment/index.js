const { conversation, Canvas } = require("@assistant/conversation");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const INSTRUCTIONS = "Hello user, This is AOG Education.";

const app = conversation({ debug: true });

/**
 * AOG Education Global Handlers
 */
app.handle("welcome", (conv) => {
  if (!conv.device.capabilities.includes("INTERACTIVE_CANVAS")) {
    conv.add("Sorry, this device does not support Interactive Canvas!");
    conv.scene.next.name = "actions.page.END_CONVERSATION";
    return;
  }
  conv.add("Welcome User, thank you for choosing AOG Education");
  conv.add(
    new Canvas({
      url: "https://step-capstone.web.app",
    })
  );
});

app.handle("empty", (conv) => {
    conv.add(new Canvas());
});

app.handle("fallback", (conv) => {
  conv.add(`I don't understand. Ask for help to get assistance.`);
  conv.add(new Canvas());
});

app.handle("aog_instructions", (conv) => {
  conv.add(INSTRUCTIONS);
  conv.add(new Canvas());
});

app.handle("aog_main_menu_selection", (conv) => {
  const selection = conv.intent.params.selection
    ? conv.intent.params.selection.resolved
    : null;
  conv.add(`Ok, starting ${selection}.`);

  if (selection == "language") {
    conv.add(
      new Canvas({
        data: {
          command: "AOG_MAIN_MENU_SELECTION",
          selection: selection,
        },
      })
    );
    conv.scene.next.name = "lang_menu";
  }

  if (selection == "geography") {
    conv.add(
      new Canvas({
        data: {
          command: "AOG_MAIN_MENU_SELECTION",
          selection: selection,
        },
      })
    );
    conv.scene.next.name = "geo_menu";
  }

  if (selection == "reading") {
    let books = [];
    let keys = Object.keys(database);
    for (i in keys) {
      let imgSrc = database[keys[i]]["Image"];
      let title = keys[i];
      let book = { imgSrc, title };
      books.push(book);
    }

    conv.add(
      new Canvas({
        data: {
          command: "READ_WRITE_TO_LIBRARY",
          books: books,
        },
      })
    );
    conv.scene.next.name = "READ_LIBRARY";
  }
});

/**
 * GEOGRAPHY SECTION
 */

// Load functions and state coordinates data.
const geo_functions = require("./geography/functions");
const geo_state_coords_file = require("./geography/state_coords");
const geo_cities_file = require("./geography/cities");
const geo_state_coords = geo_state_coords_file.stateCoords;
const geo_cities = geo_cities_file.cities;

app.handle("geo_setup", (conv) => {
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
app.handle("geo_us_capital", (conv) => {
    conv.session.params.geo_category = "US_CAPITAL";
    geo_functions.getQuestion(conv);
    conv.add(`What is the capital of ${conv.session.params.geo_name}?`);
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
app.handle("geo_world_capital", (conv) => {
    conv.session.params.geo_category = "WORLD_CAPITAL";
    geo_functions.getQuestion(conv);
    conv.add(`What is the capital of ${conv.session.params.geo_name}?`);
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
app.handle("geo_state", (conv) => {
    conv.session.params.geo_category = "STATE";
    geo_functions.getQuestion(conv);
    conv.add("What is the state pictured?");
    conv.add(
        new Canvas({
        data: {
            command: "GEO_LOAD_STATE_MAP",
            coords: geo_state_coords[conv.session.params.geo_name],
        },
        })
    );
});

/**
 * Ask country question and load the country map in question.
 */
app.handle("geo_country", (conv) => {
    conv.session.params.geo_category = "COUNTRY";
    geo_functions.getQuestion(conv);
    conv.add("What is the country pictured?");
    conv.add(
        new Canvas({
        data: {
            command: "GEO_LOAD_COUNTRY_MAP",
            country: conv.session.params.geo_name,
            region: conv.session.params.geo_region,
        },
        })
    );
});

/**
 * Have user choose a place to visit.
 */
app.handle("geo_choose_city", (conv) => {
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
app.handle("geo_city", (conv) => {
    // Place is available if user said the name of a city, country, or
    // landmark that is available.
    let city = geo_cities.find(element =>
        conv.intent.params.answer.resolved.includes(element[0]) ||
        conv.intent.params.answer.resolved.includes(element[1]) ||
        conv.intent.params.answer.resolved.includes(element[2]));

    // If place is available, display it. Otherwise, let user choose a different
    // place.
    if (city == undefined) {
        conv.add("Sorry, we do not support that city.");
        conv.add(new Canvas());
        conv.scene.next.name = "geo_visit";
    } else {
        conv.add("To move, say forward or backward. To change directions, say "+
                "up, down, left, or right.");
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
app.handle("geo_move", (conv) => {
    switch (conv.intent.params.answer.resolved) {
        case "up":
            conv.add("Shifting up.");
            conv.add(new Canvas({ data: { command: "GEO_UP" } }));
            break;
        case "down":
            conv.add("Shifting down.");
            conv.add(new Canvas({ data: { command: "GEO_DOWN" } }));
            break;
        case "left":
            conv.add("Turning left.");
            conv.add(new Canvas({ data: { command: "GEO_LEFT" } }));
            break;
        case "right":
            conv.add("Turning right.");
            conv.add(new Canvas({ data: { command: "GEO_RIGHT" } }));
            break;
        case "forward":
            conv.add("Moving forward.");
            conv.add(new Canvas({ data: { command: "GEO_FORWARD" } }));
            break;
        case "backward":
            conv.add("Moving backward.");
            conv.add(new Canvas({ data: { command: "GEO_BACKWARD" } }));
    }
});

/**
 * Load results page displaying questions answered correctly and incorrectly.
 */
app.handle("geo_results", (conv) => {
    conv.add(
        new Canvas({
        data: {
            command: "GEO_SHOW_RESULTS",
            correct: conv.session.params.geo_correct,
            incorrect: conv.session.params.geo_incorrect,
        },
        })
    );
});

/**
 * Check whether the answer is correct and display the corresponding message.
 */
app.handle("geo_check_answer", (conv) => {
    const answer = geo_functions.getCorrectAnswer(conv);

    // Store question as correct or incorrect based on user's last response.
    if (conv.session.params.geo_correct.includes(answer)) {
        geo_functions.removeElementByValue(conv.session.params.geo_correct, answer);
    } else if (conv.session.params.geo_incorrect.includes(answer)) {
        geo_functions.removeElementByValue(conv.session.params.geo_incorrect, answer);
    }

    // Remove question from question bank if user answered correctly.
    if (geo_functions.isCorrect(conv, answer)) {
        conv.session.params.geo_correct.push(answer);
        geo_functions.removeQuestion(conv);
        conv.session.params.geo_try = 0;
        conv.add(`${answer} is correct!`);
    } else {
        conv.session.params.geo_incorrect.push(answer);
        if (conv.session.params.geo_try == 0) {
            conv.session.params.geo_try++;
            conv.add("Try again. It begins with the letter " + answer.charAt(0) + ".");
        } else {
            conv.session.params.geo_try = 0;
            conv.add(`Sorry, that's incorrect. The correct answer is ${answer}.`);
        }
    }
    conv.add(new Canvas());
});

/**
 * LANGUAGE SECTION
 */

// AOG Language Headers
const translation = require("./language/translation");
const imageAnalysis = require("./language/image_analysis");
const langGameState = require("./language/lang_game_state");

const LANG_INSTRUCTIONS =
  "Hello user, you can open a new level or change questions.";

/**
 * Sets the Canvas for a webhook
 * @param {*} conv brings the actions SDK to the webapp
 * @param {*} convText is said to the user
 * @param {*} command updates the UI in action.js
 * @param {*} value that the UI should be updated to
 */
function langSetCanvas(conv, convText, command, value) {
  if (String(convText).length > 0) conv.add(convText);

  conv.add(
    new Canvas({
      data: {
        command: command,
        value: value,
      },
    })
  );
}

/**
 * Stores the translated word to firebase
 * @param {*} userID of the user
 * @param {*} englishWord to store
 * @param {*} spanishWord to store
 */
function storeTranslatedWordsToFirebase(userID, englishWord, spanishWord) {
  const firestoreUser = admin.firestore().doc(`AOGUsers/${userID}`);
  firestoreUser.set(
    {
      TranslatedWords: admin.firestore.FieldValue.arrayUnion({
        english: englishWord,
        spanish: spanishWord,
      }),
    },
    { merge: true }
  );
}

/**
 * Welcomes the user to the language section of the app.
 */
app.handle("lang_welcome", (conv) => {
  if (!conv.device.capabilities.includes("INTERACTIVE_CANVAS")) {
    conv.add("Sorry, this device does not support Interactive Canvas!");
    conv.scene.next.name = "actions.page.END_CONVERSATION";
    return;
  }
  conv.add(
    `Hi, ${conv.user.params.tokenPayload.given_name} Welcome to the AOG Education language section. Please choose a game from the menu below.`
  );
  conv.add(
    new Canvas({
      url: `https://gaurnett-aog-game-e3c26.web.app`,
    })
  );
});

/**
 * Fallback handler for when an input is not matched
 */
app.handle("lang_fallback", (conv) => {
  conv.add(`I don't understand. You can open a new level or change questions.`);
  conv.add(new Canvas());
});

/**
 * Handler to start the language one pic one word section
 */
app.handle("lang_start_one_pic", (conv) => {
  if (
    conv.session.params.startedOnePic == undefined ||
    conv.session.params.startedOnePic == false
  ) {
    conv.add(`Ok, starting one pic one word`);
    conv.add(
      `To play this game, please guess the english word shown by the picture.`
    );
    conv.session.params.startedOnePic = true;
  }

  return imageAnalysis
    .imageAnalysis(true)
    .then((value) => {
      value.attempts = 5;
      conv.session.params.onePicAnswer = value.word;
      conv.session.params.onePicAnswerTranslated = value.wordTranslated;
      conv.session.params.onePicAttemptsLeft = value.attempts;
      langSetCanvas(conv, "", "LANG_START_ONE_PIC", value);
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * Handler to start the language one pic multiple words section
 */
app.handle("lang_start_multiple_words", (conv) => {
  conv.session.params.englishWordsGuessed = 0;
  conv.session.params.spanishWordsGuessed = 0;
  if (
    conv.session.params.startedMultipleWords == undefined ||
    conv.session.params.startedMultipleWords == false
  ) {
    conv.add(`Ok, starting one pic multiple word`);
    conv.add(
      `To play this game, please guess several english words shown by the picture.`
    );
    conv.session.params.startedMultipleWords = true;
  }

  return imageAnalysis
    .imageAnalysis(false)
    .then((value) => {
      value.attempts = 5;
      conv.session.params.multipleWordsAnswer = value.words;
      conv.session.params.multipleWordsAnswerTranslated = value.wordsTranslated;
      conv.session.params.multipleWordsAttemptsLeft = value.attempts;
      langSetCanvas(conv, "", "LANG_START_MULTIPLE_WORDS", value);
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * Handler to manage the word the user guesses
 */
app.handle("lang_one_pic_answer", async (conv) => {
  const word = conv.intent.params.lang_words
    ? conv.intent.params.lang_words.resolved
    : null;

  console.log("Intent = " + String(conv.intent.params));
  conv.add(`Ok, let's see if ${word} is correct`);

  const userAnswer = String(word);
  const correctAnswer = conv.session.params.onePicAnswer;

  if (userAnswer.toLowerCase() == correctAnswer) {
    const convText = `That is correct! Try translating it to spanish`;
    const value = {
      word: correctAnswer,
      spanish: conv.session.params.onePicAnswerTranslated,
    };
    langSetCanvas(conv, convText, "LANG_ONE_PIC_SHOW_ENGLISH", value);
    conv.scene.next.name = "lang_one_pic_translation";
  } else {
    conv.session.params.onePicAttemptsLeft--;

    if (conv.session.params.onePicAttemptsLeft == 0) {
      const convText = `You have ran out of attempts. The correct answers are shown below.`;
      const value = {
        english: conv.session.params.onePicAnswer,
        spanish: conv.session.params.onePicAnswerTranslated,
      };
      langSetCanvas(conv, convText, "LANG_ONE_PIC_SHOW_ANSWER", value);
    } else {
      const convText = `That is incorrect! Try again.`;
      langSetCanvas(
        conv,
        convText,
        "LANG_ONE_PIC_UPDATE_ATTEMPTS",
        conv.session.params.onePicAttemptsLeft
      );
    }
  }
});

/**
 * Handler to manage the word the user guesses
 */
app.handle("lang_multiple_words_answer", async (conv) => {
  const word = conv.intent.params.lang_words
    ? conv.intent.params.lang_words.resolved
    : null;

  console.log("Intent = " + String(conv.intent.params));
  conv.add(`Ok, let's see if ${word} is correct`);

  const userAnswer = String(word);
  const correctAnswers = Array.from(conv.session.params.multipleWordsAnswer);

  const wordIndex = correctAnswers.indexOf(userAnswer);

  if (wordIndex > -1) {
    conv.session.params.englishWordsGuessed++;
    if (conv.session.params.englishWordsGuessed == correctAnswers.length) {
      conv.add("Sweet! Try translating these words to spanish");
      conv.scene.next.name = "lang_multiple_words_translation";
    } else {
      conv.add(`That is a correct word`);
    }
    let value = {
      word: correctAnswers[wordIndex],
      index: wordIndex,
      showSpanish:
        conv.session.params.englishWordsGuessed == correctAnswers.length,
      spanishWords: conv.session.params.multipleWordsAnswerTranslated,
    };
    langSetCanvas(conv, "", "LANG_MULTIPLE_WORDS_SHOW_ENGLISH", value);
  } else {
    conv.session.params.multipleWordsAttemptsLeft--;

    if (conv.session.params.multipleWordsAttemptsLeft == 0) {
      const convText = `You have ran out of attempts. The correct answers are shown below.`;
      const value = {
        english: conv.session.params.multipleWordsAnswer,
        spanish: conv.session.params.multipleWordsAnswerTranslated,
      };
      langSetCanvas(conv, convText, "LANG_MULTIPLE_WORDS_SHOW_ANSWER", value);
    } else {
      const convText = `That is incorrect! Try again.`;
      langSetCanvas(
        conv,
        convText,
        "LANG_MULTIPLE_WORDS_UPDATE_ATTEMPTS",
        conv.session.params.multipleWordsAttemptsLeft
      );
    }
  }
});

/**
 * Handler to manage to spanish input from the user
 */
app.handle("lang_one_pic_answer_translation", (conv) => {
  const word = conv.intent.params.lang_words
    ? conv.intent.params.lang_words.resolved
    : null;

  conv.add(`Ok, let's see if ${word} is correct`);

  const userAnswer = String(word);
  const userID = conv.user.params.uid;
  const englishAnswer = conv.session.params.onePicAnswer;

  const spanishAnswer = conv.session.params.onePicAnswerTranslated;
  if (userAnswer.toLowerCase() == spanishAnswer) {
    const convText = `That is correct! You can say "Next Question" to see something else or "Questions" to go back to the main menu.`;
    langSetCanvas(conv, convText, "LANG_ONE_PIC_SHOW_SPANISH", spanishAnswer);
    storeTranslatedWordsToFirebase(userID, englishAnswer, spanishAnswer);
  } else {
    conv.add(`That is incorrect! Try again.`);
    conv.add(new Canvas());
  }
});

/**
 * Handler to manage to spanish input from the user
 */
app.handle("lang_multiple_words_answer_translation", (conv) => {
  const word = conv.intent.params.lang_words
    ? conv.intent.params.lang_words.resolved
    : null;

  conv.add(`Ok, let's see if ${word} is correct`);

  const userAnswer = String(word);
  const userID = conv.user.params.uid;
  const englishAnswer = conv.session.params.onePicAnswer;

  const spanishAnswers = Array.from(
    conv.session.params.multipleWordsAnswerTranslated
  );
  const englishAnswers = Array.from(conv.session.params.multipleWordsAnswer);
  const wordIndex = spanishAnswers.indexOf(userAnswer);

  if (wordIndex > -1) {
    conv.session.params.spanishWordsGuessed++;
    if (conv.session.params.spanishWordsGuessed == spanishAnswers.length) {
      conv.add(
        `You've got them all! You can say "Next Question" to see something else or "Questions" to go back to the main menu.`
      );
    } else {
      conv.add(`That is a correct word`);
    }

    const value = {
      word: spanishAnswers[wordIndex],
      index: wordIndex,
    };
    langSetCanvas(conv, "", "LANG_MULTIPLE_WORDS_SHOW_SPANISH", value);
    storeTranslatedWordsToFirebase(
      userID,
      englishAnswers[wordIndex],
      spanishAnswers[wordIndex]
    );
  } else {
    conv.add(`That is incorrect! Try again.`);
    conv.add(new Canvas());
  }
});

/**
 * Handler to start the next question
 */
app.handle("lang_next_question", (conv) => {
  conv.add(`Ok, starting next question`);
  if (
    conv.scene.name == "lang_one_pic" ||
    conv.scene.name == "lang_one_pic_translation"
  ) {
    conv.scene.next.name = "lang_one_pic";
  } else if (
    conv.scene.name == "lang_multiple_words" ||
    conv.scene.name == "lang_multiple_words_translation"
  ) {
    conv.scene.next.name = "lang_multiple_words";
  }
});

/**
 * Handler to return to the main menu
 */
app.handle("lang_change_game", (conv) => {
  conv.add(`Ok, returning to the main menu.`);

  if (
    conv.scene.name == "lang_one_pic" ||
    conv.scene.name == "lang_one_pic_translation"
  ) {
    conv.session.params.startedOnePic = false;
  } else if (
    conv.scene.name == "lang_multiple_words" ||
    conv.scene.name == "lang_multiple_words_translation"
  ) {
    conv.session.params.startedMultipleWords = false;
  }

  langSetCanvas(conv, "", "LANG_MENU", conv.scene.name);
});

app.handle("lang_instructions", (conv) => {
  conv.add(INSTRUCTIONS);
  conv.add(new Canvas());
});

//////////////////////////////////////////////

/*
    Reading Action Handlers
*/

const Diff = require("diff");
const database = require("./reading/reformatted4.json");

app.handle("read_fallback", (conv) => {
  conv.add(`I don't understand, please repeat yourself.`);
  conv.add(new Canvas());
});

app.handle("read_bookSelected", (conv) => {
  //Selection of a book from the library scene
  const bookTitle = toTitleCase(conv.session.params.bookTitle); //user input

  if (
    conv.user.params[bookTitle] == undefined ||
    conv.user.params[bookTitle]["chunk"] == undefined
  ) {
    //define key value pair if it doesnt exist
    conv.user.params[bookTitle] = {
      chunk: 0,
      size: database[bookTitle]["Text"].length,
    };
  }

  conv.user.params.currentBook = bookTitle;

  let text = getText(conv);
  conv.add("Loading Book...");
  conv.add(
    new Canvas({
      data: {
        command: "READ_BOOK_SELECTED",
        text: text,
      },
    })
  );

  checkForchapter(conv, text);
});

app.handle("read_analyseUserInput", (conv) => {
  const bookTitle = conv.user.params.currentBook;
  const chunk = conv.user.params[bookTitle]["chunk"];

  let bookText = database[bookTitle]["Text"][chunk]; //An Array of Sentences
  let userInput = splitIntoSentences(conv.session.params.userInput); //split by puncuation

  let response = analyseText(bookText, userInput);

  if (response.assistantOutput != "") {
    conv.add(
      new Canvas({
        data: {
          command: "READ_TEXT_FEEDBACK",
          words: response.words,
          ranges: response.ranges,
        },
      })
    );
    let ssml = `<speak><mark name="OK"/>${response.assistantOutput}<mark name="FIN"/></speak>`;
    conv.add(ssml);
  } else {
    //go next logic
    conv.user.params[bookTitle]["chunk"] += 1;
    let text = getText(conv);
    conv.add(
      new Canvas({
        data: {
          command: "READ_CHANGE_TEXT",
          text: text,
        },
      })
    );

    //audio feedback + google requires some text in an ssml object, so we add "filler text" to the audio tag
    let ssml = `<speak>
        <audio src="https://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg">text
        </audio>
      </speak>`;
    conv.add(ssml);
  }
});

app.handle("read_openLibrary", (conv) => {
  //scene progression handled by AOG GOTO_LIBRARY intent
  conv.user.params.currentBook = null;
  conv.add(
    new Canvas({
      data: {
        command: "READ_OPEN_LIBRARY",
      },
    })
  );
});

app.handle("read_nextChunk", (conv) => {
  //scene progression handled by AOG NEXT intent
  const bookTitle = conv.user.params.currentBook;
  conv.user.params[bookTitle]["chunk"] += 1; //increment page

  let text = getText(conv); //send appropriate response based on user's position in the book
  conv.add(
    new Canvas({
      data: {
        command: "READ_CHANGE_TEXT",
        text: text,
      },
    })
  );

  checkForchapter(conv, text);
});

app.handle("read_restartBook", (conv) => {
  const bookTitle = conv.user.params.currentBook;
  conv.user.params[bookTitle]["chunk"] = 0; //setting the chunk number to 0
  conv.scene.next.name = "READ_TEXT";

  let text = getText(conv);
  conv.add(
    new Canvas({
      data: {
        command: "READ_CHANGE_TEXT",
        text: text,
      },
    })
  );

  checkForchapter(conv, text);
});

function getText(conv) {
  let bookTitle = conv.user.params.currentBook;
  let { chunk, size } = conv.user.params[bookTitle];

  let text = "";
  if (chunk >= size) {
    text = "The End.";
    conv.add(
      "You can Reread this book or Go Back To The Library to find a new book."
    );
    conv.scene.next.name = "READ_FINISH";
  } else {
    let temp = database[bookTitle]["Text"][chunk];
    for (let i = 0; i < temp.length; i++) {
      text = text + temp[i] + " ";
    }
  }
  return text;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

//assumes book paragraph and userParagraph are arrays of sentences
function analyseText(bookParagraph, userParagraph) {
  let options = { ignoreCase: true };
  let wordsWrong = [];
  let sentencesWrong = [];
  let apostropheDictionary = {};
  for (let i = 0; i < bookParagraph.length; i++) {
    if (i >= userParagraph.length) {
      //if true, the user did not say this sentence and will be considered wrong
      sentencesWrong.push(i);
    } else {
      let apos = bookParagraph[i].match(/[\w]\w*'\w*/gm); //captures all words with an apostrophe
      if (apos != null) {
        for (let y = 0; y < apos.length; y++) {
          let key = apos[y].replace(/'/gm, "");
          apostropheDictionary[key] = apos[y]; //key value pairs-> hes : he's
        }
      }

      let bookText = removeMarks(stripPunctuation(bookParagraph[i]));
      let userText = removeMarks(stripPunctuation(userParagraph[i]));
      let analysis = Diff.diffWords(bookText, userText, options);

      let toggle = false;
      let override = true;

      let bt = bookText.split(" ").length;
      let ut = userText.split(" ").length;

      if (bt != ut) {
        sentencesWrong.push(i); //if they are not the same length, then at least one word was added/removed
        override = false; //to prevent repeat additions of this sentence
      }

      for (let j = 0; j < analysis.length; j++) {
        //if user adds a word, we cant highlight that word on the screen so no
        //need to pass it into the wrong words array, just mark the sentence as wrong as compensation
        if (analysis[j].removed) {
          wordsWrong.push(analysis[j].value);
          toggle = true;
        }
      }

      if (toggle && override) {
        sentencesWrong.push(i); //at least one wrong word in the sentence makes the entire sentence wrong
      }
    }
  }

  let sentenceRanges = [];
  for (let i = 0; i < sentencesWrong.length; i++) {
    let ans = findRange(bookParagraph, sentencesWrong[i]);
    sentenceRanges.push(ans);
  }

  //condenses book paragraph into one string, to easily index the paragraph
  let bookCollapsed = "";
  for (let i = 0; i < bookParagraph.length; i++) {
    bookCollapsed += bookParagraph[i];
  }

  //combine wrong sentences into one string so the assistant can read it
  let recompile = "";
  for (let x = 0; x < sentenceRanges.length; x++) {
    let ans = sentenceRanges[x];
    for (let k = ans.start; k < ans.start + ans.chars; k++) {
      recompile += bookCollapsed.charAt(k);
    }
  }

  for (let i = 0; i < wordsWrong.length; i++) {
    if (apostropheDictionary.hasOwnProperty(wordsWrong[i])) {
      wordsWrong[i] = apostropheDictionary[wordsWrong[i]]; //replacing hes with he's for example
    }
  }

  let responseJSON = {
    ranges: sentenceRanges,
    words: wordsWrong,
    assistantOutput: recompile,
  };

  return responseJSON;
}

//given a paragraph, and a sentence number(index), return the starting index of the sentence and its length
function findRange(para, index) {
  //calculate the starting index of the given sentence by summing the length of all previous sentences.
  let startIndex = 0;
  for (let j = index - 1; j >= 0; j--) {
    startIndex += para[j].length;
  }
  let length = para[index].length;

  let ans = { start: startIndex, length: 0, chars: length };
  return ans;
}

function removeMarks(str) {
  return str
    .replace(/(?<=(mr|Mr|Ms|md|Md|Dr|dr|mrs|Mrs|Sr|Jr|jr|sr))\./g, "")
    .replace(/\./, ". ");
}

function stripPunctuation(str) {
  return str.replace(/[,\/#!$%\^&\*;:'"{}=\_`~()]/g, "").replace(/-/g, " ");
}

function splitIntoSentences(str) {
  if (/[^.?!]+[.!?]+[\])'"`’”]*/g.test(str)) {
    //prevent null return on .match() call
    let split = str
      .replace(/(?<=(mr|Mr|Ms|md|Md|Dr|dr|mrs|Mrs|Sr|Jr|jr|sr))\./g, "@")
      .match(/[^.?!]+[.!?]+[\])'"`’”]*/g);

    for (let i = 0; i < split.length; i++) {
      split[i] = split[i].replace(/\@/g, ".");
    }
    return split;
  } else {
    return [str];
  }
}

function checkForchapter(conv, text) {
  const bookTitle = conv.user.params.currentBook;
  if (/^CHAPTER/gi.test(text) || conv.user.params[bookTitle]["chunk"] == 0) {
    //if this chunk is a new chapter
    let ssml = `<speak>${text}<mark name="FIN"/></speak>`;
    conv.add(ssml);
  }
}

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
