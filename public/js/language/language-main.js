import { OnePicOneWord } from "./one_pic_one_word.js";

export class LanguageMain {
    languageElement = document.createElement("div");
    onePicOneWord = new OnePicOneWord();

    constructor() {
        this.languageElement.id = "math-menu";
        this.languageElement.classList.add(
            "container",
            "align-items-center",
            "justify-content-center"
        );

        const menuRow = document.createElement("div");
        menuRow.classList.add("row");

        menuRow.appendChild(this.createMenuElement("One Pic One Word"));
        menuRow.appendChild(this.createMenuElement("One Pic Multiple Words"));
        menuRow.appendChild(this.createMenuElement("Vocabulary"));
        menuRow.appendChild(this.createMenuElement("Conversation"));
        this.languageElement.appendChild(menuRow);
    }

    /**
     * Creates a card to be shown on the main menu screen
     * @param {*} titleText is the title of sub game to be selected
     */
    createMenuElement(titleText) {
        const menuCol = document.createElement("div");
        menuCol.classList.add("col-6", "math-menu-card");

        const card = document.createElement("div");
        card.classList.add("card");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title", "text-center");
        cardTitle.innerText = titleText;

        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        menuCol.appendChild(card);

        return menuCol;
    }

    getLanguageElement() {
        return this.languageElement;
    }
}
