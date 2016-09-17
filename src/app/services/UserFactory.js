(function () {
    'use strict';
    angular.module('starter').factory('User', UserFactory);

    function UserFactory($q, $translate, $window, $cordovaDevice, Parse, ParsePush) {

        var ParseObject = Parse.User.extend({}, {
            profile               : function (username) {
                return Parse.Cloud.run('profile', {username: username})
            },
            list                  : function (params) {
                return Parse.Cloud.run('listUsers', params)
            },
            getFollowers          : function (username) {
                return Parse.Cloud.run('getFollowers', {username: username})
            },
            getLikers             : function (galleryId) {
                return Parse.Cloud.run('getLikers', {galleryId: galleryId})
            },
            getFollowing          : function (username) {
                return Parse.Cloud.run('getFollowing', {username: username})
            },
            signIn                : function (obj) {
                var defer = $q.defer();

                Parse.User.logIn(obj.username.toLowerCase(), obj.password, {
                    success: function (currentUser) {

                        // device
                        var updateUser;
                        if (window.cordova) {
                            updateUser = {
                                device  : $cordovaDevice.getDevice(),
                                cordova : $cordovaDevice.getCordova(),
                                model   : $cordovaDevice.getModel(),
                                platform: $cordovaDevice.getPlatform(),
                                uuid    : $cordovaDevice.getUUID(),
                                version : $cordovaDevice.getVersion()
                            };
                        } else {
                            var userAgent = window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./);

                            updateUser = {
                                device  : {device: (userAgent) ? userAgent[0] : 'emulator'},
                                cordova : '',
                                model   : (userAgent) ? userAgent[0] : 'emulator',
                                platform: window.navigator.platform,
                                uuid    : '',
                                version : (userAgent) ? userAgent[0] : 'emulator'
                            };
                        }

                        // Save
                        updateUser.lang = $translate.use();

                        if (window.cordova) {
                            // Parse Push
                            ParsePush.init();
                        }

                        Parse.User.update(updateUser).then(function () {
                            defer.resolve(currentUser);
                        }).catch(defer.reject);
                    },
                    error  : defer.reject
                });

                return defer.promise;
            },
            signUp                : function (data) {
                var defer = $q.defer();
                var user  = new Parse.User()
                    .set({'name': data.name})
                    .set({'username': data.username})
                    .set({'email': data.email})
                    .set({'password': data.password})
                    .set({'roleName': 'User'});

                user.signUp(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;

            },
            signInViaFacebook     : function (authData) {

                var facebookAuthData = {
                    id             : authData.authResponse.userID,
                    access_token   : authData.authResponse.accessToken,
                    expiration_date: (new Date().getTime() + 1000).toString()
                };

                var defer = $q.defer();
                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;
            },
            updateWithFacebookData: function (data) {
                var defer = $q.defer();
                Parse.Cloud.run('saveFacebookPicture', {}).then(function () {
                    var user = Parse.User.current();

                    if (!data.username && data.email) {
                        user.set({'username': data.email.split('@')[0]});
                    }

                    if (!user.get('name') && data.name) {
                        user.set({'name': data.name});
                    }

                    if (!user.get('email') && data.email) {
                        user.set({'email': data.email});
                    }
                    user.save(null, {
                        success: function () {
                            user.fetch().then(defer.resolve, defer.reject);
                        }
                    });
                }).catch(defer.reject);
                return defer.promise;
            },
            logOut                : function () {
                //return Parse.User.logOut();
                console.log(Parse.applicationId);
                delete $window.localStorage['Parse/' + Parse.applicationId + '/currentUser'];
                delete $window.localStorage['Parse/' + Parse.applicationId + '/installationId'];
            },
            findByEmail           : function (email) {
                return Parse.Cloud.run('findUserByEmail', {email: email});
            },
            getPublicData         : function (user) {
                console.log(user);
                var defer = $q.defer();
                new Parse.Query('UserData').equalTo('user', user).first().then(function (userData) {
                    if (userData) {
                        defer.resolve(userData);
                    } else {
                        defer.reject(Parse.Promise.error({
                            code   : 1,
                            message: 'User Data not found'
                        }));
                    }
                }, defer.reject);
                return defer.promise;
            },
            recoverPassword       : function (email) {
                var defer = $q.defer();
                Parse.User.requestPasswordReset(email, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            destroy               : function () {
                return Parse.User.current().destroy();
            },
            setPhoto              : function (parseFile) {
                var defer = $q.defer();
                var user  = Parse.User.current();
                user.set({'photo': parseFile});
                user.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            follow                : function (userId) {
                return Parse.Cloud.run('followUser', {userId: userId});
            },
            all                   : function (params) {
                return Parse.Cloud.run('getUsers', params);
            },
            validateUsername      : function (input) {
                return Parse.Cloud.run('validateUsername', {username: input});
            },
            validateEmail         : function (input) {
                return Parse.Cloud.run('validateEmail', {email: input});
            },
            update                : function (params) {
                var user    = Parse.User.current();
                // User Language
                params.lang = $translate.use();

                angular.forEach(params, function (value, key) {
                    user.set(key, value);
                });
                return user.save();
            },
            delete                : function (data) {
                return Parse.Cloud.run('destroyUser', data);
            },
            fetch                 : function () {
                var defer = $q.defer();
                if (Parse.User.current()) {
                    Parse.User.current().fetch().then(defer.resolve, defer.reject);
                } else {
                    defer.reject();
                }
                return defer.promise;
            }

        });

        var fields = [
            'name',
            'username',
            'status',
            'gender',
            'email',
            'photo',
            'photoThumb',
            'roleName',
        ];

        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (val) {
                    this.set(field, val);
                }
            });
        });


        return ParseObject;

    }

})();
