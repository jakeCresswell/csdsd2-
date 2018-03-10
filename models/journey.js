const mongoose = require('mongoose');
const Schema = mongoose.Schema; //creates Schema
const Token = mongoose.Schema.TokenSchema;

//create project scheme and model
const JourneySchema = new Schema({
    tokenUsed: {
        type: [Token]
    },
    fromLocation :{
        type: String
    },
    toLocation: {
            type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    toDate: {
        type: Date,
        default: Date.now
    },
    amountPaid :{
        type: Number
    }
});

const Journey = mongoose.model('journeys', JourneySchema);

module.exports = Journey;
