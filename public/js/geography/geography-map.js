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
     * @param {*} map is the map div
     * @param {*} data contains coordinates of the state
     */
    loadStateMap(map, data) {
        // Set map center and zoom.
        const coords = data.coords;
        map = new google.maps.Map(
            document.getElementById("map"),
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
        polygon.setMap(map);

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
        map.set('styles', labelsOff);
    }

    /**
     * Loads map centered around country in question.
     * @param {*} map is the map div
     * @param {*} data contains coordinates of the country
     */
    loadCountryMap(map, data) {
        // Create chart.
        map = new google.visualization.GeoChart(document.getElementById('map'));
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
        map.draw(dataTable, options);
    }

    /**
     * Loads street view map of a landmark.
     * @param {*} map is the map div
     * @param {*} data contains coordinates and heading of the landmark
     * @param {*} game is the game div
     */
    loadCityMap(map, data, game) {
        // Create map.
        map = new google.maps.StreetViewPanorama(
            document.getElementById("map"),
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
     * @param {*} map is the map div
     * @param {*} headingChange is the number of degress the heading will change.
     */
    setHeading(map, headingChange) {
        map.setPov({heading: (map.pov.heading + headingChange) % 360, pitch: map.pov.pitch, zoom: map.zoom});
    }

    /**
     * Set pitch of the street view map.
     * @param {*} map is the map div
     * @param {*} pitchChange is the number of degress the pitch will change.
     */
    setPitch(map, pitchChange) {
        let pitch = map.pov.pitch + pitchChange;
        if (pitch > 90)	pitch = 90;
        else if (pitch < -90)	pitch = -90;
        map.setPov({heading: map.pov.heading, pitch: pitch, zoom: map.zoom});
    }

    /**
     * Turn street view map to the left by 45 degrees.
     * @param {*} map is the map div
     */
    left(map) {
        this.setHeading(map, -45);
    }

    /**
     * Turn street view map to the right by 45 degrees.
     * @param {*} map is the map div
     */
    right(map) {
        this.setHeading(map, 45);
    }

    /**
     * Shift street view map up by 30 degrees.
     * @param {*} map is the map div
     */
    up(map) {
        this.setPitch(map, 30);
    }

    /**
     * Shift street view map down by 30 degrees.
     * @param {*} map is the map div
     */
    down(map) {
        this.setPitch(map, -30);
    }

    /**
     * Calculate the difference between the current map heading and the
     * link map heading.
     * @param {*} map is the map div
     * @param {*} link is the another map div
     */
    difference(map, link) {
        let diff = Math.abs(map.pov.heading % 360 - link.heading);
        if (diff > 180) diff = Math.abs(360 - diff);
           
        return diff;
    }

    /**
     * Move forward or backward in street view map.
     * @param {*} map is the map div
     * @param {*} factor is 1 to move forward or -1 to move backward
     */
    move(map, factor) {
        let cur;
        let links = map.getLinks();

        // Find the direction to move in.
        for (let i = 0; i < links.length; i++) {
            if (cur == undefined || (factor * this.difference(map, cur)) > (factor * this.difference(map, links[i]))) {
                cur = links[i];
            }
        }

        map.setPano(cur.pano);
    }
}
