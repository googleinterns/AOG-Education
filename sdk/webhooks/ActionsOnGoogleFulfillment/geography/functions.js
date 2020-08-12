// Load state and country data.
const _ = require("lodash");
const geo_states_file = require("./states");
const geo_countries_file = require("./countries");
const states = geo_states_file.states;
const countries = geo_countries_file.countries;

// Map question bank, master question bank, index, and answer
// entries to indicies in conv.user.params.category.
const entries = {
    "bank": 0,
    "master": 1,
    "index": 2,
    "answer": 3
}

/**
 * Reset question bank if null or empty.
 * @param {*} questions contains questions left to ask
 * @param {*} bank is the master question bank
 */
function cloneQuestionBank(questions, bank) {
    if (!questions || questions.length == 0) {
        return _.cloneDeep(bank).splice(0, bank.length - 1);
    }
    return questions;
}

/**
 * Set question banks for each category of questions.
 */
function setQuestionBank(conv) {
    conv.user.params.category.STATE[entries.bank] = cloneQuestionBank(
        conv.user.params.category.STATE[entries.bank], states);
    conv.user.params.category.US_CAPITAL[entries.bank] = cloneQuestionBank(
        conv.user.params.category.US_CAPITAL[entries.bank], states);
    conv.user.params.category.COUNTRY[entries.bank] = cloneQuestionBank(
        conv.user.params.category.COUNTRY[entries.bank], countries);
    conv.user.params.category.WORLD_CAPITAL[entries.bank] = cloneQuestionBank(
        conv.user.params.category.WORLD_CAPITAL[entries.bank], countries);
}

function getQuestionBank(conv) {
    return conv.user.params.category[conv.session.params.geo_category][0];
}

/**
 * Randomly generate a new question.
 */
function getQuestion(conv) {
    setQuestionBank(conv);
    let questions = getQuestionBank(conv);
    const ind = parseInt(Math.random() * questions.length);
    conv.user.params.category[conv.session.params.geo_category][entries.ind] = ind;
    conv.session.params.geo_name = questions[ind][0];
    conv.session.params.geo_capital = questions[ind][1];

    // Store region when asking country question.
    if (conv.session.params.geo_category == "COUNTRY") {
        conv.session.params.geo_region = questions[ind][2];
    }

    // Store answer based on whether questions ask for name or capital.
    if (conv.session.params.geo_category == "STATE" ||
            conv.session.params.geo_category == "COUNTRY") {
        conv.user.params.category[conv.session.params.geo_category]
            [entries.answer] = conv.session.params.geo_name;
    } else {
        conv.user.params.category[conv.session.params.geo_category]
            [entries.answer] = conv.session.params.geo_capital;
    }

    conv.session.params.geo_num_questions_left--;
}

/**
 * Initialize the question bank, master question bank, index, and answer for
 * each category, as well as the number of questions left to ask and the
 * questions answered correctly and incorrectly.
 */
function setup(conv) {
    if (!conv.user.params.category) {
        conv.user.params.category = {
            "US_CAPITAL": [[], states, -1, null],
            "STATE": [[], states, -1, null],
            "COUNTRY": [[], countries, -1, null],
            "WORLD_CAPITAL": [[], countries, -1, null]
        };
    }
    setQuestionBank(conv);
    conv.session.params.geo_num_questions_left = 2;
    conv.session.params.geo_correct = [];
    conv.session.params.geo_incorrect = [];
}

/**
 * Get the correct answer to the question asked.
 */
function getCorrectAnswer(conv) {
    return conv.user.params.category[conv.session.params.geo_category][entries.answer];
}

/**
 * Check if user response is the correct answer.
 */
function isCorrect(conv, answer) {
    return (conv.intent.params.answer.resolved.includes(answer) ||
           // Assistant interprets the capital of Alaska as Juno.
           (conv.session.params.geo_category == "US_CAPITAL" &&
            conv.session.params.geo_state == "Alaska" &&
            conv.intent.params.answer.resolved.includes("Juno")));
}

/**
 * Remove question from question bank.
 */
function removeQuestion(conv) {
    conv.user.params.category[conv.session.params.geo_category]
        [entries.bank].splice(conv.user.params.category
        [conv.session.params.geo_category][entries.index], 1);
}

/**
 * Remove element from array by value.
 */
function removeElementByValue(arr, item) {
    let index = arr.indexOf(item);
    arr.splice(index, 1);
}

module.exports = {
    getQuestion,
    setup,
    getCorrectAnswer,
    isCorrect,
    removeQuestion,
    removeElementByValue
};
