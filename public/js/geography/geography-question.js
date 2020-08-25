export class GeographyQuestion {
    container = document.createElement("div");
    cardInner = document.createElement("div");

    /**
     * Creates geography question cards.
     */
    constructor() {
        this.container.classList.add("h-100", "justify-content-center", "d-flex", "align-items-center");

        this.cardInner.classList.add("geo", "h-50", "w-50", "card-inner");
        this.container.appendChild(this.cardInner);

        this.front = this.createCard("front");
        this.back = this.createCard("back");
    }

    /**
     * Flips card to reveal answer.
     */
    flipCard() {
        this.cardInner.classList.toggle("flip-card-inner");
    }

    /**
     * Creates question card.
     * @param {*} side is the question ("front") or answer ("back")
     */
    createCard(side) {
        // Create card.
		let card = document.createElement("div");
        card.classList.add("geo", "h-100", "card", "bg-light", "border-primary", side, "rounded");
        this.cardInner.appendChild(card);

        // Create card body.
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "ml-3");
        card.appendChild(cardBody);

        // Add text.
        let text = document.createElement("h3");
        text.classList.add("geo", "row", "h-100", "align-items-center");
        cardBody.appendChild(text);
        
        return text;
    }

    /**
     * Changes text displayed based on scene.
     * @param {*} name of state or country
     * @param {*} answer of question
     */
    getQuestion(name, answer) {
        if (name) {
            this.front.innerText = `What is the capital of ${name}?`;
            this.back.innerText = answer;
        }
        return this.container;
    }
}
