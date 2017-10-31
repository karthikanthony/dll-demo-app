var https = require('https');
var http = require('http');
var jsonfile = require('jsonfile');

var searchController = function () {
    var ca_api_key = '&apikey=l793ea757612c24f658fa3b2b6f998394b';
    var ax_api_key = '&apikey=c1c6b7c0-7eec-4550-a4e2-ada12aa335eb';
    var options = {
        host : '52.10.48.208',
        port: '8080',
        method: 'GET'
        //rejectUnauthorized: false
    };
    
    var getBusinesses = function (location, type, cb) {
        
        options.path = '/demo/business-search?location=' + (location || '19703') + '&type=' + (type || 'honda') + ca_api_key;
        
        var callback = function (response) {
            response.setEncoding("utf8");
            var body = "";
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function (data) {
                body = JSON.parse(body);
                cb(body);
                //console.log(body);
            });
        };
        
        /*var file = './data/test_data_business.json';
        jsonfile.readFile(file, function (err, obj) {
            cb(obj);
        //   // console.dir(obj);
        });*/
        
        http.request(options, callback).end();
    };
    
    var getRestaurants = function (location, type, cb) {
        
        options.path = '/demo/business-search?location=' + (location || '19703') + '&type=' + (type || 'chinese') + ca_api_key;
        
        console.log('enter get restaurants');
        
        var callback = function (response) {
            response.setEncoding("utf8");
            var body = "";
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function (data) {
                body = JSON.parse(body);
                cb(body);
                
                console.log('got resturants');

            });
        };
        
        /*var file = './data/test_data_restaurants.json';
        jsonfile.readFile(file, function (err, obj) {
            cb(obj);
        //   // console.dir(obj);
        });*/
        
        http.request(options, callback).end();
    };
    
    var getWeather = function (location, cb) {
        
        options.path = '/demo/weather-info?zip=' + (location || '19703') + ca_api_key;
        
        var callback = function (response) {
            response.setEncoding("utf8");
            var body = "";
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function (data) {
                body = JSON.parse(body);
                cb(body);
            });
        };
        
        /*var file = './data/test_data_currentWeather.json';
        jsonfile.readFile(file, function (err, obj) {
            cb(obj);
           // console.dir(obj);
        });
        */
        http.request(options, callback).end();
    };
    
    var getDirections = function (from, to, name, mode, cb) {
        
        var path = '/demo/map-info?destination=' + encodeURIComponent(to) + '&origin=' + encodeURIComponent(from) + '&mode=' + (mode || 'walking') + ca_api_key;
        
        console.log('got directions');
        
        var directionOptions = {
            host : '52.10.48.208',
            port: '8080',
            method: 'GET',
            //rejectUnauthorized: false,
            path : path
        };
        
        var callback = function (response) {
            response.setEncoding("utf8");
            var body = "";
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function (data) {
                if (body == '') { cb(null); }
                else {
                    body = JSON.parse(body);
                    body.name = name;
                    cb(body);
                }
            });
        };
        
        /*var file = './data/test_data_drivingDirections.json';
        jsonfile.readFile(file, function (err, obj) {
            cb(obj);
           // console.dir(obj);
        });*/
        
        http.request(directionOptions, callback).end();
    };
    
    var getManyDirections = function (from, restaurants, mode, cb) {
        
        var results = [];
        for (var i = 0; i < restaurants.length; i++) {

            getDirections(from, restaurants[i].location.address1 + ' ' + restaurants[i].zip, restaurants[i].name,  mode, function (data) {
                results.push(data);
                if (i == results.length) {
                    cb(results);
                }
            });
            
        }
    };
    
    return {
        businesses: getBusinesses,
        restaurants: getRestaurants,
        weather: getWeather,
        direction: getDirections,
        directions: getManyDirections
    };
}

module.exports = searchController;