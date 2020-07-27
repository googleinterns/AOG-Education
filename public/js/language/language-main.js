export class LanguageMain {
    languageElement = document.createElement("div");

    constructor() {
        this.languageElement.classList.add(
            "container",
            "h-100",
        );

        const greeting = document.createElement("h3");
        greeting.classList.add("row", "h-100", "justify-content-center", "align-items-center");
        greeting.innerText = "Hi, Welcome to Language"
        this.languageElement.appendChild(greeting);
    }

    getLanguageElement() {
        return this.languageElement;
    }
}
