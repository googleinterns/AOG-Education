export class GeographyCity {
    menuDiv = document.createElement("div");
    menu = document.createElement("div");

    /**
     * Build main layout of the page that allows user to choose a city.
     */
    constructor() {
        this.menuDiv.classList.add("container");

        // Page heading.
        let headingDiv = document.createElement("div");
        headingDiv.classList.add("row", "h-25");
        this.menuDiv.appendChild(headingDiv);

        let heading = document.createElement("h3");
        heading.classList.add("mt-5", "geo", "col-10");
        heading.innerText = "Choose a Place";
        headingDiv.appendChild(heading);

        // Button to navigate back to the geography home page.
        let mainMenu = document.createElement("button");
        mainMenu.classList.add("geo", "btn", "btn-secondary", "btn-block", "col", "h-25");
        mainMenu.innerText = "Home";
        headingDiv.appendChild(mainMenu);
        mainMenu.onclick = function() {
            window.interactiveCanvas.sendTextQuery("Geography Home");
        };
    }

    /**
     * Creates card containing the landmark and the city it is in.
     * @param {*} landmark is a landmark user can visit
     * @param {*} city is the city the landmark it is in
     */
    createCard(landmark, city) {
        let card = document.createElement("div");
        card.classList.add("card", "geo-city-card", "bg-primary", "text-white", "text-center", "p-2");
        this.menu.appendChild(card);

        // Title of card is landmark.
        let cardTitle = document.createElement("h4");
        cardTitle.classList.add("card-title");
        cardTitle.innerText = landmark;
        card.appendChild(cardTitle);

        // Text of card is city.
        let cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.innerText = city;
        card.appendChild(cardText);

        // Option for user to click a card to visit the corresponding city.
        card.onclick = function() {
            window.interactiveCanvas.sendTextQuery(city);
        };
    }

    /**
     * Create a card for each city given.
     * @param {*} cities is an array of the available cities
     */
    getCityMenu(cities) {
        if (cities) {
            this.menu.innerHTML = '';
            this.menu.classList.add("card-columns", "h-100", "mt-3");
            this.menuDiv.appendChild(this.menu);
            cities.forEach(city => this.createCard(city[2], city[0] + ", " + city[1]));
        }
        return this.menuDiv;
    }
}
