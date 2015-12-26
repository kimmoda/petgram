var json = JSON.parse(require('fs').readFileSync('pushbots.json','utf8'));
var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
    id: json.App_ID,
    secret: json.App_Secret
});


function sendPush(message){
    Pushbots.setMessage(message || 'Hello Photogram user',1);
    Pushbots.customFields({
        openUrl: 'http://photogramapp.com'
    });

    Pushbots.push(function (response) {
        console.log(response);
    });
};

sendPush('Testando');