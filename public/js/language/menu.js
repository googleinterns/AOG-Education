/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represent Triangle scene
 */
export class Menu {
    /**
     * Initializes the game with visual components.
     */

    menu = document.createElement("div");

    constructor() {
        this.menu.id = "math-menu";
        this.menu.classList.add(
            "container",
            "align-items-center",
            "justify-content-center"
        );

        const menuRow = document.createElement("div");
        menuRow.classList.add("row");

        menuRow.appendChild(this.createMenuElement("One Pic One Word"));
        menuRow.appendChild(this.createMenuElement("One Pic Multiple Words"));
        menuRow.appendChild(this.createMenuElement("Vocabulary"));
        this.menu.appendChild(menuRow);
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

    getMenu() {
        return this.menu;
    }
}
