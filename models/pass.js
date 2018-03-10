const mongoose = require('mongoose');
const Schema = mongoose.Schema; //creates Schema
const Token = mongoose.Schema.TokenSchema;

//create project scheme and model
const PassSchema = new Schema({
    Type :{
        type: String
    },
    userId:{
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now 
    },
    endDate: {
        type: Date,
    }
});

const Pass = mongoose.model('passes', PassSchema);

module.exports = Pass;