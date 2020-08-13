import {Book} from './Book.js';
/**
 * Library Book Browser Scene
 */
export class Library{
    /**
     * Initializes the game with visual components.
     */

    libraryContainer = document.createElement("div"); //aka bookshelf

    constructor() {
        this.libraryContainer.classList.add("flex-center");
        this.libraryContainer.setAttribute("id", "libraryContainer");
        let books = document.createElement("div");
        books.classList.add("bookshelf");
        
        //->temp place holder, make it dynamic
        //->add onclick on the book objects to send a textquery
        //to the backend and force a server-side scene switch to the text object
        let gw = new Book("child Stories", "./img/reading/bc.jpg");
        books.appendChild(gw.getbook());
        this.libraryContainer.appendChild(books);
    }

    //Consider using a queue to store the Books(display 3-5 at a time)
    addToLibrary(books){ 
        //Remove all children iterativley
        while (this.libraryContainer.firstChild) {
            this.libraryContainer.removeChild(this.libraryContainer.lastChild);
        }

        this.libraryContainer = books //books is assumed to be a dv containing book elements
    }

    getLibrary(){
        return this.libraryContainer;
    }

    hideLibrary(){
        this.libraryContainer.setAttribute("style","display:none");
    }

    showLibrary(){
        this.libraryContainer.setAttribute("style", "display:flex");
    }
}