const vision = require("@google-cloud/vision");
const fetch = require("node-fetch");
global.fetch = fetch;
const axios = require("axios");

/**
 * Fetches and image from unsplash and then analyses it to get
 * words that the image represents.
 */
exports.imageAnalysis = async function imageAnalysis() {
    const picsumURL = "https://source.unsplash.com/random/500x500";

    const photoURL = await axios.get(picsumURL).then((response) => {
        return `https://images.unsplash.com${response.request.path}`;
    });

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection(`${photoURL}`);
    const labels = result.labelAnnotations;
    return { url: photoURL, word: labels[0].description };
};
