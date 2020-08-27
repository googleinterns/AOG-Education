/**
 * Book Card Object for displays only
 */
export class Book{
    /**
     * Initializes the game with visual components.
     */

    title = "";
    img = document.createElement("img");
    bookContainer = document.createElement("div");
    progressBar = document.createElement("div");


    constructor(title, src) {
        this.bookContainer.classList.add("book");
        this.title = title;
        this.img.src = src;

        this.bookContainer.appendChild(this.img);

        this.progressBar.classList.add("myProgress");
        let greenBar = document.createElement("div");
        greenBar.classList.add("myBar");

        this.progressBar.appendChild(greenBar);
        this.bookContainer.appendChild(this.progressBar);

        this.bookContainer.onclick = () => {this.openBook();}
        this.img.onclick = () => {this.bookContainer.click();}
        this.progressBar.onclick = () => {this.bookContainer.click();}
    }

    openBook(){ 
        this.bookContainer.setAttribute("data-micron","fade");
        window.interactiveCanvas.sendTextQuery(this.title); //triggers book selection
    }

    removeAnimation(){
        this.bookContainer.removeAttribute("data-micron");
        this.bookContainer.classList.remove("mjs-fade", "mjs-ease-in-out");
        this.bookContainer.style.removeProperty("animation-duration");
    }

    setProgress(percent){
        this.progressBar.firstChild.innerHTML = `${percent}%`;
        this.progressBar.firstChild.style.width = `${percent}%`;
    }

    getBook(){
        return this.bookContainer;
    }
}