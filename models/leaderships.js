var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Leader Schema
var leaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    featured: {
      type: Boolean,
      default:false
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps : true
});

// create model using schema
var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;
