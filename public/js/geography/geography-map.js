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
        if (map == "states" || map == "city") {
            this.geographyMap.style.height = "100%";
        } else if (map == "countries") {
            this.geographyMap.style.height = "auto";
        }
        return this.geographyMap;
    }

    setHeading(map, headingChange) {
        map.setPov({heading: (map.pov.heading + headingChange) % 360, pitch: map.pov.pitch, zoom: map.zoom});
    }
    
    setPitch(map, pitchChange) {
        let pitch = map.pov.pitch + pitchChange;
        if (pitch > 90)	pitch = 90;
        else if (pitch < -90)	pitch = -90;
        map.setPov({heading: map.pov.heading, pitch: pitch, zoom: map.zoom});
    }
    
    left(map) {
        this.setHeading(map, -45);
    }
    
    right(map) {
        this.setHeading(map, 45);
    }
    
    up(map) {
        this.setPitch(map, 30);
    }
    
    down(map) {
        this.setPitch(map, -30);
    }
    
    difference(map, link) {
        let diff = Math.abs(map.pov.heading % 360 - link.heading);
        if (diff > 180) diff = Math.abs(360 - diff);
           
        return diff;
    }
    
    move(map, factor) {
        let cur;
        let links = map.getLinks();
        for (let i = 0; i < links.length; i++) {
            if (cur == undefined || (factor * this.difference(map, cur)) > (factor * this.difference(map, links[i]))) {
                cur = links[i];
            }
        }
        map.setPano(cur.pano);
    }
}
