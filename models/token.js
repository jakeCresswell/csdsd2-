const mongoose = require('mongoose');
const Schema = mongoose.Schema; //creates Schema

//token object defined
const TokenSchema = new Schema({
    userName: {
            type: String,
            required:[true, "your username is required"]
    },
    tokenType: {
        type: String,
        required:[true, "Type is required"]
    },
    scanned: {
        type: Boolean,
        default: false
    },
    journeyCounter: {
        type: Number,
        default: false
    },
    discounted: {
        type: Boolean,
        default: false
    }
});

const Token = mongoose.model('token', TokenSchema);

module.exports = Token;
