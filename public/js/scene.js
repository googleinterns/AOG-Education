import { AogMainMenu } from "./global/aog-main-menu.js";
import { GeographyCity } from "./geography/geography-city.js";
import { GeographyMain } from "./geography/geography-main.js";
import { GeographyMap } from "./geography/geography-map.js";
import { GeographyQuestion } from "./geography/geography-question.js";
import { GeographyResults } from "./geography/geography-results.js";
import { LanguageMain } from "./language/language-main.js";
import { ReadingMain } from "./reading/reading-main.js";

export class Scene {
    menu = new AogMainMenu();
    geography = new GeographyMain();
    geography_city = new GeographyCity();
    geography_map = new GeographyMap();
    geography_question = new GeographyQuestion();
    geography_results = new GeographyResults();
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

    openLanguage() {
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.language.getLanguageElement());
    }

    openReading() {
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.reading.getReadingElement());
    }

    /**
     * Geography Section
     */

    geoMenu() {
        this.geoRemoveGeographyResults();
        this.geoRemoveGeographyCityMenu();
        this.game.appendChild(this.geography.getGeographyElement());
    }

    /**
     * Displays capital question.
     * @param {*} data contains name of state or country in question
     */
    geoCapital(data) {
        this.geoRemoveGeographyElement();
        this.geoRemoveGeographyQuestion();
        this.game.appendChild(this.geography_question.getQuestion(data.name));
    }

    /**
     * Loads map corresponding to state question.
     * @param {*} data stores the coordinates of the state
     */
    geoLoadStateMap(data) {
        this.geoRemoveGeographyElement();
        this.geoOpenMap("states");
        this.geography_map.loadStateMap(this.map, data);
    }

    /**
     * Loads map corresponding to country question.
     * @param {*} data stores the country and M49 region
     */
    geoLoadCountryMap(data) {
        this.geoRemoveGeographyElement();
        this.geoOpenMap("countries");
        this.geography_map.loadCountryMap(this.map, data);
    }

    /**
     * @param {*} data stores the number of questions answered correctly and incorrectly.
     */
    geoShowResults(data) {
        this.geoRemoveGeographyQuestion();
        this.geoRemoveMap();
        this.game.appendChild(this.geography_results.setGeographyResults(data.correct, data.incorrect));
    }

    geoChooseCity(data) {
        this.geoRemoveGeographyElement();
        this.geoRemoveMap();
        this.game.appendChild(this.geography_city.getGeographyCityMenu(data.cities));
    }

    /**
     * Loads city street view map.
     * @param {*} data stores latitude and longitude
     */
    geoCity(data) {
        this.geoRemoveGeographyCityMenu();
        this.geoOpenMap("city");
        this.geography_map.loadCityMap(this.map, data, game);
    }

    geoForward() {
        this.geography_map.move(this.map, 1);
    }

    geoBackward() {
        this.geography_map.move(this.map, -1);
    }

    geoLeft() {
        this.geography_map.left(this.map);
    }

    geoRight() {
        this.geography_map.right(this.map);
    }

    geoUp() {
        this.geography_map.up(this.map);
    }

    geoDown() {
        this.geography_map.down(this.map);
    }

    geoOpenMap(map) {
        if (!this.game.contains(this.geography_map.getGeographyMap())) {
            this.game.appendChild(this.geography_map.getGeographyMap(map));
        }
    }

    geoRemoveMap() {
        if (this.game.contains(this.geography_map.getGeographyMap())) {
            this.game.removeChild(this.geography_map.getGeographyMap());
        }
    }

    geoRemoveGeographyCityMenu() {
        if (this.game.contains(this.geography_city.getGeographyCityMenu())) {
            this.game.removeChild(this.geography_city.getGeographyCityMenu());
        }
    }

    geoRemoveGeographyElement() {
        if (this.game.contains(this.geography.getGeographyElement())) {
            this.game.removeChild(this.geography.getGeographyElement());
        }
    }

    geoRemoveGeographyResults() {
        if (this.game.contains(this.geography_results.getGeographyResults())) {
            this.game.removeChild(this.geography_results.getGeographyResults());
        }
    }

    geoRemoveGeographyQuestion() {
        if (this.game.contains(this.geography_question.getQuestion())) {
            this.game.removeChild(this.geography_question.getQuestion());
        }
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
