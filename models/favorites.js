var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create favorite schema
var favoriteSchema = new Schema({
	_id: String,
	dishes: [
		{
			dish: {
        		type: mongoose.Schema.Types.ObjectId,
        		ref: 'Dish'
			}
    	}
	]
}, {
	timestamp: true,
	_id: false
});

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;