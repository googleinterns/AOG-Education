export class GeographyMap {
    geographyMap = document.createElement("div");

    constructor() {
        this.geographyMap.id = "map";
    }

    getGeographyMap(map) {
        if (map == "states") {
            this.geographyMap.style.height = "100%";
        }
        return this.geographyMap;
    }
}
