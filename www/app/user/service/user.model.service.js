'use strict';
angular
    .module ('module.user')
    .factory ('User', function ($q, $filter, $rootScope, $cordovaGeolocation, $cordovaDevice, $window, $facebook, CacheFactory, $cordovaFacebook, $state, ParseConfig, Notify) {

    var userCache,
        userListCache;

    if (!CacheFactory.get ('user')) {
        userCache = CacheFactory.createCache ('user', {
            storageMode: 'localStorage'
        });
    }

    if (!CacheFactory.get ('userList')) {
        userListCache = CacheFactory.createCache ('userList', {
            storageMode: 'localStorage'
        });
    }
    var device   = $window.cordova ? true : false;
    var facebook = device ? $cordovaFacebook : $facebook;
    var data     = {
        user    : {},
        facebook: {}
    };

    function init () {
        // Parse Start
        Parse.initialize (ParseConfig.applicationId, ParseConfig.javascriptKey);
        var user = Parse.User.current ();

        if (user) {
            var obj = user.attributes;
            obj.id  = user.id;
            return loadProfile (obj);
        } else {
            logout ();
            $state.go ('user.login');
        }
    }

    function currentUser () {
        return Parse.User.current ().attributes;
    }

    function cleanToken () {
        CacheFactory.clearAll ();
        userCache.removeAll ();
    }

    function loadProfile (response) {

        if (response) {

            var user = response;
            if (user.facebook) {
                user.img = (response.img) ? response.img : response.facebookimg;
            } else {
                user.img = (response.img) ? response.img : 'img/user.png';
            }
            user.birthday = (response.birthday) ? Date (response.birthday) : '';

            $rootScope.user = user;

            console.log (response, user);
            return user;
        } else {
            logout ();
            return false;
        }
    }

    function login (form) {
        var defer = $q.defer ();
        Notify.showLoading ();
        Parse
            .User
            .logIn (form.email, form.password, {
            success: function (resp) {
                console.log (resp);
                Notify.hideLoading ();
                var user = loadProfile (resp);
                defer.resolve (user);
            },
            error  : function (user, err) {
                console.error (user, err);
                Notify.hideLoading ();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    defer.reject ('Invalid login credentials');
                } else {
                    defer.reject ('An unexpected error has occurred, please try again.');
                }
            }
        });
        return defer.promise;
    }

    function facebookLogin () {
        var defer = $q.defer ();

        facebook
            .login ([
            'public_profile',
            'email',
            'user_friends'
        ]).then (function (resp) {
            defer.resolve (resp);
        }, function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }


    function facebookProfile () {
        var defer = $q.defer ();
        facebookLogin ()
            .then (function (resp) {

            facebook
                .api ('me', '')
                .then (function (response) {
                defer.resolve ([resp,
                                response
                ]);
            }, function (error) {
                console.log (error);
                defer.reject (error);
            });
        });
        return defer.promise;
    }


    function register (form) {
        var defer = $q.defer ();

        var formData      = form;
        formData.username = form.email;
        delete formData.name;
        delete formData.confirmpassword;

        Notify.showLoading ();

        console.log (formData);
        new Parse
            .User (formData)
            .signUp (null, {
            success: function (resp) {
                Notify.hideLoading ();
                var user = loadProfile (resp.attributes);
                Notify.hideLoading ();
                defer.resolve (user);
            },
            error  : function (user, resp) {
                Notify.hideLoading ();
                console.log (resp);
                if (resp.code === 125) {
                    defer.reject ('Please specify a valid email address');
                } else if (resp.code === 202) {
                    defer.reject ('The email address is already registered');
                } else {
                    defer.reject (resp);
                }
            }
        });
        return defer.promise;
    }

    function forgot (form) {
        var defer = $q.defer ();
        new Parse
            .User
            .requestPasswordReset (form.email, {
            success: function (resp) {
                defer.resolve (resp);
            },
            error  : function (err) {
                if (err.code === 125) {
                    defer.reject ('Email address does not exist');
                } else {
                    defer.reject ('An unknown error has occurred, please try again');
                }
            }
        });
        return defer.promise;
    }

    function logout () {
        var defer = $q.defer ();
        cleanToken ();
        Parse.User.logOut ();
        delete $rootScope.user;
        defer.resolve (true);

        return defer.promise;
    }

    function converteDate (from, timezone) {
        //var o = dateSTR.replace (/-/g, '/');
        //return Date (o + ' -0000');
        if (timezone === -3) {
            var numbers = from.split ('/');
            var date    = new Date (numbers[2], numbers[0], numbers[1], 0, 0, 0);
        } else {
            var numbers = from.split ('-');
            var date    = new Date (numbers[2], numbers[0], numbers[1]);
        }

        return date;
    }

    function update (form) {
        var defer       = $q.defer ();
        var currentUser = Parse.User.current ();
        Notify.showLoading ();

        angular.forEach (form, function (value, key) {
            currentUser.set (key, value);
        });

        if ($window.device) {

            var cordovaDevice = {
                device  : $cordovaDevice.getDevice (),
                cordova : $cordovaDevice.getCordova (),
                model   : $cordovaDevice.getModel (),
                platform: $cordovaDevice.getPlatform (),
                uuid    : $cordovaDevice.getUUID (),
                version : $cordovaDevice.getVersion ()
            };

            currentUser.set ('device', cordovaDevice.device);
            currentUser.set ('cordova', cordovaDevice.cordova);
            currentUser.set ('model', cordovaDevice.model);
            currentUser.set ('platform', cordovaDevice.platform);
            currentUser.set ('uuiid', cordovaDevice.uuid);
            currentUser.set ('version', cordovaDevice.version);
        }

        currentUser
            .save ()
            .then (function (resp) {
            var user = init ();
            console.log (resp, user);
            Notify.hideLoading ();
            defer.resolve (user);
        });


        return defer.promise;
    }


    function facebookUpdateProfile (response) {
        console.log (response);
        var defer = $q.defer ();
        var user  = {
            facebook    : response.id,
            name        : response.first_name + ' ' + response.middle_name + ' ' + response.last_name,
            email       : response.email,
            relationship: (response.relationship) ? response.relationship : '',
            relation    : (response.significant_other) ? response.significant_other.id : '',
            site        : response.link,
            location    : (response.location) ? response.location.name : '',
            facebookimg : 'https://graph.facebook.com/' + response.id + '/picture?width=250&height=250',
            idFacebook  : response.id,
            //birthday    : (response.birthday) ? converteDate (response.birthday, response.timezone) : '',
            gender      : response.gender
        };

        console.log (response, user);

        update (user)
            .then (function (resp) {
            console.log (resp);
            loadProfile (resp);
            defer.resolve (resp);
        });

        return defer.promise;
    }

    function loginParseFacebook () {
        var defer = $q.defer ();

        facebookProfile ()
            .then (function (resp) {

            var userData = resp[0];
            var profile  = resp[1];

            if (!userData.authResponse) {
                console.log ("Cannot find the authResponse");
                return;
            }
            var expDate = new Date (
                new Date ().getTime () + userData.authResponse.expiresIn * 1000
            ).toISOString ();

            var authData = {
                id             : String (userData.authResponse.userID),
                access_token   : userData.authResponse.accessToken,
                expiration_date: expDate
            };

            console.log (resp);
            console.log (userData);
            console.log (profile);

            data.facebook = profile;

            fbLogged.resolve ([authData,
                               profile
            ]);

        }).catch (function (resp) {
            console.log (resp);
            Notify.hideLoading ();
            Notify.alert ('Ops', resp);
        });

        var fbLogged = new Parse.Promise ();

        fbLogged
            .then (function (resp) {
            var authData = resp[0];
            var profile  = resp[1];
            var user     = Parse.User.current ();

            console.log (authData, user);

            if (!user) {
                return Parse.FacebookUtils.logIn (authData);
            } else {
                return Parse.FacebookUtils.link (user, authData);
            }
        })
            .then (function (userObject) {
            console.info (userObject);
            console.info (data.facebook);

            defer.resolve (data.facebook);

        }, function (error) {
            Notify.hideLoading ();
            defer.reject (error);
        });

        return defer.promise;
    }

    function loginFacebook () {
        var defer = $q.defer ();
        Notify.showLoading ();

        loginParseFacebook ()
            .then (function (response) {
            console.log (response);

            facebookUpdateProfile (response)
                .then (function (resp) {
                console.log (resp);
                Notify.hideLoading ();
                defer.resolve (resp);
            });

        });

        return defer.promise;
    }

    function facebookFriends () {
        var defer = $q.defer ();

        facebook
            .api ('me/friends')
            .then (function (success) {
            defer.resolve (success);
        }, function (error) {
            defer.reject (error);
        });

        return defer.promise;
    }

    function facebookAPI (api) {
        var defer = $q.defer ();

        facebook
            .api (api)
            .then (function (success) {
            defer.resolve (success);
        }, function (error) {
            defer.reject (error);
        });

        return defer.promise;
    }

    function facebookInvite () {
        var defer = $q.defer ();
        if (device) {
            facebook
                .showDialog ({
                method : 'apprequests',
                message: 'Venha para o nosso clube!'
            })
                .then (function (resp) {
                defer.resolve (resp);
            });
        } else {
            facebook
                .ui ({
                method : 'apprequests',
                message: 'Venha para o nosso clube!'
            })
                .then (function (resp) {
                defer.resolve (resp);
            });
        }
        return defer.promise;
    }

    function list (force) {
        var defer = $q.defer (),
            objs  = [],
            cache = userListCache.keys ();

        if (cache.length > 0 && !force === true && force !== undefined) {
            console.log ('Load Cache');
            angular.forEach (cache, function (item) {
                objs.push (userListCache.get (item));
            });
            defer.resolve (objs);
        } else {
            console.log ('Load Parse');

            new Parse
                .Query ('User')
                .find ()
                .then (function (resp) {
                userListCache.removeAll ();
                var users = [];
                angular.forEach (resp, function (item) {
                    var obj = item.attributes;
                    obj.id  = item.id;
                    if (obj.id != Parse.User.current ().id) {
                        userListCache.put (obj.id, obj);
                        users.push (obj);
                    }

                });
                defer.resolve (users);
            });
        }

        return defer.promise;
    }

    function find (userId) {
        var defer = $q.defer ();
        new Parse
            .Query ('User')
            .equalTo ('objectId', userId)
            .first ()
            .then (function (resp) {
            console.log (resp);
            defer.resolve (resp);
        });

        return defer.promise;
    }


    function getLocation () {
        // Pega a Localização da Pessoa
        var defer = $q.defer ();

        if (data.location) {
            defer.resolve (data.location);
        } else {
            var posOptions = {
                timeout           : 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition (posOptions)
                .then (function (pos) {
                console.log ('Fez a requisição');
                pos.status = true;

                data.location = pos;
                defer.resolve (data.location);
            }, function (err) {
                // error
                console.log ('Pegou da Default');
                var location  = {
                    coords: {
                        latitude : -23.5333333,
                        longitude: -46.6166667
                    },
                    status: false
                };
                data.location = location;
                defer.resolve (data.location);
            });
        }


        return defer.promise;
    }


    return {
        init              : init,
        currentUser       : currentUser,
        register          : register,
        login             : login,
        loginFacebook     : loginFacebook,
        logout            : logout,
        update            : update,
        forgot            : forgot,
        list              : list,
        find              : find,
        location          : getLocation,
        loginParseFacebook: loginParseFacebook,
        facebookLogin     : facebookLogin,
        facebookProfile   : facebookProfile,
        facebookFriends   : facebookFriends,
        facebookInvite    : facebookInvite,
        facebookAPI       : facebookAPI
    };
})
;
