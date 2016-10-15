'use strict'

var RollingSpider = require('rolling-spider');
var temporal = require('temporal');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());

var rollingSpider = new RollingSpider();

// start express server
var server = app.listen(8080, function () {
    console.log('on port 8080')
});

function bot_reply(txt){
    request.post({
        url: 'https://api.ciscospark.com/v1/messages',
        form: {
            'roomId': '728c2ea0-9299-11e6-b930-5b92f116b331',
            'text': txt
        },
        headers:{
            'Authorization': 'Bearer YzliZDlmZmMtN2FiOC00ODA1LTlmZDItNDQ4MGQxMTE4NzljOWJjODliODQtMGIw',
        },
        function (error, response, body){
        }
    });

}

// Start our parrot controller
rollingSpider.connect(function(){
    bot_reply('Attempting to connect to drone...')
    rollingSpider.setup(function(){
        bot_reply('Successfully connected to drone!')
        rollingSpider.flatTrim();
        rollingSpider.startPing();
        rollingSpider.flatTrim();
    })
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

            // Ignore commands from drones@sparkbot.io
            if (data['personEmail'].indexOf('drones@sparkbot.io') != -1){
                return
            }

            rollingSpider.flatTrim();

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

            else if (key_words.indexOf('/forward') != -1){
                rollingSpider.forward({'speed': 50, 'steps': 40});
                rollingSpider.flatTrim();
                console.log('going forwards...');
            }

            else if (key_words.indexOf('/backward') != -1){
                rollingSpider.backward({'speed':50, 'steps': 40});
                rollingSpider.flatTrim();
                console.log('going backwards...');
            }

            else if (key_words.indexOf('/up') != -1){
                rollingSpider.up({'speed': 50, 'steps': 40});
                rollingSpider.flatTrim();
                console.log('going up...')
            }

            else if (key_words.indexOf('/down') != -1){
                rollingSpider.down({'speed': 50, 'steps': 40});
                rollingSpider.flatTrim();
                console.log('going down...')
            }

            else if (key_words.indexOf('/help') != -1){
                console.log('help...')
                bot_reply('/fly - flies the drone\n/land - lands the drone\n/forward - moves the drone forwards\n/backward - moves the drone backwards\n/up - files the drone higher\n/down - files the drone lower')
            }

            else{
                bot_reply('unknown command, please look up /help')
            }
        }
    );

});
