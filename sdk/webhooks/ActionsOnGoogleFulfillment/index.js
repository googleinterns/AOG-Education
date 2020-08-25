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
            url: "https://test-project-e40c9.web.app/",
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
  
// Load functions and state coordinates data.
const geo_functions = require("./functions");
const geo_state_coords_file = require("./state_coords");
const geo_cities_file = require("./cities");
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
app.handle("geo_country", (conv) => {
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

app.handle("geo_choose_city", (conv) => {
    conv.add("Choose a place to visit.");
    conv.add(new Canvas({
        data: {
            command: "GEO_CHOOSE_CITY",
            cities: geo_cities
        }
    }));
});

app.handle("geo_city", (conv) => {
    let city = geo_cities.find(element =>
        conv.intent.params.answer.resolved.includes(element[0]) ||
        conv.intent.params.answer.resolved.includes(element[1]) ||
        conv.intent.params.answer.resolved.includes(element[2]));
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
