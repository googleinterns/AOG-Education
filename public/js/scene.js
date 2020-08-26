import { AogMainMenu } from "./global/aog-main-menu.js";
import { GeographyMain } from "./geography/geography-main.js";
import { GeographyMap } from "./geography/geography-map.js";
import { GeographyResults } from "./geography/geography-results.js";
import { LanguageMain } from "./language/language-main.js";
import { ReadingMain } from "./reading/ReadingMain.js";
import { OnePicOneWord } from "./language/one_pic_one_word.js";
import { OnePicMultipleWords } from "./language/one_pic_multiple_words.js";
import { Conversation } from "./language/conversation.js";
import { Vocabulary } from "./language/vocab.js";

export class Scene {
    menu = new AogMainMenu();
    geography = new GeographyMain();
    geography_map = new GeographyMap();
    geography_results = new GeographyResults();
    language = new LanguageMain();
    onePicOneWord = new OnePicOneWord();
    onePicMultipleWords = new OnePicMultipleWords();
    conversation = new Conversation();
    vocabulary = new Vocabulary();
    reading = new ReadingMain();
    game = document.getElementById("game");

    constructor() {
        this.game.appendChild(this.menu.getMenu());
    }

    aogOpenMainMenu() {
        this.game.innerHTML = "";
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
        this.game.style.display = "flex";
        this.game.style.alignItems = "center";
        this.game.removeChild(this.menu.getMenu());
        this.game.appendChild(this.reading.getReadingElement());
    }

    /**
     * Geography Section
     */

    geoMenu() {
        this.game.removeChild(this.geography_results.getGeographyResults());
        this.game.appendChild(this.geography.getGeographyElement());
    }

    /**
     * Displays capital question.
     * @param {*} data contains name of state or country in question
     */
    geoCapital(data) {
        this.geoRemoveGeographyElement();
        this.game.appendChild(this.geography.getGeographyElement(data.name));
    }

    /**
     * Loads map corresponding to state question.
     * @param {*} data stores the coordinates of the state
     */
    geoLoadStateMap(data) {
        this.geoRemoveGeographyElement();
        this.geoOpenMap("states");

        // Set map center and zoom.
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
     * Loads map corresponding to country question.
     * @param {*} data that stores the country and M49 region
     */
    geoLoadCountryMap(data) {
        this.geoRemoveGeographyElement();
        this.geoOpenMap("countries");

        // Create chart.
        this.map = new google.visualization.GeoChart(document.getElementById('map'));
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
     * @param {*} data that stores the number of questions answered correctly and incorrectly.
     */
    geoShowResults(data) {
        this.geoRemoveGeographyElement();
        this.geoRemoveMap();
        this.game.appendChild(this.geography_results.setGeographyResults(data.correct, data.incorrect));
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

    geoRemoveGeographyElement() {
        if (this.game.contains(this.geography.getGeographyElement())) {
            this.game.removeChild(this.geography.getGeographyElement());
        }
    }

    /**
     * Language Section
     */

    /**
     * Removes the menu and shows the one pic one game question
     * @param {*} data stores the english word, image url and attempts left over
     */
    startOnePicOneWord(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        const analysisWord = String(data.word);
        this.onePicOneWord.setImageURL(data.url);
        this.onePicOneWord.setWord(analysisWord, "ENGLISH");
        this.onePicOneWord.setAttempts(data.attempts);
        this.game.appendChild(this.onePicOneWord.getQuestion());
    }

    /**
     * Shows the english word after the user guesses it correctly
     * @param {*} data stores the correct english word and its translation
     */
    onePicOneWordShowEnglish(data) {
        var englishWord = `${data.word}`;
        this.onePicOneWord.setWordValue(englishWord, "english-word");

        this.onePicOneWord.showSpanishWord();
        this.onePicOneWord.setWord(data.spanish, "SPANISH");
        
        if (data.attempts != undefined) {
            this.onePicOneWord.setAttempts(data.attempts);
        }
    }

    /**
     * Shows the spanish word after the user guesses it correctly
     * @param {*} data stores the spanish word
     */
    onePicOneWordShowSpanish(data) {
        const translatedWord = String(data.word);
        this.onePicOneWord.showSpanishWord();
        this.onePicOneWord.setWordValue(translatedWord, "spanish-word");

        if (data.attempts != undefined) {
            this.onePicOneWord.setAttempts(data.attempts);
        }
    }

    /**
     * Updates the attempts left in the current game session
     * @param {*} data stores the attempts left
     */
    updateOnePicAttempts(data) {
        this.onePicOneWord.setAttempts(data);
    }

    /**
     * Provides a hint to the user in the form of a letter
     * @param {*} data stores the information to be updated on the screen
     */
    onePicShowHint(data) {
        this.onePicOneWord.setAttempts(data.attempts);
        if (data.scene == "lang_one_pic") {
            this.onePicOneWord.setWordValue(data.word, "english-word");
        } else if (data.scene == "lang_one_pic_translation") {
            this.onePicOneWord.setWordValue(data.word, "spanish-word");
        }
    }

    /**
     * Shows the answer after the attempts have ran out
     * @param {*} data stores the correct english and spanish word
     */
    showOnePicAnswer(data) {
        this.onePicOneWord.setAttempts(0);
        this.onePicOneWord.setWordValue(data.english, "english-word");
        this.onePicOneWord.showSpanishWord();
        this.onePicOneWord.setWordValue(data.spanish, "spanish-word");
    }

    /**
     * Removes the main menu and starts the one pic multiple words game session
     * @param {*} data stores the url, words and attempts left over
     */
    startOnePicMultipleWords(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        this.onePicMultipleWords.setImageURL(data.url);
        this.onePicMultipleWords.setWords(data.words, "ENGLISH");
        this.onePicMultipleWords.setWords(data.wordsTranslated, "SPANISH");
        this.onePicMultipleWords.setAttempts(data.attempts);
        this.game.appendChild(this.onePicMultipleWords.getQuestion());
        this.onePicMultipleWords.hideSpanishWords();
    }

    /**
     * Shows the english word after the user guesses it correctly
     * @param {*} data stores the correct english word and its index to be shown.
     * Also tells us if the user has guessed all english words so that the spanish
     * section can be shown.
     */
    onePicMultipleWordShowEnglish(data) {
        this.onePicMultipleWords.setWord(data.word, "english", data.index);
        if (data.showSpanish) {
            this.onePicMultipleWords.showSpanishWords();
        }
    }

    /**
     * Shows the spanish word after the user guesses it correctly
     * @param {*} data stores the correct spanish word and its index to be shown.
     */
    onePicMultipleWordShowSpanish(data) {
        this.onePicOneWord.showSpanishWord();
        this.onePicMultipleWords.setWord(data.word, "spanish", data.index);
    }

    /**
     * Updates the attempts left in the current game session
     * @param {*} data stores the attempts left
     */
    updateMultipleWordsAttempts(data) {
        this.onePicMultipleWords.setAttempts(data);
    }

    /**
     * Shows the answer after the attempts have ran out
     * @param {*} data stores the correct english and spanish words
     */
    showMultipleWordsAnswer(data) {
        this.onePicMultipleWords.setAttempts(0);
        this.onePicMultipleWords.showSpanishWords();
        for (var i = 0; i < 3; i++) {
            this.onePicMultipleWords.setWord(data.english[i], "english", i);
            this.onePicMultipleWords.setWord(data.spanish[i], "spanish", i);
        }
    }

    /**
     * Removes the menu and adds the conversation element
     * @param {*} data stores the message information to be shown at the start
     */
    startConversation(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        this.game.appendChild(this.conversation.getConversation());
        this.conversation.appendMessage(data.sender, data.text);
    }

    /**
     * Adds a regular message to the conversation
     * @param {*} data stores the message information to be shown 
     */
    addConversationMessage(data) {
        this.conversation.appendMessage(
            false,
            data.receiverMessage,
            data.receiverImage
        );
        this.conversation.appendMessage(true, data.senderMessage);
    }

    /**
     * Adds a what the user has searched to the conversation
     * @param {*} data stores the message information to be shown 
     */
    addConversationSearchMessage(data) {
        this.conversation.appendMessage(
            false,
            data.receiverMessage,
            data.receiverImage
        );
        this.conversation.appendSearchMessage(data.results, data.senderMessage);
    }

    /**
     * Opens the list of words that the user has translated
     * @param {*} data stores the words to be shown
     */
    openVocab(data) {
        if (this.game.contains(this.language.getLanguageElement()))
            this.game.removeChild(this.language.getLanguageElement());

        this.game.appendChild(this.vocabulary.getWords());
        this.vocabulary.setWords(data);
    }

    /**
     * Returns to the main menu from the current game session
     * @param {*} scene so that the correct session can be removed before
     * showing the menu
     */
    langOpenLanguageMenu(scene) {
        if (scene == "lang_one_pic" || scene == "lang_one_pic_translation") {
            this.game.removeChild(this.onePicOneWord.getQuestion());
        } else if (
            scene == "lang_multiple_words" ||
            scene == "lang_multiple_words_translation"
        ) {
            this.game.removeChild(this.onePicMultipleWords.getQuestion());
        } else if (scene == "lang_conversation") {
            this.game.removeChild(this.conversation.getConversation());
        } else if (scene == "lang_vocab") {
            this.game.removeChild(this.vocabulary.getWords());
        }
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
