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

    loadStateMap(data) {
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

    loadCountryMap(data) {
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

    /**
     * Language Section
     */

    /**
     * Starts the One Pic One Word game by hiding the language main menu 
     * then displaying the onePicOneWord question.
     * @param {*} data that stores the url for the picture and the word to be guessed
     */

    langStartOnePicOneWord(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        const analysisWord = String(data.analysis.word);
        var englishWord = `English ${analysisWord} : `;
        // Show underscores to signal the length of the word to be guessed
        for (var i = 0; i < analysisWord.length; i++) {
            englishWord += "_ ";
        }

        this.language.onePicOneWord.hideSpanishWord();
        this.language.onePicOneWord.setWord(englishWord);
        this.language.onePicOneWord.setImageURL(data.analysis.url);
        this.game.appendChild(this.language.onePicOneWord.getOnePicOneWordQuestion());
    }

    /**
     * Shows the english word after the player guesses it correctly
     * @param {*} data that stores the correct word to be guessed
     */
    langOnePicOneWordShowEnglish(data) {
        var englishWord = `English : ${data.word}`;
        this.language.onePicOneWord.setWord(englishWord);

        this.language.onePicOneWord.showSpanishWord();
        var spanishWord = `Spanish : `;
        // Show underscores to signal the length of the word to be guessed
        for (var i = 0; i < 8; i++) {
            spanishWord += "_ ";
        }
        this.language.onePicOneWord.setSpanishWord(spanishWord);
    }

    /**
     * Shows the spanish word after the player guesses it correctly
     * @param {*} data that stores the correct word to be guessed
     */
    langOnePicOneWordShowSpanish(data) {
        const translatedWord = String(data.word);
        this.language.onePicOneWord.showSpanishWord();
        var spanishWord = `Spanish : ${translatedWord}`;
        this.language.onePicOneWord.setSpanishWord(spanishWord);
    }

    /**
     * Hides the current game that is being shown and shows the language main menu
     */
    langOpenLanguageMenu() {
        this.game.removeChild(this.language.onePicOneWord.getOnePicOneWordQuestion());
        this.game.appendChild(this.language.getLanguageElement());
    }

    createCanvas() {
        // Initialize rendering and set correct sizing.
        this.ratio = window.devicePixelRatio;
        this.renderer = PIXI.autoDetectRenderer({
            transparent: true,
            antialias: true,
            resolution: this.ratio,
            width: this.game.clientWidth,
            height: this.game.clientHeight,
        });
        this.element = this.renderer.view;
        this.element.style.width = `${this.renderer.width / this.ratio}px`;
        this.element.style.height = `${this.renderer.height / this.ratio}px`;
        this.game.appendChild(this.element);
    }
}
