export class GeographyMain {
    geographyElement = document.createElement("div");

    constructor() {
        this.geographyElement.classList.add(
            "container",
            "h-100",
        );

        const greeting = document.createElement("h3");
        greeting.classList.add("row", "h-100", "justify-content-center", "align-items-center");
        greeting.innerText = "Hi, Welcome to Geography"
        this.geographyElement.appendChild(greeting);
    }

    getGeographyElement() {
        return this.geographyElement;
    }
}
