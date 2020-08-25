export class GeographyMain {
    menuDiv = document.createElement("div");
    menu = document.createElement("div");

    createCard(cat, backgroundColor, textColor) {
        let card = document.createElement("div");
        card.classList.add("card", "geo-category-card", backgroundColor, textColor, "text-center", "p-4");
        this.menu.appendChild(card);

        let cardText = document.createElement("h4");
        cardText.classList.add("card-body", "geo");
        cardText.innerText = cat;
        card.appendChild(cardText);

        card.onclick = function() {
            window.interactiveCanvas.sendTextQuery(cat);
        };
    }

    /**
     * Creates main geography menu.
     */
    constructor() {
        this.menuDiv.classList.add("container");

        let heading = document.createElement("h3");
        heading.classList.add("mt-5", "geo");
        heading.innerText = "Choose a Category";
        this.menuDiv.appendChild(heading);

        this.menu.classList.add("card-columns", "h-100", "mt-3");
        this.menuDiv.appendChild(this.menu);

        this.createCard("U.S. Capitals", "bg-primary", "text-white");
        this.createCard("World Capitals", "bg-dark", "text-white");
        this.createCard("U.S. States", "bg-light", "text-black");
        this.createCard("Countries", "bg-info", "text-white");
        this.createCard("Visit a City", "bg-secondary", "text-white");
    }

    getElement() {
        return this.menuDiv;
    }
}
