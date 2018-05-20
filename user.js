
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bot_db');


const Model  = mongoose.model('User', { 
    step: { type: String, default: 'start' },
    last_active: Date,
    user_id: Number,
    answers: { type: Number, default: 0 },
    true_answers: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    test: [],
    tests: [{
        quid: String,  
        objects: [],
        persent: Number
    }]
});

module.exports = Model;