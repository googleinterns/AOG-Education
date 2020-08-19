export class GeographyMap {
    geographyMap = document.createElement("div");

    constructor() {
        this.geographyMap.id = "map";
    }

    /**
     * Returns map with height styled according to question category.
     * @param {*} map is question category
     */
    getGeographyMap(map) {
        if (map == "states") {
            this.geographyMap.style.height = "100%";
        } else if (map == "countries") {
            this.geographyMap.style.height = "auto";
        }
        return this.geographyMap;
    }
}
