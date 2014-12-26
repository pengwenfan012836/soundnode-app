'use strict';

app.controller('PlaylistsCtrl', function ($scope, SCapiService, $rootScope, $log, $window, $http, $state, $stateParams) {
    var endpoint = 'me/playlists'
        , params = '';

    $scope.title = 'Playlists';
    $scope.data = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            $scope.data = data;
        }, function(error) {
            console.log('error', error);
        }).finally(function(){
            $rootScope.isLoading = false;
        });

    /**
     * Responsible to remove track from a particular playlist
     * @params songId [track id to be removed from the playlist
     * @params playlistId [playlist id that contains the track]
     * @method removeFromPlaylist
     */
    $scope.removeFromPlaylist = function(songId, playlistId) {
        var endpoint = 'users/'+  $rootScope.userId + '/playlists/'+ playlistId
            , params = '';

        SCapiService.get(endpoint, params)
            .then(function(response) {
                var uri = response.uri + '.json?&oauth_token=' + $window.scAccessToken
                    , tracks = response.tracks
                    , songIndex
                    , i = 0;

                // finding the track index
                for ( ; i < tracks.length ; i++ ) {
                    if ( songId == tracks[i].id ) {
                        songIndex = i;
                    }
                }

                // Removing the track from the tracks list
                tracks.splice(songIndex, 1);

                $http.put(uri, { "playlist": {
                    "tracks": tracks
                }
                }).then(function(response) {
                    if ( typeof response.status === 200 ) {
                        // do something important
                    }
                }, function(response) {
                    console.log('something went wrong response');
                    // something went wrong
                    $log.log(response);
                    return $q.reject(response.data);
                }).finally(function() {
                    $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                })

            }, function(error) {
                console.log('error', error);
            });
        
    };

    /**
     * Responsible to check if there's a artwork
     * otherwise replace with default badge
     * @param thumb [ track artwork ]
     * @method checkForPlaceholder
     */
    $scope.checkForPlaceholder = function (thumb) {
        var newSize;

        if ( thumb === null ) {
            return 'public/img/logo-badge.png';
        } else {
            newSize = thumb.replace('large', 'badge');
            return newSize;
        }
    };
});