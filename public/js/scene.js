import { AogMainMenu } from "./global/aog-main-menu.js";
import { GeographyMain } from "./geography/geography-main.js";
import { GeographyMap } from "./geography/geography-map.js";
import { LanguageMain } from "./language/language-main.js";
import { ReadingMain } from "./reading/reading-main.js";

export class Scene {
    menu = new AogMainMenu();
    geography = new GeographyMain();
    geography_map = new GeographyMap();
    language = new LanguageMain();
    reading = new ReadingMain();
    game = document.getElementById("game");

    constructor() {
        this.game.appendChild(this.menu.getMenu());
    }

    openGeography() {
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.geography.getGeographyElement());
    }

    loadStateMap() {
        if (!this.map)  this.openGeographyMap();

        const coords = data.coords;
        this.map = new google.maps.Map(document.getElementById('map'));
        this.map.setCenter({lat: coords[0].lat, lng: coords[0].lng});
        this.map.setZoom(5);

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
        this.map.set('styles', labelsOff);
    }

    loadCountryMap() {
        if (!this.map) this.openGeographyMap();

        this.map = new google.visualization.GeoChart(document.getElementById('map'));
        const dataTable = google.visualization.arrayToDataTable([
            ['Country'],
            [data.country],
        ]);

        const options = {
            backgroundColor: '#81d4fa',
            datalessRegionColor: '#ffd7e9',
            defaultColor: '#8b0000',
            region: data.region,
            tooltip: {trigger: 'none'},
        };

        this.map.draw(dataTable, options);
    }

    openGeographyMap() {
        this.game.removeChild(this.geography.getGeographyElement());
        this.game.appendChild(this.geography_map.getGeographyMap());
    }

    openLanguage() {
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.language.getLanguageElement());
    }

    openReading() {
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.reading.getReadingElement());
    }
}
