import {lumin} from "./lumin.min.js";
/**
 * Book Text Viewer Scene
 */
export class Text{
    /**
     * Initializes the game with visual components.
     */

    textContainer = document.createElement("div");
    text = document.createElement("p");

    constructor() {
        this.textContainer.appendChild(this.text);
        this.textContainer.classList.add("flex-center");
        this.textContainer.setAttribute("id","book-text");
        this.text.setAttribute("style", "display: flex");
    }

    setText(newText) {
        this.text.innerText = newText;
    }

    highlight(){
        let luminator = lumin(this.textContainer);
        luminator.start(this.text.innerText.length* 50);
        this.textContainer.lastChild.setAttribute("style", "position: relative");
        this.textContainer.lastChild.lastChild.setAttribute("style", "display: flex");
    }

    showBookText(){
        this.text.setAttribute("style", "display: flex");
    }

    hideBookText(){
        this.text.setAttribute("style", "display: none");
    }

    getText() {
        return this.textContainer;
    }

    hideText(){
        this.textContainer.setAttribute("style", "display:none");
    }

    showText(){
        this.textContainer.setAttribute("style", "display:flex");
    }
}