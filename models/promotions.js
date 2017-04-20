var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// getting Currency type
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create Promotion Schema
var promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: Currency,
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
var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;
