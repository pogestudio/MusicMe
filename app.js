/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

var express = require('express'); // Express web server framework
var app = express();



var writeImageUrlToFolder = function(imageUrl, index) {
    var fs = require('fs');
    var request = require('request');
    // Or with cookies
    // var request = require('request').defaults({jar: true});

    request.get({
        url: imageUrl,
        encoding: 'binary'
    }, function(err, response, body) {
        fs.writeFile("public/tmp/" + index, body, 'binary', function(err) {
            if (err)
                console.log(err);
            else
                console.log("The file was saved!");
        });
    });

}


app.use(express.static(__dirname + '/public'));
app.get('/writeToFile', function(req, res) {
    console.log('WRITING!!!');
    console.log(req.query.images);



    for (var i = req.query.images.length - 1; i >= 0; i--) {
        var imageUrl = req.query.images[i]
        writeImageUrlToFolder(imageUrl, i);
    };


    res.send('');
});
console.log('Listening on 8888');
app.listen(8888);
