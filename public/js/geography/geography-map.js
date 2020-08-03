export class GeographyMap {
    geographyMap = document.createElement("div");

    constructor() {
        this.geographyMap.setAttribute("id", "map");
    }

    getGeographyMap() {
        return this.geographyMap;
    }
}
