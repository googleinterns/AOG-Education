export class GeographyCity {
    menuDiv = document.createElement("div");
    menu = document.createElement("div");

    /**
     * Creates main scene with one text element.
     */
    constructor() {
        this.menuDiv.classList.add("container");

        let headingDiv = document.createElement("div");
        headingDiv.classList.add("row", "h-25");
        this.menuDiv.appendChild(headingDiv);

        let heading = document.createElement("h3");
        heading.classList.add("mt-5", "geo", "col-10");
        heading.innerText = "Choose a Place";
        headingDiv.appendChild(heading);

        let mainMenu = document.createElement("button");
        mainMenu.classList.add("geo", "btn", "btn-secondary", "btn-block", "col", "h-25");
        mainMenu.innerText = "Home";
        headingDiv.appendChild(mainMenu);
        mainMenu.onclick = function() {
            window.interactiveCanvas.sendTextQuery("Geography Home");
        };
    }

    createCard(landmark, city) {
        let card = document.createElement("div");
        card.classList.add("card", "geo-city-card", "bg-primary", "text-white", "text-center", "p-2");
        this.menu.appendChild(card);
      
        let cardTitle = document.createElement("h4");
        cardTitle.classList.add("card-title");
        cardTitle.innerText = landmark;
        card.appendChild(cardTitle);
        
        let cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.innerText = city;
        card.appendChild(cardText);

        card.onclick = function() {
            window.interactiveCanvas.sendTextQuery(city);
        };
    }

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
