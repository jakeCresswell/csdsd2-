const mongoose = require('mongoose');
const Schema = mongoose.Schema; //creates Schema
const Token = mongoose.Schema.TokenSchema;

//create project scheme and model
const StationSchema = new Schema({
    Name :{
        type: String
    },
    Code: {
            type: String
    }
});

const Station = mongoose.model('stations', StationSchema);

module.exports = Station;