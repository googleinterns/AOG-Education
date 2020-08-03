export class ReadingMain {
    readingElement = document.createElement("div");

    constructor() {
        this.readingElement.classList.add(
            "container",
            "h-100",
        );

        const greeting = document.createElement("h3");
        greeting.classList.add("row", "h-100", "justify-content-center", "align-items-center");
        greeting.innerText = "Hi, Welcome to Reading"
        this.readingElement.appendChild(greeting);
    }

    getReadingElement() {
        return this.readingElement;
    }
}
