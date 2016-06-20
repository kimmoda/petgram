(function () {
    'use strict';
    angular.module('starter').factory('User', UserFactory);

    function UserFactory($q, $cordovaDevice, ParseCloud) {

        var User = Parse.User.extend({}, {
            signIn                : function (data) {
                var defer = $q.defer();
                Parse.User.logIn(data.email, data.password, {
                    success: function (currentUser) {
                        // Update device after login
                        if (window.cordova) {
                            var cordovaDevice = {
                                device  : $cordovaDevice.getDevice(),
                                cordova : $cordovaDevice.getCordova(),
                                model   : $cordovaDevice.getModel(),
                                platform: $cordovaDevice.getPlatform(),
                                uuid    : $cordovaDevice.getUUID(),
                                version : $cordovaDevice.getVersion()
                            }.forEach(function (value, index) {
                                currentUser.set(index, value);
                            });
                            console.log('updateUser', cordovaDevice);
                            currentUser.save();
                        }
                        defer.resolve(currentUser);
                    },
                    error  : defer.reject
                });

                return defer.promise;
            },
            profile               : function (userId) {
                var defer = $q.defer();
                var User  = new Parse.User();
                User.get(userId);
                new Parse.Query('UserData')
                    .equalTo('user', userId)
                    .first()
                    .then(defer.resolve, defer.reject);
                return defer.promise;
            },
            signUp                : function (data) {
                var defer = $q.defer();
                var user  = new Parse.User();
                user.set({'name': data.name});
                user.set({'username': data.username});
                user.set({'email': data.email});
                user.set({'password': data.password});
                user.set({'roleName': 'User'});

                var acl = new Parse.ACL();
                acl.setPublicReadAccess(false);
                acl.setPublicWriteAccess(false);
                user.setACL(acl);
                user.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;
            },
            signInViaFacebook     : function (authData) {
                var defer      = $q.defer();
                var expiration = new Date();
                expiration.setSeconds(expiration.getSeconds() + authData.authResponse.expiresIn);
                expiration = expiration.toISOString();

                var facebookAuthData = {
                    'id'             : authData.authResponse.userID,
                    'access_token'   : authData.authResponse.accessToken,
                    'expiration_date': expiration
                };
                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            findByEmail           : function (email) {
                return ParseCloud.run('findUserByEmail', {email: email});
            },
            updateWithFacebookData: function (data) {
                var defer = $q.defer();
                ParseCloud.run('saveFacebookPicture', {}).then(function () {
                    var user = Parse.User.current();
                    user.set({'email': data.email});
                    user.set({'username': data.email});
                    user.set({'name': data.name});
                    user.setACL(new Parse.ACL(user));
                    user.save(null, {
                        success: function () {
                            user.fetch().then(function (userFetched) {
                                defer.resolve(userFetched);
                            }, function (error) {
                                defer.reject(error);
                            });
                        }
                    });
                }).catch(defer.reject);
                return defer.promise;
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
                var defer = $q.defer();
                Parse.User.current().destroy().then(defer.resolve, defer.reject);
                return defer.promise;
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
            follow                : function (otherUser) {
                // create an entry in the Follow table
                var follow = new Parse.Object('UserFolow');
                follow.set('from', Parse.User.current());
                follow.set('to', otherUser);
                follow.set('date', Date());
                follow.save();
            },
            all                   : function (params) {
                return ParseCloud.run('getUsers', params);
            },
            create                : function (data) {
                return ParseCloud.run('createUser', data);
            },
            validateUsername      : function (input) {
                var defer = $q.defer();
                defer.resolve(true);

                //ParseCloud.run('validateUsername', input).then(function (data) {
                //    console.log(data);
                //    if (data == true) {
                //        defer.resolve();
                //    } else {
                //        defer.reject();
                //    }
                //});
                return defer.promise;
            },
            validateEmail         : function (input) {
                var defer = $q.defer();
                defer.resolve(true);
                //ParseCloud
                //    .run('validateEmail', input)
                //    .then(function (data) {
                //        console.log(data);
                //        if (data == true) {
                //            defer.resolve();
                //        } else {
                //            defer.reject();
                //        }
                //    });
                return defer.promise;
            },
            findUsername          : function (username) {
                var defer = $q.defer();
                new Parse.Query(this).equalTo('username', username).first({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            update                : function (params) {
                var defer = $q.defer();
                var user  = Parse.User.current();
                angular.forEach(params, function (value, key) {
                    user.set(key, value);
                });
                user.save({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            delete                : function (data) {
                return ParseCloud.run('destroyUser', data);
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

        Object.defineProperty(User.prototype, 'name', {
            get: function () {
                return this.get('name');
            },
            set: function (val) {
                this.set('name', val);
            }
        });

        Object.defineProperty(User.prototype, 'username', {
            get: function () {
                return this.get('username');
            },
            set: function (val) {
                this.set('username', val);
            }
        });

        Object.defineProperty(User.prototype, 'status', {
            get: function () {
                return this.get('status');
            },
            set: function (val) {
                this.set('status', val);
            }
        });

        Object.defineProperty(User.prototype, 'gender', {
            get: function () {
                return this.get('gender');
            },
            set: function (val) {
                this.set('gender', val);
            }
        });

        Object.defineProperty(User.prototype, 'email', {
            get: function () {
                return this.get('email');
            },
            set: function (val) {
                this.set('email', val);
            }
        });

        Object.defineProperty(User.prototype, 'photo', {
            get: function () {
                return this.get('photo');
            },
            set: function (val) {
                this.set('photo', val);
            }
        });

        Object.defineProperty(User.prototype, 'photoThumb', {
            get: function () {
                return this.get('photoThumb');
            },
            set: function (val) {
                this.set('photoThumb', val);
            }
        });

        Object.defineProperty(User.prototype, 'roleName', {
            get: function () {
                return this.get('roleName');
            },
            set: function (val) {
                this.set('roleName', val);
            }
        });

        return User;

    }

})();
