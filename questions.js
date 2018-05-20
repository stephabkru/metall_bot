
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bot_db');


const Model = mongoose.model('Questions', { 
    guid: String,
    question_type: String,
    answer_form: String,
    entity1: String,
    stem: String,
    distractors: [String],
    key: [String],
    client_answer: Boolean,
    confirm: { type: Boolean, default: false },
    user: Number
});

module.exports = Model;