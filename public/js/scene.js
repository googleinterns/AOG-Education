export class Scene {
  /**
   * Initializes the game with visual components.
   */
  constructor() {
    const view = document.getElementById('view');
  
    // Set up fps monitoring.
    const stats = new Stats();
    view.getElementsByClassName('stats')[0].appendChild(stats.domElement);
  
    // Initialize rendering and set correct sizing.
    this.ratio = window.devicePixelRatio;
    this.renderer = PIXI.autoDetectRenderer({
      transparent: true,
      antialias: true,
      resolution: this.ratio,
      width: view.clientWidth,
      height: view.clientHeight,
    });
    this.element = this.renderer.view;
    this.element.style.width = `${this.renderer.width / this.ratio}px`;
    this.element.style.height = `${this.renderer.height / this.ratio}px`;
    view.appendChild(this.element);
  }
}