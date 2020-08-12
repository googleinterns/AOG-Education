export class GeographyResults {
    geographyResults = document.createElement("div");

    constructor() {
        this.geographyResults.classList.add("container", "h-100");
    }

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

    getListContainer(resultsContainer, category, categoryClass, list) {
        let div = document.createElement("div");
        div.classList.add("col-sm-6");
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

    setGeographyResults(numCorrect, numIncorrect, correct, incorrect) {
        let results = document.createElement("div");
        results.classList.add("row", "h-100", "justify-content-center", "align-items-center");
        this.geographyResults.appendChild(results);

        let resultsHeader = document.createElement("h3");
        resultsHeader.classList.add("col-sm-6", "geo");

        let correctQuestions = "question", incorrectQuestions = "question";
        if (numCorrect != 1)   correctQuestions += "s";
        if (numIncorrect != 1)   incorrectQuestions += "s";
        resultsHeader.innerText = `You got ${numCorrect} ${correctQuestions} correct and ${numIncorrect} ${incorrectQuestions} incorrect.`
        results.appendChild(resultsHeader);

        let resultsContainer = document.createElement("div");
        resultsContainer.classList.add("row");
        results.appendChild(resultsContainer);

        this.getListContainer(resultsContainer, "Correct", "geo-correct", correct);
        this.getListContainer(resultsContainer, "Incorrect", "geo-incorrect", incorrect);

        return this.geographyResults;
    }
}
