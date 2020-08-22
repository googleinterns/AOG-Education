export class GeographyResults {
    geographyResults = document.createElement("div");

    constructor() {
        this.geographyResults.classList.add("container", "h-100");
    }

    /**
     * Creates list of incorrect or correct answers.
     * @param {*} categoryClass is incorrect or correct
     * @param {*} list of answers in that category
     */
    getList(categoryClass, list) {
        let answers = document.createElement("ul");
        answers.classList.add(categoryClass, "geo");
        for (let i = 0; i < list.length; i++) {
            // Create the list item.
            let answer = document.createElement('li');

            // Set its contents.
            answer.appendChild(document.createTextNode(list[i]));

            // Add it to the list.
            answers.appendChild(answer);
        }
        return answers;
    }

    /**
     * Creates a container to hold list of incorrect or correct answers.
     * @param {*} resultsContainer stores lists
     * @param {*} category is the text header of the list
     * @param {*} categoryClass is incorrect or correct
     * @param {*} list of answers in that category
     */
    getListContainer(resultsContainer, category, categoryClass, list) {
        let div = document.createElement("div");
        div.classList.add("col");
        resultsContainer.appendChild(div);

        let header = document.createElement("h4");
        header.classList.add("geo");
        header.innerText = category;
        div.appendChild(header);
        div.appendChild(this.getList(categoryClass, list));
    }

    getGeographyResults() {
        return this.geographyResults;
    }

    /**
     * Builds the visual component of the geography results scene.
     * @param {*} correct is the list of questions answered correctly
     * @param {*} incorrect is the list of questions answered incorrectly
     */
    setGeographyResults(correct, incorrect) {
        // Reset HTML.
        this.geographyResults.innerHTML = '';

        // Create main results div.
        let results = document.createElement("div");
        results.classList.add("row", "h-100", "justify-content-center", "align-items-center");
        this.geographyResults.appendChild(results);

        // Create left panel.
        let resultsLeft = document.createElement("div");
        resultsLeft.classList.add("col", "geo");
        results.appendChild(resultsLeft);

        // Add text with number of questions user answered correctly and incorrectly.
        let resultsHeader = document.createElement("h3");
        resultsHeader.classList.add("geo");

        let correctQuestions = "question", incorrectQuestions = "question";
        const numCorrect = correct.length;
        const numIncorrect = incorrect.length;
        if (numCorrect != 1)   correctQuestions += "s";
        if (numIncorrect != 1)   incorrectQuestions += "s";
        resultsHeader.innerText = `You got ${numCorrect} ${correctQuestions} correct and ${numIncorrect} ${incorrectQuestions} incorrect.`
        resultsLeft.appendChild(resultsHeader);

        // Add button which redirects user to main geography menu.
        let button = document.createElement("button");
        button.classList.add("btn", "btn-primary", "mt-4");
        let buttonText = document.createElement("h4");
        buttonText.innerHTML = "Home";
        button.appendChild(buttonText);
        button.onclick = function() {
            window.interactiveCanvas.sendTextQuery('Geography Home');
        };
        resultsLeft.append(button);

        // Create div for the list of questions.
        let resultsContainer = document.createElement("div");
        resultsContainer.classList.add("row");

        results.appendChild(resultsContainer);
        this.getListContainer(resultsContainer, "Correct", "geo-correct", correct);
        this.getListContainer(resultsContainer, "Incorrect", "geo-incorrect", incorrect);

        return this.geographyResults;
    }
}
