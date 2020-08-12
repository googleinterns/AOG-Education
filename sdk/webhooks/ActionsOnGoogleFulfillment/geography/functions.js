// Load state and country data.
const _ = require("lodash");
const geo_states_file = require("./states");
const geo_countries_file = require("./countries");
const states = geo_states_file.states;
const countries = geo_countries_file.countries;

function cloneQuestionBank(questions, bank) {
    if (!questions || questions.length == 0) {
        return _.cloneDeep(bank).splice(0, bank.length - 1);
    }
    return questions;
}

/**
 * Load states and countries data.
 */
function setQuestionBank(conv) {
    conv.user.params.geo_state_questions = cloneQuestionBank(
        conv.user.params.geo_state_questions, states);
    conv.user.params.geo_state_capital_questions = cloneQuestionBank(
        conv.user.params.geo_state_capital_questions, states);
    conv.user.params.geo_country_questions = cloneQuestionBank(
        conv.user.params.geo_country_questions, countries);
    conv.user.params.geo_country_capital_questions = cloneQuestionBank(
        conv.user.params.geo_country_capital_questions, countries);
}

function getQuestionBank(conv) {
    if (conv.session.params.geo_category == "STATE") {
        return conv.user.params.geo_state_questions;
    } else if (conv.session.params.geo_category == "US_CAPITAL") {
        return conv.user.params.geo_state_capital_questions;
    } else if (conv.session.params.geo_category == "COUNTRY") {
        return conv.user.params.geo_country_questions;
    } else if (conv.session.params.geo_category == "WORLD_CAPITAL") {
        return conv.user.params.geo_country_capital_questions;
    }
}

/**
 * Randomly generate a new state question.
 */
function getNewStateQuestion(conv) {
    setQuestionBank(conv);
    let states = getQuestionBank(conv);
    const ind = parseInt(Math.random() * states.length);
    conv.session.params.geo_state_ind = ind;
    conv.session.params.geo_state = states[ind][0];
    conv.session.params.geo_us_capital = states[ind][1];
    conv.session.params.geo_num_questions_left--;
}

/**
 * Randomly generate a new country question.
 */
function getNewCountryQuestion(conv) {
    setQuestionBank(conv);
    let countries = getQuestionBank(conv);
    const ind = parseInt(Math.random() * countries.length);
    conv.session.params.geo_country_ind = ind;
    conv.session.params.geo_country = countries[ind][0];
    conv.session.params.geo_world_capital = countries[ind][1];
    conv.session.params.geo_country_region = countries[ind][2];
    conv.session.params.geo_num_questions_left--;
}

/**
 * Initialize the number of questions and the number of questions answered
 * correctly and incorrectly.
 */
function setup(conv) {
    setQuestionBank(conv);
    conv.session.params.geo_num_questions_left = 2;
    conv.session.params.geo_num_correct = 0;
    conv.session.params.geo_num_incorrect = 0;
    conv.session.params.geo_correct = [];
    conv.session.params.geo_incorrect = [];
}

function getCorrectAnswer(conv) {
    const category = conv.session.params.geo_category;
    if (category == "US_CAPITAL") {
        return conv.session.params.geo_us_capital;
    } else if (category == "STATE") {
        return conv.session.params.geo_state;
    } else if (category == "COUNTRY") {
        return conv.session.params.geo_country;
    } else if (category == "WORLD_CAPITAL") {
        return conv.session.params.geo_world_capital;
    }
}

function isCorrect(conv, answer) {
    return (conv.intent.params.answer.resolved.includes(answer) ||
           (conv.session.params.geo_category == "US_CAPITAL" &&
            conv.session.params.geo_state == "Alaska" &&
            conv.intent.params.answer.resolved.includes("Juno")));
}

function removeQuestion(conv) {
    const category = conv.session.params.geo_category;
    if (category == "US_CAPITAL") {
        conv.user.params.geo_state_capital_questions.splice(conv.session.params.geo_state_ind, 1);
    } else if (category == "STATE") {
        conv.user.params.geo_state_questions.splice(conv.session.params.geo_state_ind, 1);
    } else if (category == "COUNTRY") {
        conv.user.params.geo_country_questions.splice(conv.session.params.geo_country_ind, 1);
    } else if (category == "WORLD_CAPITAL") {
        conv.user.params.geo_country_capital_questions.splice(conv.session.params.geo_country_ind, 1);
    }
}

module.exports = {
    getNewStateQuestion,
    getNewCountryQuestion,
    setup,
    getCorrectAnswer,
    isCorrect,
    removeQuestion
}
