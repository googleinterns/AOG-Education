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

const INSTRUCTIONS =
    "Hello user, This is AOG Education.";

const app = conversation({ debug: true });

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
            url: `https://step-capstone.web.app`,
        })
    );
});

app.handle("fallback", (conv) => {
    conv.add(`I don't understand. You can change my color or pause spinning.`);
    conv.add(new Canvas());
});

app.handle("instructions", (conv) => {
    conv.add(INSTRUCTIONS);
    conv.add(new Canvas());
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
