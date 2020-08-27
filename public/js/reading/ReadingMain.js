import {Library} from './components/Library.js';
import {Text} from './components/Text.js';

/**
 * Represent Home scene
 */
export class ReadingMain{

  view = document.createElement("div");
  library = new Library();
  text = new Text();

  constructor() {
    this.view.setAttribute("id", "reading");
    this.view.appendChild(this.library.getLibrary());
  }

  openText(){
    this.view.removeChild(this.library.getLibrary());
    this.view.appendChild(this.text.getText());
    this.text.loadPageFlipper(); //do it here so that the dom is properly updated first
  }

  openLibrary(){
    this.view.removeChild(this.text.getText());
    this.view.appendChild(this.library.getLibrary());
  }

  getLibrary(){
    return this.library;
  }

  getText(){
    return this.text;
  }

  getReadingElement() {
    return this.view;
  }
}
