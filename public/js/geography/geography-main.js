export class GeographyMain {
    geographyElement = document.createElement("div");
    text = document.createElement("h3");

    constructor() {
        this.geographyElement.classList.add("container", "h-100");

        this.text.classList.add("row", "h-100", "justify-content-center", "align-items-center", "geo");

        this.geographyElement.appendChild(this.text);
    }

    getGeographyElement(name) {
        if (name) {
            this.text.innerText = `What is the capital of ${name}?`;
        } else {
            this.text.innerText = "Choose a category: U.S. Capitals, World Capitals, U.S. States, or Countries."
        }
        return this.geographyElement;
    }
}
