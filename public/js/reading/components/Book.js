/**
 * Book Card Object for displays only
 */
export class Book{
    /**
     * Initializes the game with visual components.
     */

    title = document.createElement("p");
    img = document.createElement("img");
    bookContainer = document.createElement("div");


    constructor(title, src) {
        this.bookContainer.classList.add("book");
        this.title.innerHTML = title;
        this.img.src = src;

        this.bookContainer.appendChild(this.title);
        this.bookContainer.appendChild(this.img);
    }

    setImg(newSrc) {
        this.img.src = newSrc;
    }

    setTitle(newTitle) {
       this.title.innerHTML = newTitle; 
    }

    getImg(){
        return this.img;
    }

    getTitle(){
        return this.title;
    }

    getBook(){
        return this.bookContainer;
    }
}