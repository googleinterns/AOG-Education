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
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const INSTRUCTIONS = "Hello user, This is AOG Education.";

const app = conversation({ debug: true });

// AOG Language Headers
const translation = require("./language/translation");
const imageAnalysis = require("./language/image_analysis");
const langGameState = require("./language/lang_game_state");

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
            url: `https://step-capstone.web.app`,
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
    console.log(selection);
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
        console.log("Opening language");
        conv.scene.next.name = "lang_menu";
    }
});

/**
 * GEOGRAPHY SECTION
 */

/**
 * LANGUAGE SECTION
 */

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

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
