/**
 * Text Viewer Scene
 */
export class Text {

  textContainer = document.createElement("div");
  text = document.createElement("p");
  interval;
  index;
  ranges;
  words;
  instance;

  constructor() {
    this.text.classList.add("text");
    this.textContainer.classList.add("text-container");
    this.textContainer.appendChild(this.text);
    this.instance = new Mark(this.textContainer);
  }

  setText(newText) {
    this.text.innerText = newText;
  }

  setRanges(newRanges){
      this.index = 0;
      this.ranges = newRanges;
  }

  setWords(newWords){
      this.words = newWords;
  }

  startHighlighting() {
    this.interval = setInterval(() => {
        if(this.ranges[this.index]["length"] > this.ranges[this.index]["chars"])
        {
          this.index++;
          if(this.index >= this.ranges.length)
          {
            clearInterval(this.interval);
          }
        }
        else{
          this.ranges[this.index]["length"] += 1;
          this.highlight();
        }
      }, 50);
  }

  highlight() {
    this.instance.unmark();
    this.instance.markRanges(this.ranges);
    for (let i = 0; i < this.words.length; i++) {
      this.instance.mark(this.words[i], { className: "red-highlight" });
    }
  }

  clearHighlights(){
      this.instance.unmark();
  }

  getText() {
    return this.textContainer;
  }

  hideText() {
    this.textContainer.style.display = "none";
  }

  showText() {
    this.textContainer.style.display = "block";
  }
}
