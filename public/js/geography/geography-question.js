export class GeographyQuestion {
    question = document.createElement("div");
    text = document.createElement("h3");

    /**
     * Creates main scene with one text element.
     */
    constructor() {
        this.question.classList.add("container", "h-100");

        this.text.classList.add("row", "h-100", "justify-content-center", "align-items-center", "geo");

        this.question.appendChild(this.text);
    }

    /**
     * Changes text displayed based on scene.
     * @param {*} name of state or country
     */
    getQuestion(name) {
        if (name) {
            this.text.innerText = `What is the capital of ${name}?`;
        }
        return this.question;
    }
}
