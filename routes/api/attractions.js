var express = require('express');
//var db = require('./_db');
var Place = require('../../models/place');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');

var attractionRouter = express.Router();


// attractionRouter.get('/',function(req,res){

// 	console.log('hello');
// 	res.send('working');

// });


// THESE ARE API ROUTES

// api/hotels?id=1
// => Hotel.findOne({where: id = 1})

attractionRouter.get('/hotels', function(req, res, next) {

	var findOptions = {include: [Place]}
	if(req.query) findOptions.where = req.query
    Hotel.findAll(findOptions)
        .then(function(hotels) {
            res.json(hotels);
        }).
    catch(next);

});

attractionRouter.get('/restaurants', function(req, res, next) {

	var findOptions = {include: [Place]}
	if(req.query) findOptions.where = req.query
    Restaurant.findAll(findOptions)
        .then(function(restaurants) {
            res.json(restaurants);
        })
        .catch(next);
});

attractionRouter.get('/activities', function(req, res, next) {
	
	var findOptions = {include: [Place]}
	if(req.query) findOptions.where = req.query
    Activity.findAll(findOptions)
        .then(function(activities) {
            res.json(activities);
        })
        .catch(next);
});

module.exports = attractionRouter;
