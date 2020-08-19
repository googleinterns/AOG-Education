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
    }

    //consider using a queue
    addToLibrary(books){ 
        let bookshelf = document.createElement("div");
        bookshelf.classList.add("bookshelf");
        for(let i = 0; i < books.length; i++)
        {
            let gw = new Book(books[i]["title"], books[i]["imgSrc"]);
            bookshelf.appendChild(gw.getBook());
        }
        
        this.libraryContainer.appendChild(bookshelf);
    }

    clearLibrary(){
        //removes the bookshelf container
        if(this.libraryContainer.lastChild){
            this.libraryContainer.removeChild(this.libraryContainer.lastChild);
        }
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