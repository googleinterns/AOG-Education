/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { conversation, Canvas } = require("@assistant/conversation");
const functions = require("firebase-functions");
// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

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
  conv.add(
    new Canvas({
      data: {
        command: "AOG_MAIN_MENU_SELECTION",
        selection: selection,
      },
    })
  );

  if (selection == "language") {
    conv.scene.next.name = "lang_menu";
  }

  if (selection == "geography") {
    conv.scene.next.name = "geo_scene_category";
  }

  if (selection == "reading") {

    //Logic that used to be in the local version of the Reading action's Play Game Intent.
    conv.add("Welcome to Reading with the Google Assistant!");
    conv.add(
      new Canvas({
        url: "https://reading-dc6dd.web.app",
      })
    );
    conv.scene.next.name = "READ_LIBRARY";
  }
});

/**
 * GEOGRAPHY SECTION
 */

// Load state and country data.
const geo_statesFile = require("./geography/geo-states");
const geo_stateCoordsFile = require("./geography/geo-stateCoords");
const geo_countriesFile = require("./geography/geo-countries");
let geo_states, geo_stateCoords, geo_countries;

// Randomly generate a new state question.
function getNewStateQuestion(conv) {
  conv.session.params.geo_stateInd = parseInt(
    Math.random() * Object.keys(geo_states).length
  );
  conv.session.params.geo_state =
    geo_states[conv.session.params.geo_stateInd][0];
  conv.session.params.geo_usCapital =
    geo_states[conv.session.params.geo_stateInd][1];
  conv.session.params.geo_numQuestionsLeft--;
}

// Randomly generate a new country question.
function getNewCountryQuestion(conv) {
  conv.session.params.geo_countryInd = parseInt(
    Math.random() * Object.keys(geo_countries).length
  );
  conv.session.params.geo_country =
    geo_countries[conv.session.params.geo_countryInd][0];
  conv.session.params.geo_worldCapital =
    geo_countries[conv.session.params.geo_countryInd][1];
  conv.session.params.geo_numQuestionsLeft--;
}

app.handle("geo_setup", (conv) => {
  geo_states = geo_statesFile.states;
  geo_stateCoords = geo_stateCoordsFile.stateCoords;
  geo_countries = geo_countriesFile.countries;
  conv.session.params.geo_numQuestionsLeft = 10;
  conv.session.params.geo_correct = 0;
  conv.session.params.geo_incorrect = 0;
});

app.handle("geo_askUSCapitalQuestion", (conv) => {
  conv.session.params.geo_category = "USCAPITALS";
  getNewStateQuestion(conv);
  conv.add(`What is the capital of ${conv.session.params.geo_state}?`);
});

app.handle("geo_askWorldCapitalQuestion", (conv) => {
  conv.session.params.geo_category = "WORLDCAPITALS";
  getNewCountryQuestion(conv);
  conv.add(`What is the capital of ${conv.session.params.geo_country}?`);
});

app.handle("geo_askStateQuestion", (conv) => {
  conv.session.params.geo_category = "STATES";
  getNewStateQuestion(conv);
  conv.add("What is the state pictured?");
  conv.add(
    new Canvas({
      data: {
        command: "LOAD_STATE_MAP",
        coords: geo_stateCoords[conv.session.params.geo_state],
      },
    })
  );
});

app.handle("geo_askCountryQuestion", (conv) => {
  conv.session.params.geo_category = "COUNTRIES";
  getNewCountryQuestion(conv);
  conv.add("What is the country pictured?");
  conv.add(
    new Canvas({
      data: {
        command: "LOAD_COUNTRY_MAP",
        country: conv.session.params.geo_country,
        region: geo_countries[conv.session.params.geo_countryInd][2],
      },
    })
  );
});

app.handle("geo_viewResults", (conv) => {
  conv.add(
    `You got ${conv.session.params.geo_correct} questions correct and ${conv.session.params.geo_incorrect} questions incorrect.`
  );
});

app.handle("geo_checkAnswer", (conv) => {
  let correctAnswer;
  if (conv.session.params.geo_category == "USCAPITALS") {
    correctAnswer = conv.session.params.geo_usCapital;
  } else if (conv.session.params.geo_category == "STATES") {
    correctAnswer = conv.session.params.geo_state;
  } else if (conv.session.params.geo_category == "COUNTRIES") {
    correctAnswer = conv.session.params.geo_country;
  } else if (conv.session.params.geo_category == "WORLDCAPITALS") {
    correctAnswer = conv.session.params.geo_worldCapital;
  }

  if (
    (conv.intent.params.answer &&
      conv.intent.params.answer.resolved.includes(correctAnswer)) ||
    (conv.session.params.geo_category == "USCAPITALS" &&
      conv.session.params.geo_state == "Alaska" &&
      conv.intent.params.answer.resolved.includes("Juno"))
  ) {
    conv.session.params.geo_correct++;
    conv.add(`${correctAnswer} is correct!`);
  } else {
    conv.session.params.geo_incorrect++;
    conv.add(
      `Sorry, that's incorrect. The correct answer is ${correctAnswer}.`
    );
  }
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
 * Welcomes the user to the language section of the app.
 */
app.handle("lang_welcome", (conv) => {
  if (!conv.device.capabilities.includes("INTERACTIVE_CANVAS")) {
    conv.add("Sorry, this device does not support Interactive Canvas!");
    conv.scene.next.name = "actions.page.END_CONVERSATION";
    return;
  }
  conv.add(
    "Hi, Welcome to the AOG Education language section. Please choose a game from the menu below."
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
  /* 
    TODO: Uncomment when authentication has been added.

    if (conv.user.params.startedOnePic == undefined || conv.user.params.startedOnePic == false) {
        conv.add(`Ok, starting one pic one word`);
        conv.add(`To play this game, please guess the english word shown by the picture.`);
        conv.user.params.startedOnePic = true
    }
    */

  if (langGameState.game_state.startedOnePic == false) {
    conv.add(`Ok, starting one pic one word`);
    conv.add(
      `To play this game, please guess the english word shown by the picture.`
    );
    langGameState.game_state.startedOnePic = true;
  }

  return imageAnalysis
    .imageAnalysis()
    .then((value) => {
      // TODO: Uncomment when authentication has been added
      // conv.user.params.onePicAnswer = value.word
      langGameState.game_state.onePicAnswer = value.word;
      conv.add(
        new Canvas({
          data: {
            command: "LANG_START_ONE_PIC",
            analysis: value,
          },
        })
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * Handler to manage the word the user guesses
 */
app.handle("lang_one_pic_word", (conv) => {
  const word = conv.intent.params.word
    ? conv.intent.params.word.resolved
    : null;

  conv.add(`Ok, let's see if ${word} is correct`);

  // TODO: Uncomment when authentication has been added
  // const correctAnswer = conv.user.params.onePicAnswer;
  const correctAnswer = langGameState.game_state.onePicAnswer;
  const userAnswer = String(word);

  if (userAnswer.toLowerCase() == correctAnswer.toLowerCase()) {
    conv.add(`That is correct! Try translating it to spanish`);
    conv.add(
      new Canvas({
        data: {
          command: "LANG_ONE_PIC_SHOW_ENGLISH",
          word: correctAnswer,
        },
      })
    );
    conv.scene.next.name = "lang_one_pic_translation";
  } else {
    conv.add(`That is incorrect! Try again.`);
    conv.add(new Canvas());
  }
});

/**
 * Handler to manage to spanish input from the user
 */
app.handle("lang_one_pic_word_translation", (conv) => {
  const word = conv.intent.params.word
    ? conv.intent.params.word.resolved
    : null;

  conv.add(`Ok, let's see if ${word} is correct`);
  // TODO: Uncomment when authentication has been added
  // const correctAnswer = conv.user.params.onePicAnswer;
  const correctAnswer = langGameState.game_state.onePicAnswer;
  return translation
    .translateFunction(correctAnswer)
    .then((value) => {
      const userAnswer = String(word);
      if (userAnswer.toLowerCase() == value.toLowerCase()) {
        conv.add(
          `That is correct! You can say "Next Question" to see something else or "Questions" to go back to the main menu.`
        );
        conv.add(
          new Canvas({
            data: {
              command: "LANG_ONE_PIC_SHOW_SPANISH",
              word: value,
            },
          })
        );
      } else {
        conv.add(`That is incorrect! Try again.`);
        conv.add(new Canvas());
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * Handler to start the next question
 */
app.handle("lang_one_pic_next_question", (conv) => {
  conv.add(`Ok, starting next question`);
  conv.scene.next.name = "lang_one_pic";
});

/**
 * Handler to return to the main menu
 */
app.handle("lang_change_game", (conv) => {
  // TODO: Uncomment when authentication has been added
  // conv.user.params.startedOnePic = false
  langGameState.game_state.startedOnePic = false;
  conv.add(`Ok, opening questions.`);
  conv.add(
    new Canvas({
      data: {
        command: "LANG_MENU",
      },
    })
  );
});

app.handle("lang_instructions", (conv) => {
  conv.add(LANG_INSTRUCTIONS);
  conv.add(new Canvas());
});

//////////////////////////////////////////////

/*
    Reading Action Handlers
*/

const textData = require("./reading/mockTextData.json");

app.handle("read_fallback", (conv) => {
  conv.add(`I don't understand. You can read a book or cancel.`);
  conv.add(new Canvas());
});

app.handle("read_bookSelected", (conv) => {
  const bookTitle = conv.session.params.bookTitle; //cannot be null

  let chunkNumber;
  if (conv.user.params[bookTitle] != undefined) {
    chunkNumber = conv.user.params[bookTitle];
  } else {
    chunkNumber = 0;
    conv.user.params[bookTitle] = 0;
  }

  conv.user.params.currentBook = bookTitle;

  conv.add("Loading Book...");
  let text;
  if (chunkNumber >= textData[bookTitle].length) {
    text = "The End.";
    conv.add("You can say Restart Book or Go Back To The Library.");
  } else {
    text = textData[bookTitle][chunkNumber];
  }
  conv.add(
    new Canvas({
      data: {
        command: "READ_BOOK_SELECTED",
        text: text,
      },
    })
  );
});

app.handle("read_analyseUserInput", (conv) => {
  //TODO: Acount for user input in the ending screen
  const userInput = conv.session.params.userInput;
  const bookTitle = conv.user.params.currentBook;

  //In case user says something during the End of Book Screen.
  let chunkNumber = conv.user.params[bookTitle];
  let text;
  if (chunkNumber >= textData[bookTitle].length) {
    text = "The End.";
    conv.add("You can say Restart Book or Go Back To The Library.");
    conv.add(
      new Canvas({
        data: {
          command: "READ_CHANGE_TEXT",
          text: text,
        },
      })
    );
  } else {
    text = textData[bookTitle][chunkNumber];

    let Booktext = textData[bookTitle][conv.user.params[bookTitle]];

    //TODO: A naive text matching algorithm
    //find the right speed for highlighting realtive to the google assitants speach speed
    let matchedText = userInput;
    let remainingText = Booktext;

    if (remainingText) {
      conv.add(
        new Canvas({
          data: {
            command: "READ_TEXT_FEEDBACK",
            matched: matchedText,
            remaining: remainingText,
          },
        })
      );
      let ssml = `<speak><mark name="OK"/>${remainingText}<mark name="FIN"/></speak>`;
      conv.add(ssml); //for onTtsMark callback
    } else {
      //audio feedback
      //let ssml = `<speak></speak>`
      conv.user.params[bookTitle] += 1;
      chunkNumber = conv.user.params[bookTitle];
      if (chunkNumber >= textData[bookTitle].length) {
        text = "The End.";
        conv.add("You can say Restart Book or Go Back To The Library.");
      } else {
        text = textData[bookTitle][chunkNumber];
      }
      conv.add(
        new Canvas({
          data: {
            command: "READ_CHANGE_TEXT",
            text: text,
          },
        })
      );
    }
  }
});

app.handle("read_openLibrary", (conv) => {
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
  const bookTitle = conv.user.params.currentBook;
  conv.user.params[bookTitle] += 1;
  let chunkNumber = conv.user.params[bookTitle];
  let text;
  if (chunkNumber >= textData[bookTitle].length) {
    text = "The End.";
    conv.add("You can say Restart Book or Go Back To The Library.");
  } else {
    text = textData[bookTitle][chunkNumber];
  }
  conv.add(
    new Canvas({
      data: {
        command: "READ_CHANGE_TEXT",
        text: text,
      },
    })
  );
});

app.handle("read_restartBook", (conv) => {
  const bookTitle = conv.user.params.currentBook;
  conv.user.params[bookTitle] = 0;
  let chunkNumber = 0;
  conv.add(
    new Canvas({
      data: {
        command: "READ_CHANGE_TEXT",
        text: textData[bookTitle][chunkNumber],
      },
    })
  );
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
