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

export class Vocabulary {

    wordsContainer = document.createElement("div");
    wordsTable = document.createElement("table");
    wordsTableBody = document.createElement("tbody");

    englishWord = document.createElement("h4");
    spanishWord = document.createElement("h4");
    image = document.createElement("img");
    buttonRow = document.createElement("div");
    attemptsData = document.createElement("td")

    constructor() {
        this.wordsContainer.classList.add(
            "container",
            "h-100",
            "w-100"
        );
        this.wordsContainer.id = "one-pic-one-word"

        const titleSection = document.createElement("div");
        titleSection.classList.add(
            "col-12",
            "row",
            "h-100",
            "justify-content-center",
            "align-items-center"
        );

        this.wordsTable.classList.add("table", "table-bordered", "table-dark", "pic-table");

        const tableHead = document.createElement("thead");
        const questionTitle = document.createElement("th");
        questionTitle.innerText = "Words Translated";
        questionTitle.setAttribute("colspan", "2")
        questionTitle.classList.add("text-center", "game-heading");
        tableHead.appendChild(questionTitle);
        this.wordsTable.appendChild(tableHead);
        this.wordsTable.appendChild(this.wordsTableBody);

        const languageHead = document.createElement("tr");
        var englishElement = document.createElement("th");
        var spanishElement = document.createElement("th");

        englishElement.classList.add("text-center");
        englishElement.innerText = "ENGLISH";

        spanishElement.classList.add("text-center");
        spanishElement.innerText = "SPANISH";

        languageHead.append(englishElement, spanishElement);
        this.wordsTableBody.appendChild(languageHead);

        titleSection.append(this.wordsTable);
        this.wordsContainer.appendChild(titleSection);
    }

    /**
     * Sets translated words in the table
     * @param {*} words that the user translated
     */
    setWords(words) {
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            const tableHead = document.createElement("tr");
            var englishElement = document.createElement("td");
            var spanishElement = document.createElement("td");

            englishElement.innerText = word.english;
            spanishElement.innerText = word.spanish;
            tableHead.append(englishElement, spanishElement);
            this.wordsTableBody.appendChild(tableHead);
        }
    }

    /**
     * Returns the translated words
     */
    getWords() {
        return this.wordsContainer;
    }
}
