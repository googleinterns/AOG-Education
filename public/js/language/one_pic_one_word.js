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

/**
 * Represent Triangle scene
 */
export class OnePicOneWord {
    /**
     * Initializes the game with visual components.
     */

    questionContainer = document.createElement("div");
    englishWord = document.createElement("h4");
    spanishWord = document.createElement("h4");
    image = document.createElement("img");
    buttonRow = document.createElement("div");

    constructor() {
        this.questionContainer.classList.add("container", "h-100", "w-100");
        this.questionContainer.id = "one-pic-one-word";

        const questionRow = document.createElement("div");
        questionRow.classList.add(
            "row",
            "h-100",
            "justify-content-center",
            "align-items-center"
        );

        const titleSection = document.createElement("div");
        titleSection.classList.add("col-5");

        const pictureSection = document.createElement("div");
        pictureSection.classList.add("col-7", "text-center");

        const questionTitle = document.createElement("h1");
        questionTitle.innerText = "1 Pic 1 Word";
        questionTitle.classList.add("right-align");

        this.englishWord.classList.add("right-align");
        this.spanishWord.classList.add("right-align");

        this.image.classList.add("question-image");

        this.buttonRow = document.createElement("div");
        this.buttonRow.classList.add("right-align");
        const nextQuestionButton = document.createElement("button");
        nextQuestionButton.setAttribute("type", "button");
        nextQuestionButton.classList.add("btn", "btn-primary", "next-question");
        nextQuestionButton.innerText = "Next Question";
        this.buttonRow.appendChild(nextQuestionButton);

        titleSection.append(questionTitle, this.englishWord, this.spanishWord);
        pictureSection.append(this.image, this.buttonRow);
        questionRow.append(titleSection, pictureSection);
        this.questionContainer.appendChild(questionRow);
    }

    /**
     * Sets the image source to the url
     * @param {*} url of the image to be shown
     */
    setImageURL(url) {
        this.image.src = url;
    }

    /**
     * Sets the english word to shown to the user
     * @param {*} word to be guessed
     */
    setWord(word) {
        this.englishWord.innerText = word;
    }

    /**
     * Sets the spanish word to shown to the user
     * @param {*} word to be guessed
     */
    setSpanishWord(word) {
        this.spanishWord.innerText = word;
    }

    getOnePicOneWordQuestion() {
        return this.questionContainer;
    }

    showSpanishWord() {
        this.spanishWord.classList.remove("hide");
    }

    hideSpanishWord() {
        this.spanishWord.classList.add("hide");
    }
}
