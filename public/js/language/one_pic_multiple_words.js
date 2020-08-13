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

export class OnePicMultipleWords {
    questionContainer = document.createElement("div");
    wordsTable = document.createElement("table");
    wordsTableBody = document.createElement("tbody");

    image = document.createElement("img");
    buttonRow = document.createElement("div");
    attemptsData = document.createElement("td");

    constructor() {
        this.questionContainer.classList.add("container", "h-100", "w-100");
        this.questionContainer.id = "one-pic-one-word";

        const titleSection = document.createElement("div");
        titleSection.classList.add(
            "col-12",
            "row",
            "h-100",
            "justify-content-center",
            "align-items-center"
        );

        this.wordsTable.classList.add(
            "table",
            "table-bordered",
            "table-dark",
            "pic-table"
        );

        const tableHead = document.createElement("thead");
        const questionTitle = document.createElement("th");
        questionTitle.innerText = "One Pic Multiple Words";
        questionTitle.setAttribute("colspan", "2");
        questionTitle.classList.add("text-center", "game-heading");
        tableHead.appendChild(questionTitle);
        this.wordsTable.appendChild(tableHead);
        this.wordsTable.appendChild(this.wordsTableBody);

        this.buttonRow = document.createElement("tr");
        const buttonData = document.createElement("td");
        this.buttonRow.classList.add("text-center");

        const nextQuestionButton = document.createElement("button");
        nextQuestionButton.setAttribute("type", "button");
        nextQuestionButton.classList.add("btn", "btn-primary");
        nextQuestionButton.innerText = "Next Question";

        buttonData.appendChild(nextQuestionButton);
        this.buttonRow.appendChild(this.attemptsData);
        this.buttonRow.appendChild(buttonData);
        this.wordsTable.appendChild(this.buttonRow);

        titleSection.append(this.wordsTable);
        this.questionContainer.appendChild(titleSection);
    }

    /**
     * Sets the number of attempts left over
     * @param {*} attempts left over
     */
    setAttempts(attempts) {
        this.attemptsData.innerText = `${attempts} attempts left`;
    }

    /**
     * Sets the image inside of the table
     * @param {*} url of image
     */
    setImageURL(url) {
        this.wordsTableBody.innerHTML = "";
        const imageRow = document.createElement("tr");
        const imageData = document.createElement("td");
        imageData.setAttribute("align", "center");
        imageData.setAttribute("rowspan", "9");

        this.image.src = url;
        imageData.appendChild(this.image);
        imageRow.appendChild(imageData);
        this.wordsTableBody.appendChild(imageRow);
    }

    /**
     * Sets the hidden english/spanish words in the table
     * @param {*} words that are hidden to the user (words to be guessed)
     * @param {*} language which the words are in
     */
    setWords(words, language) {
        this.addWordsToContainer(words, language, this.wordsTableBody);
    }

    /**
     * Makes the word visible to the user
     * @param {*} word to be shown to the user
     * @param {*} language of the word
     * @param {*} index of the word
     */
    setWord(word, language, index) {
        const wordElement = document.getElementById(
            `${language}-word-${index}`
        );
        wordElement.innerText = word;
    }

    /**
     * Creates the word elements for the table
     * @param {*} words to be shown to the user
     * @param {*} heading of the words
     * @param {*} element that the words should be added to
     */
    addWordsToContainer(words, heading, element) {
        const tableHead = document.createElement("tr");
        tableHead.classList.add(String(heading).toLowerCase());
        var headingElement = document.createElement("th");

        headingElement.classList.add("text-center");
        headingElement.innerText = `${heading}`;

        tableHead.appendChild(headingElement);
        element.appendChild(tableHead);

        for (var i = 0; i < words.length; i++) {
            const tableRow = document.createElement("tr");
            tableRow.classList.add(String(heading).toLowerCase());
            var word = words[i];
            var wordElement = document.createElement("td");
            var dashedWord = `${word} : `;
            for (var x = 0; x < word.length; x++) {
                if (word.charAt(x) == " ") {
                    dashedWord += "&nbsp&nbsp&nbsp&nbsp";
                } else {
                    dashedWord += "_ ";
                }
            }
            wordElement.innerHTML = dashedWord;
            wordElement.id = `${String(heading).toLowerCase()}-word-${i}`;

            tableRow.appendChild(wordElement);
            element.appendChild(tableRow);
        }
    }

    /**
     * Returns the game session container
     */
    getQuestion() {
        return this.questionContainer;
    }

    /**
     * Makes the spanish section visible
     */
    showSpanishWords() {
        const spanishWords = document.getElementsByClassName("spanish");
        for (var i = 0; i < spanishWords.length; i++) {
            spanishWords[i].classList.remove("hide-with-space");
        }
    }

    /**
     * Makes the spanish section hidden
     */
    show;
    hideSpanishWords() {
        const spanishWords = document.getElementsByClassName("spanish");
        for (var i = 0; i < spanishWords.length; i++) {
            spanishWords[i].classList.add("hide-with-space");
        }
    }
}
