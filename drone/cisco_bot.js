'use strict'

var RollingSpider = require('rolling-spider');
var temporal = require('temporal');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());

var rollingSpider = new RollingSpider();

// Start our parrot

rollingSpider.connect(function(){
    console.log('Connecting to drone!')
    rollingSpider.setup(function(){
        console.log('Connected!')
        rollingSpider.flatTrim();
        rollingSpider.startPing();
        rollingSpider.flatTrim();
    })
});


// start express server
var server = app.listen(8080, function () {
    console.log('on port 8080')
});

// define express path for incoming webhooks
// Someone posted a message, lets get it
app.post('/', function(req, resp){
    var message_id = req.body['data']['id'];

    request(
        {
            url: 'https://api.ciscospark.com/v1/messages/' + message_id,
            headers: {
                'Authorization': 'Bearer MjI0NWIzYzgtODI1ZC00M2Y1LTg1ODctNmM4NDFkMTM1YTIxMmYxZDQ1NzItMTUx',
            }
        },
        function (error, response, body){
            var data = JSON.parse(body);
            var key_words = data['text'];

            // If '/fly' then fly
            if (key_words.indexOf('/fly') != -1){
                rollingSpider.takeOff();
                rollingSpider.flatTrim();
                console.log('flying...');
            }

            // If '/land' then land
            else if (key_words.indexOf('/land') != -1){
                rollingSpider.land();
                console.log('landing...');
            }
        }
    );
});
