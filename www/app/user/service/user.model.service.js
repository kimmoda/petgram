(function () {
    'use strict';
    angular
        .module('module.user')
        .factory('User', function ($q, $filter, $rootScope, Parse, $cordovaGeolocation, $cordovaDevice, $window, $facebook, $cordovaFacebook, $state, ParseConfig, Notify) {

            var device = $window.cordova ? true : false;
            //var facebook = device ? $cordovaFacebook : $window.FB;
            var facebook = device ? $cordovaFacebook : $facebook;
            var data     = {
                user    : {},
                facebook: {}
            };

            function init() {
                // Parse Start
                Parse.initialize(ParseConfig.applicationId, ParseConfig.javascriptKey);
                var user = Parse.User.current();

                if (user) {
                    var obj = user.attributes;
                    obj.id  = user.id;
                    return loadProfile(obj);
                } else {
                    logout();
                    $state.go('user.login');
                }
            }

            function currentUser() {
                return Parse.User.current().attributes;
            }


            function loadProfile(response) {

                if (response) {
                    $rootScope.user = {};

                    var user      = processImg(response);
                    user.birthday = (response.birthday) ? new Date(response.birthday) : '';

                    $rootScope.user = user;

                    console.log(response, user);
                    return user;
                } else {
                    logout();
                    return false;
                }
            }

            function processImg(obj) {
                var random = '?' + Math.random();

                if (obj.facebookimg) {
                    obj.src = (obj.facebookimg) ? obj.facebookimg : 'img/user.png';
                } else {
                    obj.src = (obj.img) ? obj.img.url() + random : 'img/user.png';
                }
                return obj;
            }

            function login(form) {
                var defer = $q.defer();
                Notify.showLoading();
                Parse
                    .User
                    .logIn(form.email, form.password, {
                        success: function (resp) {
                            console.log(resp);
                            Notify.hideLoading();
                            var user = loadProfile(resp);
                            defer.resolve(user);
                        },
                        error  : function (user, err) {
                            console.error(user, err);
                            Notify.hideLoading();
                            // The login failed. Check error to see why.
                            if (err.code === 101) {
                                defer.reject('Invalid login credentials');
                            } else {
                                defer.reject('An unexpected error has occurred, please try again.');
                            }
                        }
                    });
                return defer.promise;
            }

            function facebookLogin() {
                var defer = $q.defer();

                facebook
                    .login([
                        'public_profile',
                        'email',
                        'user_friends'
                    ]).then(function (resp) {
                        defer.resolve(resp);
                    }, function (resp) {
                        defer.reject(resp);
                    });

                return defer.promise;
            }


            function facebookProfile() {
                var defer = $q.defer();
                facebookLogin()
                    .then(function (resp) {

                        facebook
                            .api('me', '')
                            .then(function (response) {
                                defer.resolve([
                                    resp,
                                    response
                                ]);
                            }, function (error) {
                                console.log(error);
                                defer.reject(error);
                            });
                    });
                return defer.promise;
            }


            function register(form) {
                var defer = $q.defer();

                var formData      = form;
                formData.username = form.email;
                Notify.showLoading();

                console.log(formData);
                new Parse
                    .User(formData)
                    .signUp(null, {
                        success: function (resp) {
                            var user = loadProfile(resp.attributes);
                            Notify.hideLoading();
                            defer.resolve(user);
                        },
                        error  : function (user, resp) {
                            Notify.hideLoading();
                            console.log(resp);
                            if (resp.code === 125) {
                                defer.reject('Please specify a valid email address');
                            } else if (resp.code === 202) {
                                defer.reject('The email address is already registered');
                            } else {
                                defer.reject(resp);
                            }
                        }
                    });
                return defer.promise;
            }

            function forgot(form) {
                var defer = $q.defer();
                new Parse
                    .User
                    .requestPasswordReset(form.email, {
                        success: function (resp) {
                            defer.resolve(resp);
                        },
                        error  : function (err) {
                            if (err.code === 125) {
                                defer.reject('Email address does not exist');
                            } else {
                                defer.reject('An unknown error has occurred, please try again');
                            }
                        }
                    });
                return defer.promise;
            }

            function logout() {
                var defer = $q.defer();
                new Parse.User.logOut();
                delete $rootScope.user;
                defer.resolve(true);

                return defer.promise;
            }

            function update(form) {
                var defer       = $q.defer();
                var currentUser = Parse.User.current();
                Notify.showLoading();
                delete form.img;
                console.log(form);
                angular.forEach(form, function (value, key) {
                    currentUser.set(key, value);
                });

                if ($window.device) {

                    var cordovaDevice = {
                        device  : $cordovaDevice.getDevice(),
                        cordova : $cordovaDevice.getCordova(),
                        model   : $cordovaDevice.getModel(),
                        platform: $cordovaDevice.getPlatform(),
                        uuid    : $cordovaDevice.getUUID(),
                        version : $cordovaDevice.getVersion()
                    };

                    currentUser.set('device', cordovaDevice.device);
                    currentUser.set('cordova', cordovaDevice.cordova);
                    currentUser.set('model', cordovaDevice.model);
                    currentUser.set('platform', cordovaDevice.platform);
                    currentUser.set('uuiid', cordovaDevice.uuid);
                    currentUser.set('version', cordovaDevice.version);
                }

                currentUser
                    .save()
                    .then(function (resp) {

                        var user = loadProfile(resp.attributes);
                        Notify.hideLoading();
                        defer.resolve(user);
                    });


                return defer.promise;
            }

            function updateAvatar(photo) {
                var defer = $q.defer();

                Notify.showLoading();

                if (photo !== '') {

                    // create the parse file
                    var imageFile = new Parse.File('mypic.jpg', {base64: photo});

                    // save the parse file
                    return imageFile
                        .save()
                        .then(function () {

                            photo = null;

                            // create object to hold caption and file reference
                            var currentUser = Parse.User.current();

                            // set object properties
                            currentUser.set('img', imageFile);

                            // save object to parse backend
                            currentUser
                                .save()
                                .then(function (resp) {
                                    var user = loadProfile(resp.attributes);
                                    console.log(resp);
                                    Notify.hideLoading();
                                    defer.resolve(user);
                                });


                        }, function (error) {
                            Notify.hideLoading();
                            console.log(error);
                            defer.reject(error);
                        });
                }
                return defer.promise;
            }


            function facebookUpdateProfile(response) {
                console.log(response);
                var defer = $q.defer();
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

                console.log(response, user);

                update(user)
                    .then(function (resp) {
                        console.log(resp);
                        loadProfile(resp);
                        defer.resolve(resp);
                    });

                return defer.promise;
            }

            function loginParseFacebook() {
                var defer = $q.defer();

                facebookProfile()
                    .then(function (resp) {

                        var userData = resp[0];
                        var profile  = resp[1];

                        if (!userData.authResponse) {
                            console.log("Cannot find the authResponse");
                            return;
                        }
                        var expDate = new Date(
                            new Date().getTime() + userData.authResponse.expiresIn * 1000
                        ).toISOString();

                        var authData = {
                            id             : String(userData.authResponse.userID),
                            access_token   : userData.authResponse.accessToken,
                            expiration_date: expDate
                        };

                        console.log(resp);
                        console.log(userData);
                        console.log(profile);

                        data.facebook = profile;

                        fbLogged.resolve([
                            authData,
                            profile
                        ]);

                    }).catch(function (resp) {
                        console.log(resp);
                        Notify.hideLoading();
                        Notify.alert('Ops', resp);
                    });

                var fbLogged = new Parse.Promise();

                fbLogged
                    .then(function (resp) {
                        var authData = resp[0];
                        var user     = Parse.User.current();

                        console.log(authData, user);

                        if (!user) {
                            return Parse.FacebookUtils.logIn(authData);
                        } else {
                            return Parse.FacebookUtils.link(user, authData);
                        }
                    })
                    .then(function (userObject) {
                        console.info(userObject);
                        console.info(data.facebook);

                        defer.resolve(data.facebook);

                    }, function (error) {
                        Notify.hideLoading();
                        defer.reject(error);
                    });

                return defer.promise;
            }

            function loginFacebook() {
                var defer = $q.defer();
                Notify.showLoading();

                loginParseFacebook()
                    .then(function (response) {
                        console.log(response);

                        facebookUpdateProfile(response)
                            .then(function (resp) {
                                console.log(resp);
                                Notify.hideLoading();
                                defer.resolve(resp);
                            });

                    });

                return defer.promise;
            }

            function facebookFriends() {
                var defer = $q.defer();

                facebook
                    .api('me/friends')
                    .then(function (success) {
                        defer.resolve(success);
                    }, function (error) {
                        defer.reject(error);
                    });

                return defer.promise;
            }

            function facebookAPI(api) {
                var defer = $q.defer();

                facebook
                    .api(api)
                    .then(function (success) {
                        defer.resolve(success);
                    }, function (error) {
                        defer.reject(error);
                    });

                return defer.promise;
            }

            function facebookInvite() {
                var defer = $q.defer();
                if (device) {
                    facebook
                        .showDialog({
                            method : 'apprequests',
                            message: 'Venha para o nosso clube!'
                        })
                        .then(function (resp) {
                            defer.resolve(resp);
                        });
                } else {
                    facebook
                        .ui({
                            method : 'apprequests',
                            message: 'Venha para o nosso clube!'
                        })
                        .then(function (resp) {
                            defer.resolve(resp);
                        });
                }
                return defer.promise;
            }

            function list(force) {
                var defer = $q.defer();

                new Parse
                    .Query('User')
                    .find()
                    .then(function (resp) {
                        var users = [];
                        angular.forEach(resp, function (item) {
                            var user = item.attributes;
                            user.id  = item.id;
                            user     = processImg(user);
                            if (user.id != Parse.User.current().id) {
                                users.push(user);
                            }

                        });
                        defer.resolve(users);
                    });

                return defer.promise;
            }

            function find(userId) {
                var defer = $q.defer();
                new Parse
                    .Query('User')
                    .equalTo('objectId', userId)
                    .first()
                    .then(function (resp) {
                        console.log(resp);
                        defer.resolve(resp);
                    });

                return defer.promise;
            }


            function getLocation() {
                // Pega a Localização da Pessoa
                var defer = $q.defer();

                if (data.location) {
                    defer.resolve(data.location);
                } else {
                    var posOptions = {
                        timeout           : 10000,
                        enableHighAccuracy: false
                    };
                    $cordovaGeolocation
                        .getCurrentPosition(posOptions)
                        .then(function (position) {
                            console.log('Fez a requisição', position);

                            data.location = {
                                latitude : position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            defer.resolve(data.location);
                        }, function (err) {
                            // error
                            console.log('Pegou da Default');
                            defer.reject(err);
                        });
                }


                return defer.promise;
            }

            function addFollow(user) {
                var defer = $q.defer();

                find(user.id)
                    .then(function (follow) {
                        var Object = Parse.Object.extend('UserFollow');
                        var item   = new Object();

                        item.set('user', Parse.User.current());
                        item.set('follow', follow);
                        item.save()
                            .then(function (resp) {
                                defer.resolve(resp);
                            });
                    })

                return defer.promise;
            }

            function addFollows(users) {
                var promises = [];
                angular.forEach(users, function (user) {
                    promises.push(addFollow(user));
                });
                return $q.all(promises);
            }


            return {
                init              : init,
                addFollows        : addFollows,
                addFollow         : addFollow,
                currentUser       : currentUser,
                register          : register,
                login             : login,
                loginFacebook     : loginFacebook,
                logout            : logout,
                update            : update,
                updateAvatar      : updateAvatar,
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

})();