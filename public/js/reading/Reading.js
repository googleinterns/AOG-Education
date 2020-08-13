import {Library} from './components/Library.js';
import {Text} from './components/Text.js';
/**
 * Represent Home scene
 */

export class Reading{
  /**
   * Initializes the game with visual components.
   */

  view = document.createElement("div");
  library = new Library();
  text = new Text();

  constructor() {
    // set up fps monitoring
    // const stats = new Stats();
    // this.view.getElementsByClassName('stats')[0].appendChild(stats.domElement);
    
    this.view.setAttribute("id", "reading");
    this.view.appendChild(this.library.getLibrary());
    this.view.appendChild(this.text.getText());
    this.openLibrary();
  }

  openText(){
    this.text.showText();
    this.library.hideLibrary();
  }

  openLibrary(){
    this.text.hideText();
    this.library.showLibrary();
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
