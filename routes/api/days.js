var express = require('express');
var Place = require('../../models/place');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Day = require('../../models/day')

var modelRef = {
	Restaurant: Restaurant,
	Hotel: Hotel,
	Place: Place,
	Activity: Activity,
	day: Day
}

var dayRouter = express.Router();

dayRouter.get('/:day', function(req, res, next) {
	console.log('howdy');
	Day.findOne({
		where: {day: req.params.day}
	}).then( function(result) {
		console.log('this is the result',result);
		res.json(result);
	}).catch( function(err) {
		console.error(err)
		res.status(500).send(err);
	})
})

dayRouter.get('/:day/:attractionType', function(req, res, next) {
	var attractionType = req.params.attractionType;
	var day = req.params.day;
	Day.findOne({
		where: {day: day},
		include: [{
			model: attractionType,
			through: {
				attributes: ['id','name','price','cuisine','placeId']
			}
		}]
	}).then( function(result) {
		console.log('worked!');
		res.json(result);
	}).catch( function(err) {
		res.send(err);
	})
})

dayRouter.post('/:day', function(req, res, next) {
		console.log('howdy');
	Day.create({
		day: req.params.day
	}).then( function(result) {
		res.send('created: ' + result);
	})
})

dayRouter.post('/:day/:attractionType/:attractionId', function(req, res, next) {
	var attractionId = req.params.attractionId;
	var attractionType = req.params.attractionType;
	var day = req.params.day;
	console.log(attractionType);
	var attraction = modelRef[attractionType].findOne({
		where: {id: attractionId}
	});
	var currentDay = Day.findOne({
		where: {day: day}
	});
	Promise
		.all([currentDay, attraction])
		.then( function(result)
		{ 
			var thisDay = result[0];
			var thisAttraction = result[1]
			var adder = 'add' + attractionType;
			thisDay[adder]( thisAttraction ).then( function( joinResult ) {
				console.log('worked!', joinResult);
				res.json(joinResult);
			}).catch( function(err) {
				console.log('something went wrong here.')
			})
		})
		.catch( function(err)
		{
			res.send('there was an error: ' + err);
		})
})

dayRouter.put('/:day', function(req, res, next) {
		console.log('howdy');
		res.send('howdy yall');

})
dayRouter.delete('/:day', function(req, res, next) {
		console.log('howdy');
		res.send('howdy yall');

})


module.exports = dayRouter;