$(document).ready(function(){

var deferredHotels = $.ajax({
        method: 'get',
        url: '/api/hotels'
    });

var deferredRestaurants = $.ajax({
        method: 'get',
        url: '/api/restaurants'
    });

var deferredActivites = $.ajax({
        method: 'get',
        url: '/api/activities'
    })


    $.when(deferredHotels, deferredRestaurants,deferredActivites)
    .done(function(hotels,restaurants,activities){

        collection['hotel'] = hotels;
        collection['restaurant'] = restaurants;
        collection['activity'] = activities;

    })
    .fail();
})