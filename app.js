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

var PythonShell = require('python-shell');

var tempImageFolder = "public/tmp";

var writeImageUrlToFolder = function(imageUrl, index) {
    var fs = require('fs');
    var request = require('request');
    // Or with cookies
    // var request = require('request').defaults({jar: true});

    request.get({
        url: imageUrl,
        encoding: 'binary'
    }, function(err, response, body) {
        fs.writeFile(tempImageFolder + '/'+index, body, 'binary', function(err) {
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


    var Sync = require('sync');

    function deleteFiles(dirPath, callback) {
            process.nextTick(function() {
                var fs = require('fs');

                console.log('gonna try to remove shit in ' + dirPath);
                var rmDir = function(dirPath) {
                    try {
                        var files = fs.readdirSync(dirPath);
                        console.log('found files in dirpath:');
                        console.log(files);
                    } catch (e) {
                        return;
                    }
                    if (files.length > 0)
                        for (var i = 0; i < files.length; i++) {
                            var filePath = dirPath + '/' + files[i];
                            if (fs.statSync(filePath).isFile())
                                fs.unlinkSync(filePath);
                            else
                                rmDir(filePath);
                        }
                        //fs.rmdirSync(dirPath);
                    callback();
                };
                rmDir(dirPath);
            });
        }
        //var fs = require('fs');

    // Run in a fiber
    Sync(function() {

        var writeFiles = function() {

                for (var i = req.query.images.length - 1; i >= 0; i--) {
                    var imageUrl = req.query.images[i]
                    writeImageUrlToFolder(imageUrl, i);
                };
            }
            //var arrayOfFolders = fs.readdirSync(tempImageFolder);

        //console.log(arrayOfFolders);
        deleteFiles(tempImageFolder, writeFiles);
    })
    res.send('');
});

app.get('/createImage', function(req, res) {
    console.log('now we are in create image!!!!');


    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: ['image.jpg', 'public/tmp']
    };


    var Sync = require('sync');

    function asyncFunction(callback) {
        process.nextTick(function() {
            PythonShell.run('mosaic.py', options, function(err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
                callback();

            });
        });
    }

    // Run in a fiber
    Sync(function() {

        var sendBackShit = function() {
            console.log('finished image!');
            res.send('');
        }
        asyncFunction(sendBackShit);
    })

    // PythonShell.run('mosaic.py', options, function(err, results) {
    //     if (err) throw err;
    //     // results is an array consisting of messages collected during execution
    //     console.log('results: %j', results);

    // });


    // res.send('');
});
console.log('Listening on 8888');
app.listen(8888);
