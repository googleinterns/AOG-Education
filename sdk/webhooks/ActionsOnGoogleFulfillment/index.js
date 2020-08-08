/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this _file except in compliance with the License.
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
const _ = require("lodash");
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
        conv.scene.next.name = "geo_menu";
    }
});

/**
 * GEOGRAPHY SECTION
 */
  
// Load state and country data.
const geo_states_file = require("./states");
const geo_state_coords_file = require("./state_coords");
const geo_countries_file = require("./countries");
let geo_states, geo_state_coords, geo_countries;

/**
 * Randomly generate a new state question.
 */
function getNewStateQuestion(conv) {
    const ind = parseInt(Math.random() * Object.keys(geo_states).length);
    conv.session.params.geo_state = geo_states[ind][0];
    conv.session.params.geo_us_capital = geo_states[ind][1];
    conv.session.params.geo_num_questions_left--;
    delete geo_states[ind];
}

/**
 * Randomly generate a new country question.
 */
function getNewCountryQuestion(conv) {
    const ind = parseInt(Math.random() * Object.keys(geo_countries).length);
    conv.session.params.geo_country_ind = ind;
    conv.session.params.geo_country = geo_countries[ind][0];
    conv.session.params.geo_world_capital = geo_countries[ind][1];
    conv.session.params.geo_num_questions_left--;
    delete geo_countries[ind];
}

/**
 * Load states and countries data and initialize the number of questions
 * and the number of questions answered correctly and incorrectly.
 */
app.handle("geo_setup", (conv) => {
    geo_states = _.cloneDeep(geo_states_file.states);
    geo_state_coords = geo_state_coords_file.stateCoords;
    geo_countries = _.cloneDeep(geo_countries_file.countries);
    conv.session.params.geo_num_questions_left = 10;
    conv.session.params.geo_num_correct = 0;
    conv.session.params.geo_num_incorrect = 0;
    conv.session.params.geo_correct = [];
    conv.session.params.geo_incorrect = [];
    conv.user.params.geo_question_bank = [];
});

/**
 * Ask US capital question.
 */
app.handle("geo_us_capital", (conv) => {
    conv.session.params.geo_category = "US_CAPITALS";
    getNewStateQuestion(conv);
    conv.add(`What is the capital of ${conv.session.params.geo_state}?`);
});

/**
 * Ask world capital question.
 */
app.handle("geo_world_capital", (conv) => {
    conv.session.params.geo_category = "WORLD_CAPITALS";
    getNewCountryQuestion(conv);
    conv.add(`What is the capital of ${conv.session.params.geo_country}?`);
});

/**
 * Ask US state question and load the state map in question.
 */
app.handle("geo_state", (conv) => {
    conv.session.params.geo_category = "STATES";
    getNewStateQuestion(conv);
    conv.add("What is the state pictured?");
    conv.add(new Canvas({
        data: {
            command: "GEO_LOAD_STATE_MAP",
            coords: geo_state_coords[conv.session.params.geo_state]
        }
    }));
});

/**
 * Ask country question and load the country map in question.
 */
app.handle("geo_country", (conv) => {
    conv.session.params.geo_category = "COUNTRIES";
    getNewCountryQuestion(conv);
    conv.add("What is the country pictured?");
    conv.add(new Canvas({
        data: {
            command: "GEO_LOAD_COUNTRY_MAP",
            country: conv.session.params.geo_country,
            region: geo_countries[conv.session.params.geo_country_ind][2]
        }
    }));
});

/**
 * Load results page displaying questions answered correctly and incorrectly.
 */
app.handle("geo_results", (conv) => {
    conv.add(new Canvas({
        data: {
            command: "GEO_SHOW_RESULTS",
            numCorrect: conv.session.params.geo_num_correct,
            numIncorrect: conv.session.params.geo_num_incorrect,
            correct: conv.session.params.geo_correct,
            incorrect: conv.session.params.geo_incorrect
        }
    }));
});

/**
 * Check whether the answer is correct and display the corresponding message.
 */
app.handle("geo_check_answer", (conv) => {
    let answer;
    if (conv.session.params.geo_category == "US_CAPITALS") {
        answer = conv.session.params.geo_us_capital;
    } else if (conv.session.params.geo_category == "STATES") {
        answer = conv.session.params.geo_state;
    } else if (conv.session.params.geo_category == "COUNTRIES") {
        answer = conv.session.params.geo_country;
    } else if (conv.session.params.geo_category == "WORLD_CAPITALS") {
        answer = conv.session.params.geo_world_capital;
    }

    if (conv.intent.params.answer && conv.intent.params.answer.resolved.includes(answer) ||
            conv.session.params.geo_category == "US_CAPITALS" &&
            conv.session.params.geo_state == "Alaska" &&
            conv.intent.params.answer.resolved.includes("Juno")) {
        conv.session.params.geo_num_correct++;
        conv.session.params.geo_correct.push(answer);
        conv.add(`${answer} is correct!`);
    } else {
        conv.session.params.geo_num_incorrect++;
        conv.session.params.geo_incorrect.push(answer);
        conv.add(`Sorry, that's incorrect. The correct answer is ${answer}.`);
    }
});

/**
 * LANGUAGE SECTION
 */

// AOG Language Headers
const translation = require("./translation");
const imageAnalysis = require("./image_analysis");
const langGameState = require("./lang_game_state");

const LANG_INSTRUCTIONS = "Hello user, you can open a new level or change questions.";

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
    conv.add(
        `I don't understand. You can open a new level or change questions.`
    );
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
    // const answer = conv.user.params.onePicAnswer;
    const answer = langGameState.game_state.onePicAnswer;
    const userAnswer = String(word);

    if (userAnswer.toLowerCase() == answer.toLowerCase()) {
        conv.add(`That is correct! Try translating it to spanish`);
        conv.add(
            new Canvas({
                data: {
                    command: "LANG_ONE_PIC_SHOW_ENGLISH",
                    word: answer,
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
    // const answer = conv.user.params.onePicAnswer;
    const answer = langGameState.game_state.onePicAnswer;
    return translation
        .translateFunction(answer)
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

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
