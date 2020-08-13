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

export class OnePicOneWord {
    
    questionContainer = document.createElement("div");
    wordsTable = document.createElement("table");
    wordsTableBody = document.createElement("tbody");

    englishWord = document.createElement("h4");
    spanishWord = document.createElement("h4");
    image = document.createElement("img");
    buttonRow = document.createElement("div");
    attemptsData = document.createElement("td")

    constructor() {
        this.questionContainer.classList.add(
            "container",
            "h-100",
            "w-100"
        );
        this.questionContainer.id = "one-pic-one-word"

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
        questionTitle.innerText = "One Pic One Word";
        questionTitle.setAttribute("colspan", "2")
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
        this.wordsTable.appendChild(this.buttonRow)

        titleSection.append(this.wordsTable);
        this.questionContainer.appendChild(titleSection);
    }

    /**
     * Sets the number of attempts left over
     * @param {*} attempts left over
     */
    setAttempts(attempts) {
        this.attemptsData.innerText = `${attempts} attempts left`
    }

    /**
     * Sets the image inside of the table
     * @param {*} url of image
     */
    setImageURL(url) {
        this.wordsTableBody.innerHTML = ""
        const imageRow = document.createElement("tr");
        const imageData = document.createElement("td");
        imageData.setAttribute("colspan", "2")
        imageData.setAttribute("align", "center");

        this.image.src = url;
        imageData.appendChild(this.image);
        imageRow.appendChild(imageData);
        this.wordsTableBody.appendChild(imageRow);
    }

    /**
     * Sets the hidden english/spanish word in the table
     * @param {*} word that is hidden to the user (word to be guessed)
     * @param {*} language which the word is in
     */
    setWord(word, language) {
        const tableHead = document.createElement("tr");
        var headingElement = document.createElement("th");

        headingElement.classList.add("text-center");
        headingElement.innerText = language;

        tableHead.appendChild(headingElement);
        this.wordsTableBody.appendChild(tableHead);

        var wordElement = document.createElement("td");
        var dashedWord = `${word} : `;
        for (var i = 0; i < word.length; i++) {
            if (word.charAt(i) == " ") {
                dashedWord += "&nbsp&nbsp&nbsp&nbsp";
            } else {
                dashedWord += "_ ";
            }
        }
        wordElement.innerHTML = dashedWord;
        wordElement.id = `${String(language).toLowerCase()}-word`

        tableHead.appendChild(wordElement)
        this.wordsTableBody.appendChild(tableHead);
    }

    /**
     * Makes the word visible to the user
     * @param {*} word that should be shown to the user
     * @param {*} id of the word
     */
    setWordValue(word, id) {
        const wordElement = document.getElementById(id);
        wordElement.innerText = word
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
    showSpanishWord() {
        this.spanishWord.classList.remove("hide-with-space")
    }

    /**
     * Makes the spanish section hidden
     */
    hideSpanishWord() {
        this.spanishWord.classList.add("hide-with-space")
    }
}
