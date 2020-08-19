const { conversation, Canvas } = require("@assistant/conversation");
const functions = require("firebase-functions");

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
    conv.scene.next.name = "read_LIBRARY";
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
  conv.scene.next.name = "read_TEXT";

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
    conv.scene.next.name = "read_FINISH";
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
