const vision = require("@google-cloud/vision");
const fetch = require("node-fetch");
global.fetch = fetch;
const axios = require("axios");
const translation = require("./translation");

/**
 * Fetches and image from unsplash and then analyses it to get
 * words that the image represents.
 */

/**
 * Fetches and image from unsplash and then analyses it to get
 * words that the image represents.
 * @param {*} onePic is true for one pic one word and false for one pic multiple words game
 */
exports.imageAnalysis = async function imageAnalysis(onePic) {
    var unsplash;

    if (onePic) {
        unsplash = "https://source.unsplash.com/random/300x300";
    } else {
        unsplash = "https://source.unsplash.com/random/400x400";
    }

    const photoURL = await axios.get(unsplash).then((response) => {
        return `https://images.unsplash.com${response.request.path}`;
    });

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(`${photoURL}`);
    const labels = result.labelAnnotations;

    if (onePic) {
        const word = labels[0].description.toLowerCase();
        const wordTranslated = await translation
            .translateFunction(word)
            .then((value) => {
                return value;
            })
            .catch((error) => {
                console.log(error);
            });

        return { url: photoURL, word: word, wordTranslated: wordTranslated };
    } else {
        const words = [
            labels[0].description.toLowerCase(),
            labels[1].description.toLowerCase(),
            labels[2].description.toLowerCase(),
        ];

        const wordsTranslated = await translation
            .translateFunction(words)
            .then((value) => {
                return value;
            })
            .catch((error) => {
                console.log(error);
            });

        return {
            url: photoURL,
            words: words,
            wordsTranslated: wordsTranslated,
        };
    }
};
