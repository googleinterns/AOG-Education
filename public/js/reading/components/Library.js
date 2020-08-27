import {Book} from './Book.js';
/**
 * Library Book Browser Scene
 */
export class Library{
    /**
     * Initializes the game with visual components.
     */

    libraryContainer = document.createElement("div"); //aka bookshelf
    books = document.createElement("div");
    shelf = document.createElement("div");
    bookObjects= [];

    constructor() {
        let left = document.createElement("div");
        let right = document.createElement("div");
        let reflect = document.createElement("div");

        this.shelf.classList.add("shelf");
        left.classList.add("bookend_left");
        right.classList.add("bookend_right");
        reflect.classList.add("reflection");

        this.shelf.appendChild(left);
        this.shelf.appendChild(right);
        this.shelf.appendChild(reflect);

        this.libraryContainer.setAttribute("id", "libraryContainer");
        this.libraryContainer.appendChild(this.shelf);
    }

    addToLibrary(books){ 
        this.books.classList.add("books");
        for(let i = 0; i < books.length; i++)
        {
            let gw = new Book(books[i]["title"], books[i]["imgSrc"]);
            gw.setProgress(Math.round(books[i]["chunkNumber"] * 100)); 
            this.bookObjects.push(gw);
            this.books.appendChild(gw.getBook());
        }
        
        this.libraryContainer.prepend(this.books);
    }

    clearLibrary(){
        //removes the bookshelf container, assume only one
        if(this.libraryContainer.firstChild){
            this.libraryContainer.removeChild(this.libraryContainer.firstChild);
        }
    }

    updateProgress(progress){
        while (this.books.firstChild) {
            this.books.removeChild(this.books.lastChild);
        }

        for(let i = 0; i < this.bookObjects.length; i++)
        {
            this.bookObjects[i].removeAnimation();
            this.bookObjects[i].setProgress(Math.round(progress[i] * 100)); //updates each book's current progress level
            this.books.appendChild(this.bookObjects[i].getBook());
        }
    }

    getLibrary(){
        return this.libraryContainer;
    }

}