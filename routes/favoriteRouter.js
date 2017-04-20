var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Dishes = require('../models/dishes');
var Verify = require('./verify');

var router = express.Router();

router.use(bodyParser.json());

router.route('/')
	.get(Verify.verifyOrdinaryUser, function (req, res, next) {
		var userId = req.decoded._doc._id;
        Favorites.findById(userId)
            .populate('dishes.dish')
            .exec(function (err, favorite) {
            if (err)
                throw err;
            res.json(favorite);
        });
    })
	.post(Verify.verifyOrdinaryUser, function (req, res, next) {
		var userId = req.decoded._doc._id;
		var dishId = req.body._id;

		Favorites.findById(userId, function (err, favorite) {
			if (err)
				throw err;
			if (!favorite) {
				Favorites.create({_id : userId}, function (err, favorite) {
					if (err)
						throw err;
            		favorite.dishes = [];

					res.writeHead(200, {
						'Content-Type': 'text/plain'
					});

					res.write('Favorite list created!\n');

					res.write('Added favorite with id:' + favorite._id + "\n");
					Dishes.findById(dishId, function (err, dish) {
						if (err)
							throw err;

					/*	res.writeHead(200, {
							'Content-Type': 'text/plain'
						});*/
						res.write("Added dish " + dish.name + " to favorites\n");
						favorite.dishes.push({dish: dish._id});

						favorite.save(function (err, favorite) {
							if (err)
								throw err;
							console.log("Updated favorites");
							res.end();
						});
					});
				});
			} else {
				console.log(dishId);
				Dishes.findById(dishId, function (err, dish) {
					if (err)
						throw err;

					if (!dish) {
						res.writeHead(404, {
							'Content-Type': 'text/plain'
						});
						res.end("Dish does not exist!");
						return;
					}

					var dishExists = false;

					for (var i = 0; i < favorite.dishes.length; i++)
						if (favorite.dishes[i].dish == dishId)
							dishExists = true;

					if (dishExists) {
						res.writeHead(500, {
							'Content-Type': 'text/plain'
						});
						res.write("Dish " + dish.name + " already exists in favorites");
						res.end();
					} else {
						res.writeHead(200, {
							'Content-Type': 'text/plain'
						});
						res.write("Added dish " + dish.name + " to favorites\n");
						favorite.dishes.push({dish: dish._id});

						favorite.save(function (err, favorite) {
							if (err)
								throw err;
							console.log("Updated favorites");
							res.end();
						});
					}
				});
			}
		});
	})
	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		var userId = req.decoded._doc._id;

		Favorites.findByIdAndRemove(userId, function (err, resp) {
            if (err)
                throw err;

            res.json(resp);
        });
	});

router.route('/:id')
	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		var userId = req.decoded._doc._id;
		var dishId = req.params.id;

		Favorites.findById(userId, function (err, favorite) {
			if (err)
				throw err;
			if (favorite.dishes.id(dishId)) {
				favorite.dishes.id(dishId).remove();

				favorite.save(function (err, favorite) {
					if (err)
						throw err;
					res.writeHead(200, {
						'Content-Type': 'text/plain'
					});
					res.end("Removed dish: " + dishId)
				});
			} else {
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				res.end("Dish does not exist!");
			}
		});
	});

module.exports = router;
