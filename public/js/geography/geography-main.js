export class GeographyMain {
    geographyElement = document.createElement("div");

    constructor() {
        this.geographyElement.classList.add(
            "container",
            "h-100",
        );

        const greeting = document.createElement("h3");
        greeting.classList.add("row", "h-100", "justify-content-center", "align-items-center");
        greeting.innerText = "Choose a category: U.S. Capitals, World Capitals, U.S. States, or Countries."
        this.geographyElement.appendChild(greeting);

        // let app = new PIXI.Application();
        // app.renderer.backgroundColor = 0xffffff;

        // // Draw rounded rectangle.
        // let roundBox = new PIXI.Graphics();
        // roundBox.lineStyle(4, 0x99CCFF, 1);
        // roundBox.beginFill(0xFF9933);
        // roundBox.drawRoundedRect(0, 0, 100, 30, 10)
        // roundBox.endFill();
        // roundBox.x = 0;
        // roundBox.y = 50%;
        // app.stage.addChild(roundBox);

        // this.geographyElement.appendChild(app.view);
    }

    getGeographyElement() {
        return this.geographyElement;
    }
}
