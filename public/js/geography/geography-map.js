export class GeographyMap {
    geographyMap = document.createElement("div");

    constructor() {
        this.geographyMap.id = "map";
    }

    /**
     * Returns map with height styled according to question category.
     * @param {*} map is question category
     */
    getMap(map) {
        if (map == "states" || map == "city") {
            this.geographyMap.style.height = "100%";
        } else if (map == "countries") {
            this.geographyMap.style.height = "auto";
        }
        return this.geographyMap;
    }

    /**
     * Loads map centered around state in question.
     * @param {*} data contains coordinates of the state
     */
    loadStateMap(data) {
        // Set map center and zoom.
        const coords = data.coords;
        this.map = new google.maps.Map(
            this.geographyMap,
            {
                center: {
                    lat: coords[0].lat,
                    lng: coords[0].lng
                },
                zoom: 5,
                disableDefaultUI: true
            }
        );

        // Construct the polygon.
        let polygon = new google.maps.Polygon();
        polygon.setOptions({
            paths: coords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "#FF0000",
            fillOpacity: 0.35
        });
        polygon.setMap(this.map);

        // Remove map labels.
        const labelsOff = [
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "lightness": -100
                    },
                    {
                        "weight": 1
                    }
                ]
            }
        ];

        // Set map labels.
        this.map.set('styles', labelsOff);
    }

    /**
     * Loads map centered around country in question.
     * @param {*} data contains coordinates of the country
     */
    loadCountryMap(data) {
        // Create chart.
        this.map = new google.visualization.GeoChart(this.geographyMap);
        const dataTable = google.visualization.arrayToDataTable([
            ['Country'],
            [data.country],
        ]);

        // Set styling, map region, and map interactivity.
        const options = {
            backgroundColor: '#81d4fa',
            datalessRegionColor: '#ffd7e9',
            defaultColor: '#8b0000',
            region: data.region,
            tooltip: {trigger: 'none'},
        };

        // Draw map with specified country and options.
        this.map.draw(dataTable, options);
    }

    /**
     * Loads street view map of a landmark.
     * @param {*} data contains coordinates and heading of the landmark
     * @param {*} game is the game div
     */
    loadCityMap(data, game) {
        // Create map.
        this.map = new google.maps.StreetViewPanorama(this.geographyMap,
            {
                position: {
                    lat: data.lat,
                    lng: data.lng
                },
                pov: {
                    heading: data.heading,
                    pitch: 0
                },
                zoom: 1,
                disableDefaultUI: true
            }
        );

        // Add back button.
        let back = document.createElement("button");
        back.classList.add("map", "btn", "btn-sm", "btn-danger", "text-dark",
            "fixed-top", "rounded-circle", "font-weight-bold");
        back.id = "geo-back";
        back.innerText = "x";
        game.appendChild(back);
        back.onclick = function() {
            window.interactiveCanvas.sendTextQuery('Close map');
            back.remove();
        };
    }

    /**
     * Set heading of the street view map.
     * @param {*} headingChange is the number of degress the heading will change.
     */
    setHeading(headingChange) {
        this.map.setPov(
            {
                heading: (this.map.pov.heading + headingChange) % 360,
                pitch: this.map.pov.pitch,
                zoom: this.map.zoom
            }
        );
    }

    /**
     * Set pitch of the street view map.
     * @param {*} pitchChange is the number of degress the pitch will change.
     */
    setPitch(pitchChange) {
        let pitch = this.map.pov.pitch + pitchChange;
        if (pitch > 90)	pitch = 90;
        else if (pitch < -90)	pitch = -90;
        this.map.setPov({heading: this.map.pov.heading, pitch: pitch, zoom: this.map.zoom});
    }

    /**
     * Turn street view map to the left by 45 degrees.
     */
    left() {
        this.setHeading(-45);
    }

    /**
     * Turn street view map to the right by 45 degrees.
     */
    right() {
        this.setHeading(45);
    }

    /**
     * Shift street view map up by 30 degrees.
     */
    up() {
        this.setPitch(30);
    }

    /**
     * Shift street view map down by 30 degrees.
     */
    down() {
        this.setPitch(-30);
    }

    /**
     * Calculate the difference between the current map heading and the
     * link map heading.
     * @param {*} link is the another map div
     */
    difference(link) {
        let diff = Math.abs(this.map.pov.heading % 360 - link.heading);
        if (diff > 180) diff = Math.abs(360 - diff);

        return diff;
    }

    /**
     * Move forward or backward in street view map.
     * @param {*} factor is 1 to move forward or -1 to move backward
     */
    move(factor) {
        let cur;
        let links = this.map.getLinks();

        // Find the direction to move in.
        for (let i = 0; i < links.length; i++) {
            if (cur == undefined || (factor * this.difference(cur)) >
               (factor * this.difference(links[i]))) {
                cur = links[i];
            }
        }

        this.map.setPano(cur.pano);
    }
}
