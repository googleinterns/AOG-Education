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
    conv.add(
        "Welcome User, thank you for choosing AOG Education"
    );
    conv.add(
        new Canvas({
            url: "https://test-project-e40c9.web.app",
            // REPLACE with url: `https://step-capstone.web.app`,
        })
    );
});

app.handle("fallback", (conv) => {
    conv.add(`I don"t understand. Ask for help to get assistance.`);
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

    if (selection == "geography") {
        conv.scene.next.name = "geo_scene_geo_category";
    }
});

/**
 * GEOGRAPHY SECTION
 */

// Load state and country data.
const geo_statesFile = require("./geo-states");
const geo_stateCoordsFile = require("./geo-stateCoords");
const geo_countriesFile = require("./geo-countries");
const geo_states = geo_statesFile.states;
const geo_stateCoords = geo_stateCoordsFile.stateCoords;
const geo_countries = geo_countriesFile.countries;

const geo_categories = {
  USCAPITALS: "us_capitals",
  WORLDCAPITALS: "world_capitals",
  STATES: "states",
  COUNTRIES: "countries"
};

let geo_stateInd, geo_state, geo_countryInd, geo_country;
let geo_usCapital, geo_worldCapital;
let geo_category;

// Randomly generate a new state question.
function getNewStateQuestion() {
    geo_stateInd = parseInt(Math.random()*Object.keys(geo_states).length);
    geo_state = geo_states[geo_stateInd][0];
    geo_usCapital = geo_states[geo_stateInd][1];
}

// Randomly generate a new country question.
function getNewCountryQuestion() {
    geo_countryInd = parseInt(Math.random()*Object.keys(geo_countries).length);
    geo_country = geo_countries[geo_countryInd][0];
    geo_worldCapital = geo_countries[geo_countryInd][1];
}

app.handle("geo_askUSCapitalQuestion", (conv) => {
    geo_category = geo_categories.USCAPITALS;
    getNewStateQuestion();
    conv.add(`What is the capital of ${geo_state}?`);
});

app.handle("geo_askWorldCapitalQuestion", (conv) => {
    geo_category = geo_categories.WORLDCAPITALS;
    getNewCountryQuestion();
    conv.add(`What is the capital of ${geo_country}?`);
});

app.handle("geo_askStateQuestion", (conv) => {
    geo_category = geo_categories.STATES;
    getNewStateQuestion();
    conv.add("What is the state pictured?");
    conv.add(new Canvas({
        data: {
            command: "LOAD_STATE_MAP",
            coords: geo_stateCoords[geo_state]
        }
    }));
});

app.handle("geo_askCountryQuestion", (conv) => {
    geo_category = geo_categories.COUNTRIES;
    getNewCountryQuestion();
    conv.add("What is the country pictured?");
    conv.add(new Canvas({
        data: {
            command: "LOAD_COUNTRY_MAP",
            country: geo_country,
            region: geo_countries[geo_countryInd][2]
        }
    }));
});

app.handle("geo_checkAnswer", (conv) => {
    let correctAnswer;
    if (geo_category == geo_categories.USCAPITALS) {
        correctAnswer = geo_usCapital;
    } else if (geo_category == geo_categories.STATES) {
        correctAnswer = geo_state;
    } else if (geo_category == geo_categories.COUNTRIES) {
        correctAnswer = geo_country;
    } else if (geo_category == geo_categories.WORLDCAPITALS) {
        correctAnswer = geo_worldCapital;
    }

    if (conv.intent.params.answer && conv.intent.params.answer.resolved.includes(correctAnswer) ||
            geo_category == geo_categories.USCAPITALS && geo_state == "Alaska" &&
            conv.intent.params.answer.resolved.includes("Juno")) {
        conv.add(`${correctAnswer} is correct!`);
    } else {
        conv.add(`Sorry, that's incorrect. The correct answer is ${correctAnswer}.`);
    }
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
