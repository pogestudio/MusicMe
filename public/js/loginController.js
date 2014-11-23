$(function() {
    (function() {


        var stateKey = 'spotify_auth_state';

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
            var hashParams = {};
            var e, r = /([^&;=]+)=?([^&;]*)/g,
                q = window.location.hash.substring(1);
            while (e = r.exec(q)) {
                hashParams[e[1]] = decodeURIComponent(e[2]);
            }
            return hashParams;
        }

        /**
         * Generates a random string containing numbers and letters
         * @param  {number} length The length of the string
         * @return {string} The generated string
         */
        function generateRandomString(length) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');

        oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');

        var params = getHashParams();

        var access_token = params.access_token,
            state = params.state,
            storedState = localStorage.getItem(stateKey);

        console.log('initial storedState is: ' + storedState);
        console.log('initial access_token is: ' + access_token);
        console.log('initial state is: ' + state);

        if (access_token && (state == null)) { // || state !== storedState)) {
            alert('There was an error during the authentication');
        } else {
            localStorage.removeItem(stateKey);
            if (access_token) {
                $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                        $('#login').hide();
                        $('#loggedin').show();
                    }
                });
            } else {
                $('#login').show();
                $('#loggedin').hide();
            }

            var logInWithSpotify = function() {
                var client_id = '03ffe0cac0a0401aa6673c3cf6d02ced'; // Your client id
                var redirect_uri = 'http://localhost:8888/'; // Your redirect uri

                var state = generateRandomString(16);

                localStorage.setItem(stateKey, state);
                var scope = 'user-read-private user-read-email';

                var url = 'https://accounts.spotify.com/authorize';
                url += '?response_type=token';
                url += '&client_id=' + encodeURIComponent(client_id);
                url += '&scope=' + encodeURIComponent(scope);
                url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
                url += '&state=' + encodeURIComponent(state);

                window.location = url;
            }

            document.getElementById('login-button').addEventListener('click', function() {

                logInWithSpotify();
            }, false);



            var userForPlaylist = function() {
                var textField = document.getElementById('playlistURL');
                var completeString = textField.value;
                var res = completeString.split(":");
                var userName = res[2];
                console.log('playlist username:: ' + userName);
                return userName;
            }

            var playlistIdForPlaylist = function() {
                var textField = document.getElementById('playlistURL');
                var completeString = textField.value;
                var res = completeString.split(":");
                var playlistID = res[4];
                console.log('playlist id:: ' + playlistID);
                return playlistID;
            }

            document.getElementById('fetchImages-button').addEventListener('click', function() {

                var user = userForPlaylist();
                var playlistID = playlistIdForPlaylist();
                var fields = 'fields=items.track.album(images)';
                var limit = '150';

                var state = generateRandomString(16);


                localStorage.setItem(stateKey, state);

                var url = 'https://api.spotify.com/v1/users/';
                url += encodeURIComponent(user);
                url += '/playlists/';
                url += encodeURIComponent(playlistID);
                url += '/tracks';
                //url += '?fields=' + encodeURIComponent(fields);
                // url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
                // url += '&state=' + encodeURIComponent(state);

                // window.location = url;

                //console.log('clicked, spotifyURL:' + document.getElementById('playlistURL').value);

                var xmlHttp = null;

                console.log('firing!');

                //xmlHttp = new XMLHttpRequest();
                //xmlHttp.open("GET", url, false);
                //xmlHttp.setRequestHeader("Authorization", "Bearer " + access_token);
                //var response = xmlHttp.send();
                //console.log(response);

                var data = {
                    fields: 'items.track.album(images)',
                };

                var success = function(data) {
                    console.log('success!');
                    //console.log(data);
                    var imageUrls = [];
                    for (var i = data.items.length - 1; i >= 0; i--) {
                        //console.log(data.items[i].track.album.images[2]);
                        imageUrls.push(data.items[i].track.album.images[2].url);
                        console.log(data.items[i].track.album.images[2].url);
                    };

                    console.log('img urls:::' + imageUrls);
                    $.ajax({
                        url: 'http://localhost:8888/writeToFile',
                        data: {
                            images: imageUrls
                        },
                        success: function(response) {
                            console.log('success again!');
                        },
                    });
                }

                $.ajax({
                    url: url,
                    data: data,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + access_token);
                    },
                    success: success,
                    error: function(xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                    }
                });

            }, false);

            document.getElementById('createImage-button').addEventListener('click', function() {


                $.ajax({
                    url: 'http://localhost:8888/createImage',
                    success: function(response) {
                        console.log('sucess calling create Image!');
                        replaceImageOnScreen();

                    },
                });

            }, false);


            document.getElementById('fetchSingleImage-button').addEventListener('click', function() {
                var input = document.getElementById('imageToUse');
                var imageURL = input.value;
                $.ajax({
                    url: 'http://localhost:8888/saveImageToServer',
                    data: {
                        image: imageURL
                    },
                    success: function(response) {
                        console.log('success saving single image!');
                    },
                });
            }, false);

        }
    })();
});
