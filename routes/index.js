﻿var express = require('express');
var router = express.Router();

var searchController = require('../controllers/searchController')();


var weather = {
    "weather": "Clear",
    "temp": "72.0",
    "pressure": "1035",
    "humidity": "49"
};

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home', {
        title: 'Home',
    });

});

router.post('/business', function (req, res) {
    
    var zipCode = req.body['zipcode'] || '19703';
    var business = req.body['business'];
    
    var result = searchController.businesses(zipCode || '19703', business || 'Honda', function (data) {
        searchController.weather(zipCode, function (wdata) {
            
            wdata.location = zipCode;
            res.render('businesses', {
                title: 'Business Search',
                businesses: data,
                weather: wdata
            });
        });
    });
});

router.get('/businesses', function (req, res) {
    
    var result = searchController.businesses(null, null, function (data) {
        searchController.weather('null', function (wdata) {
            wdata.location = '19703';
            res.render('businesses', {
                title: 'Application - Businesses',
                businesses: data,
                weather: wdata
            });
        });
    });
    
   
});

router.get('/restaurants', function (req, res) {
    
    var location = req.query.location || '19703';
    var restaurantType = req.query.type || 'Chinese';
    var businessName = req.query.name || '';
    var fromAddress = req.query.from || '19703';
    
    var result = searchController.restaurants(location, restaurantType, function (data) {
        searchController.weather(location, function (wdata) {
            searchController.directions(fromAddress, data, null, function (directions) {
                
                wdata.location = location;
                searchController.directions(fromAddress, data, 'driving' , function (drives) {
                    
                    res.render('restaurantsView', {
                        title: 'Restaurants Search',
                        resturants: data,
                        weather: wdata,
                        name: businessName,
                        fromAddress: fromAddress,
                        directions: directions,
                        drivingDirections : drives
                    });
                });
            });
        });
    });
});

module.exports = router;