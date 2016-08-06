(function () {
    'use strict';
    angular
        .module('starter', [
            'ionic',
            'ngMessages',
            'ngCookies',
            'ngStorage',
            'pascalprecht.translate', // angular-translate
            'tmh.dynamicLocale', // angular-dynamic-locale
            'angularMoment',
            'ngFacebook',
            'angular-cache',
            'ngSanitize',
            'mentio',
            'ion-affix',
            'jett.ionic.scroll.sista',
            'ngCordova',
            'ionic.components',
            'app.main',
        ]);

})();

(function () {
    'use strict';
    angular
        .module('ionic.components', [
            'ion-language',
            'ion-location',
            'ion-slideshow',
            'ionic-cache-src',
            // 'ion-affix',
            // 'ngCache',
            'ion-photo'
        ]);
})();

(function () {
    'use strict';

    angular.module('starter').directive('href', openTermsDirective);

    function openTermsDirective() {
        return {
            restrict: 'A',
            link    : function (scope, elem, attr) {

                elem.bind('click', openModal);

                function openModal() {
                    var href = attr.href;

                    if (window.cordova) {
                        // Keep in mind that you must add your own images to native resource.
                        // Images below are for sample only. They are not imported by this plugin.
                        window.cordova.ThemeableBrowser.open(href, '_blank', {
                            statusbar         : {
                                color: '#ffffffff'
                            },
                            toolbar           : {
                                height: 44,
                                color : '#f0f0f0ff'
                            },
                            title             : {
                                color        : '#000',
                                showPageTitle: true
                            },
                            backButtonCanClose: true
                        })
                        ;
                    } else {
                        window.open(href);
                    }

                    return false;
                }
            }
        };
    }

})();

(function () {
    'use strict';
    angular.module('app.main', [
            'ionic',
            'ngCordova',
        ]);

})();

(function () {
    'use strict';

    angular
        .module('ion-language', [
            'ngCookies',
            'pascalprecht.translate', // angular-translate
            'tmh.dynamicLocale' // angular-dynamic-locale
        ])
        .config(configLanguage);

    function configLanguage($translatePartialLoaderProvider, $translateProvider, AppConfig, tmhDynamicLocaleProvider) {

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.useSanitizeValueStrategy(null);

        // Translate Config
        //$translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useLocalStorage(); // saves selected language to localStorage
        tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');

        var langvar     = navigator.language || navigator.userlanguage;
        var userlangvar = langvar.split('-')[0];
        var language    = AppConfig.preferredLocale;
        var searchLang  = _.some(AppConfig.locales, {
            code: userlangvar
        });

        if (searchLang) {
            language = AppConfig.locales.filter(function (item) {
                return language == item.code
            })[0].code;
        }
        $translateProvider.preferredLanguage(language);
        moment.locale(language);
    }


})();

(function () {
  'use strict';
  angular
    .module('ion-location', [
      'ionic'
    ]);

})();
(function () {
    'use strict';
    angular.module('ion-photo', [
        'ionic',
        'ngCordova',
        'jrCrop'
    ]).constant('config', {
        path: 'app/component/ion-photo'
    })

})();
(function () {
    'use strict';
    angular.module('ion-slideshow', [])
           .directive('ionSlideshow', function ($ionicModal) {
               return {
                   restrict: 'A',
                   scope   : {
                       ngModel: '=',
                       index  : '='
                   },
                   link    : link
               };

               function link($scope, elem, attr) {

                   elem.bind('click', function () {
                       $scope.allImages   = $scope.ngModel;
                       $scope.activeSlide = $scope.index;

                       console.log($scope.index);

                       $ionicModal.fromTemplateUrl('app/component/ion-slideshow/image-popover.html', {
                           scope: $scope,
                       }).then(function (modal) {
                           $scope.modal = modal;
                           $scope.modal.show();
                       });

                       // Close the modal
                       $scope.closeModal = function () {
                           $scope.modal.hide();
                           $scope.modal.remove()
                       };
                   });


               }
           });

})();
(function () {
    'use strict';
    angular
        .module('app.main');

})();

(function () {
    'use strict';

    angular
        .module('starter')
        .run(startParse)
        .run(runIonic)
        .run(runFacebook)
        .config(configCompile)
        .config(configFacebook)
        .config(configIonic);

    function configCompile($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

    function startParse(AppConfig, $ionicPlatform, $localStorage, $location, $rootScope) {
        Parse.initialize(AppConfig.parse.appId);
        Parse.serverURL = AppConfig.parse.server;

        if (!$localStorage.unit) {
            $localStorage.unit = AppConfig.map.unit;
        }

        if (!$localStorage.mapType) {
            $localStorage.mapType = AppConfig.map.type;
        }

        $rootScope.currentUser = Parse.User.current();
        console.log($rootScope.currentUser);
        if (!$rootScope.currentUser) {
            $location.path('/');
        }
    }

    function runIonic($ionicPlatform, $rootScope, $localStorage, $translate, $cordovaGlobalization, $cordovaSplashscreen, ParsePush, ConnectMonitor, AppConfig, User) {

        // Set Theme Color
        $rootScope.theme = AppConfig.theme;

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                window.StatusBar.styleLightContent();
            }

            // Remove back button android
            //$ionicPlatform.registerBackButtonAction(function (event) {
            //    event.preventDefault();
            //}, 100);

            if ($localStorage.lang) {
                $translate.use($localStorage.lang);
            } else {
                if (typeof navigator.globalization !== 'undefined') {
                    $cordovaGlobalization.getPreferredLanguage().then(function (language) {
                        $translate.use((language.value).split('-')[0]);
                    }, null);
                }
            }

            // Hide Splash Screen
            if (navigator && navigator.splashscreen) {
                $cordovaSplashscreen.hide();
            }

            var user = Parse.User.current();
            if (user) {
                ParsePush.init();
            }
            //ConnectMonitor.watch();
            //
            console.log($translate.use())
        });


    }

    function configIonic($ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.backButton.text(' ').icon('ion-ios-arrow-left');
        //$ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
        //$ionicConfigProvider.views.transition ('platform');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.views.maxCache(1);
    }

    // Facebook
    function configFacebook($facebookProvider, AppConfig) {
        if (!window.cordova) {
            $facebookProvider.setAppId(AppConfig.facebookAppId);
            $facebookProvider.setPermissions('id,name,email,user_likes,bio');
        }
    }

    function runFacebook() {

        if (!window.cordova) {
            console.log('Facebook Browser');
            var LangVar     = window.navigator.language || window.navigator.userLanguage;
            var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js     = d.createElement(s);
                js.id  = id;
                js.src = 'http://connect.facebook.net/' + userLangVar + '/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

    }

})();

(function () {
    'use strict';
    angular.module('ionic').constant('AppConfig', AppConfig());

    function AppConfig() {
        return {
            path           : 'app/module/photogram',
            app            : {
                name : 'Photogram',
                url  : 'http://photogramapp.com',
                image: 'http://photogramapp.com/social-share.jpg',
            },
            routes         : {
                home : 'tab.home',
                login: 'intro'
            },
            theme : 'positive',
            gaTrackingId   : 'UA-69485876-2',
            facebookAppId  : '1024016557617380',
            parse          : {
                appId : 'myAppId',
                // server: 'http://localhost:1337/parse/',
                server: 'https://photogram.codevibe.io/parse/',
            },
            map            : {
                unit: 'mi',
                type: 'normal',
            },
            locales        : [
                {
                    translation: 'portugues',
                    code       : 'pt'
                },
                {
                    translation: 'english',
                    code       : 'en'
                },
                {
                    translation: 'turkish',
                    code       : 'tr'
                },
                {
                    translation: 'persian',
                    code       : 'fa'
                },
                {
                    translation: 'german',
                    code       : 'de'
                }
            ],
            preferredLocale: 'en',
            DAO            : {
                name  : 'photogram_db',
                tables: [
                    {
                        name   : 'User',
                        columns: {
                            id         : 'TEXT PRIMARY KEY',
                            name       : 'TEXT',
                            username   : 'TEXT',
                            email      : 'TEXT',
                            language   : 'TEXT',
                            facebookimg: 'TEXT',
                            gender     : 'TEXT',
                            img        : 'TEXT',
                            facebook   : 'INTEGER',
                            qtdFollow  : 'INTEGER',
                            status     : 'TEXT',
                            createdAt  : 'INTEGER',
                            attributes : 'TEXT'
                        }
                    },
                    {
                        name   : 'UserFollow',
                        columns: {
                            id      : 'TEXT PRIMARY KEY',
                            user_id : 'TEXT',
                            followId: 'TEXT'
                        },
                    },
                    {
                        name   : 'Gallery',
                        columns: {
                            id       : 'TEXT PRIMARY KEY',
                            img      : 'TEXT',
                            title    : 'TEXT',
                            user_id  : 'TEXT',
                            location : 'TEXT',
                            isLiked  : 'BOOLEAN',
                            likes    : 'INTEGER',
                            createdAt: 'INTEGER'
                        }
                    },
                    {
                        name   : 'GalleryActivity',
                        columns: {
                            id        : 'TEXT PRIMARY KEY',
                            action    : 'TEXT',
                            img       : 'TEXT',
                            userAvatar: 'TEXT',
                            userName  : 'TEXT',
                            user_id   : 'TEXT',
                            gallery_id: 'TEXT',
                            createdAt : 'INTEGER'
                        }
                    },
                    {
                        name   : 'GalleryComment',
                        columns: {
                            id        : 'TEXT PRIMARY KEY',
                            name      : 'TEXT',
                            user_id   : 'TEXT',
                            userName  : 'TEXT',
                            gallery_id: 'TEXT',
                            createdAt : 'INTEGER'
                        }
                    },
                    {
                        name   : 'GallerySetting',
                        columns: {
                            key  : 'TEXT',
                            value: 'TEXT'
                        }
                    }
                ]
            }
        };
    }
})();

(function () {
    'use strict';
    angular.module('starter').config(routes);

    function routes($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider) {

        // Translation
        $translatePartialLoaderProvider.addPart('app');

        $stateProvider

            .state('loading', {
                url         : '/',
                templateUrl : 'app/main/loading/loading.html',
                controller  : 'LoadingCtrl',
                controllerAs: 'vm'
            })


            .state('intro', {
                url         : '/intro',
                templateUrl : 'app/main/user-intro/user-intro.html',
                controller  : 'UserIntroCtrl',
                controllerAs: 'vm',
            })

            .state('user.intro', {
                url        : '/intro',
                templateUrl: 'app/main/user-intro/user-intro.html',
                controller : 'UserIntroCtrl'
            })

            .state('user', {
                url        : '/user',
                abstract   : true,
                templateUrl: 'app/main/user-layout/user-layout.html'
            })

            .state('user.avatar', {
                url         : '/avatar',
                templateUrl : 'app/main/user-avatar/user-avatar.html',
                controller  : 'UserAvatarCtrl',
                controllerAs: 'vm'
            })


            .state('user.merge', {
                url         : '/merge',
                controller  : 'UserMergeCtrl',
                controllerAs: 'vm',
                templateUrl : 'app/main/user-merge/merge.html'
            })

            .state('logout', {
                url         : '/logout',
                template    : '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
                controller  : function (User, $localStorage, AppConfig, $state) {
                    //Parse.User.logOut();
                    delete window.localStorage['Parse/' + AppConfig.parse.appId + '/currentUser'];
                    delete window.localStorage['Parse/' + AppConfig.parse.appId + '/installationId'];
                    $localStorage.$reset({});
                    $state.go('intro', {clear: true});
                },
                controllerAs: 'vm'
            })

            .state('profile', {
                url         : '/profile/:username',
                templateUrl : 'app/main/profile/profile.html',
                controllerAs: 'vm',
            })

            .state('tab', {
                url         : '/tab',
                abstract    : true,
                controller  : 'MainTabCtrl',
                controllerAs: 'vm',
                templateUrl : 'app/main/tab/main-tab.html'
            })

            .state('tab.home', {
                url  : '/home',
                views: {
                    tabHome: {
                        controller  : 'HomeCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-home/home.html'
                    }
                }
            })

            .state('tab.homeProfile', {
                url  : '/home/:username',
                views: {
                    tabHome: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('galleryComments', {
                url         : '/home/:galleryId/comments',
                controller  : 'GalleryComment',
                controllerAs: 'vm',
                templateUrl : 'app/main/gallery-comment/gallery-comment.html'
            })

            .state('tab.homeGalleryLikers', {
                url  : '/home/:galleryId/likers',
                views: {
                    tabHome: {
                        controller  : 'UserLikersCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-likers/user-likers.html'
                    }
                }
            })

            .state('tab.homeProfileFollowers', {
                url  : '/home/:username/followers',
                views: {
                    tabHome: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.homeProfileFollowing', {
                url  : '/home/:username/follwing',
                views: {
                    tabHome: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

            .state('tab.homeUserlist', {
                url  : '/home/userlist',
                views: {
                    tabHome: {
                        controller  : 'UserListCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-list/user-list.html'
                    }
                }
            })

            .state('tab.search', {
                url  : '/search/:text',
                views: {
                    tabSearch: {
                        controller  : 'SearchCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-search/search.html',
                    }
                }
            })

            .state('tab.searchProfile', {
                url  : '/search/:username',
                views: {
                    tabSearch: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('tab.searchProfileFollowers', {
                url  : '/search/:username/followers',
                views: {
                    tabSearch: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.map', {
                url  : '/map',
                views: {
                    tabSearch: {
                        controller  : 'SearchMapCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-search-map/searchMap.html',
                    }
                }
            })

            .state('tab.mapProfile', {
                url  : '/map/:username',
                views: {
                    tabSearch: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('tab.mapProfileFollowers', {
                url  : '/map/:username/followers',
                views: {
                    tabSearch: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.mapProfileFollowing', {
                url  : '/map/:username/follwing',
                views: {
                    tabActivity: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

            .state('tab.account', {
                url  : '/account',
                views: {
                    tabProfile: {
                        controller  : 'AccountCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-account/account.html'
                    }
                }
            })

            .state('tab.accountFollowers', {
                url  : '/account/:username/followers',
                views: {
                    tabProfile: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.accountFollowing', {
                url  : '/account/:username/follwing',
                views: {
                    tabProfile: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

            .state('tab.activity', {
                url  : '/activity',
                views: {
                    tabActivity: {
                        controller  : 'ActivityCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-activity/activity.html'
                    }
                }
            })

            .state('tab.activityProfile', {
                url  : '/activity/:username',
                views: {
                    tabActivity: {
                        controller  : 'ProfileCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/profile/profile.html'
                    }
                }
            })

            .state('tab.activityProfileFollowers', {
                url  : '/activity/:username/followers',
                views: {
                    tabActivity: {
                        controller  : 'UserFollowerCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-followers/user-followers.html'
                    }
                }
            })

            .state('tab.activityProfileFollowing', {
                url  : '/activity/:username/follwing',
                views: {
                    tabActivity: {
                        controller  : 'UserFollowingCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/user-following/user-following.html'
                    }
                }
            })

        ;

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main');
        $urlRouterProvider.otherwise('/');

    }


})();
// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/maps/google_maps_api_v3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * @license
 * Copyright 2010 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Whether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 *       'iconAnchor': (Array) The anchor position of the icon x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = map;

    /**
     * @type {Array.<google.maps.Marker>}
     * @private
     */
    this.markers_ = [];

    /**
     *  @type {Array.<Cluster>}
     */
    this.clusters_ = [];

    this.sizes = [53, 56, 66, 78, 90];

    /**
     * @private
     */
    this.styles_ = [];

    /**
     * @type {boolean}
     * @private
     */
    this.ready_ = false;

    var options = opt_options || {};

    /**
     * @type {number}
     * @private
     */
    this.gridSize_ = options['gridSize'] || 60;

    /**
     * @private
     */
    this.minClusterSize_ = options['minimumClusterSize'] || 2;


    /**
     * @type {?number}
     * @private
     */
    this.maxZoom_ = options['maxZoom'] || null;

    this.styles_ = options['styles'] || [];

    /**
     * @type {string}
     * @private
     */
    this.imagePath_ = options['imagePath'] ||
        this.MARKER_CLUSTER_IMAGE_PATH_;

    /**
     * @type {string}
     * @private
     */
    this.imageExtension_ = options['imageExtension'] ||
        this.MARKER_CLUSTER_IMAGE_EXTENSION_;

    /**
     * @type {boolean}
     * @private
     */
    this.zoomOnClick_ = true;

    if (options['zoomOnClick'] != undefined) {
        this.zoomOnClick_ = options['zoomOnClick'];
    }

    /**
     * @type {boolean}
     * @private
     */
    this.averageCenter_ = false;

    if (options['averageCenter'] != undefined) {
        this.averageCenter_ = options['averageCenter'];
    }

    this.setupStyles_();

    this.setMap(map);

    /**
     * @type {number}
     * @private
     */
    this.prevZoom_ = this.map_.getZoom();

    // Add the map event listeners
    var that = this;
    google.maps.event.addListener(this.map_, 'zoom_changed', function() {
        var zoom = that.map_.getZoom();

        if (that.prevZoom_ != zoom) {
            that.prevZoom_ = zoom;
            that.resetViewport();
        }
    });

    google.maps.event.addListener(this.map_, 'idle', function() {
        that.redraw();
    });

    // Finally, add the markers
    if (opt_markers && opt_markers.length) {
        this.addMarkers(opt_markers, false);
    }
}


/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = '../images/m';


/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';


/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function(obj1, obj2) {
    return (function(object) {
        for (var property in object.prototype) {
            this.prototype[property] = object.prototype[property];
        }
        return this;
    }).apply(obj1, [obj2]);
};


/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function() {
    this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function() {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function() {
    if (this.styles_.length) {
        return;
    }

    for (var i = 0, size; size = this.sizes[i]; i++) {
        this.styles_.push({
            url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
            height: size,
            width: size
        });
    }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function() {
    var markers = this.getMarkers();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, marker; marker = markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }

    this.map_.fitBounds(bounds);
};


/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function(styles) {
    this.styles_ = styles;
};


/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function() {
    return this.styles_;
};


/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function() {
    return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function() {
    return this.averageCenter_;
};


/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function() {
    return this.markers_;
};


/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function() {
    return this.markers_.length;
};


/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
    this.maxZoom_ = maxZoom;
};


/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function() {
    return this.maxZoom_;
};


/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function(markers, numStyles) {
    var index = 0;
    var count = markers.length;
    var dv = count;
    while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
    }

    index = Math.min(index, numStyles);
    return {
        text: count,
        index: index
    };
};


/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function(calculator) {
    this.calculator_ = calculator;
};


/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function() {
    return this.calculator_;
};


/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function(markers, opt_nodraw) {
    for (var i = 0, marker; marker = markers[i]; i++) {
        this.pushMarkerTo_(marker);
    }
    if (!opt_nodraw) {
        this.redraw();
    }
};


/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function(marker) {
    marker.isAdded = false;
    if (marker['draggable']) {
        // If the marker is draggable add a listener so we update the clusters on
        // the drag end.
        var that = this;
        google.maps.event.addListener(marker, 'dragend', function() {
            marker.isAdded = false;
            that.repaint();
        });
    }
    this.markers_.push(marker);
};


/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function(marker, opt_nodraw) {
    this.pushMarkerTo_(marker);
    if (!opt_nodraw) {
        this.redraw();
    }
};


/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function(marker) {
    var index = -1;
    if (this.markers_.indexOf) {
        index = this.markers_.indexOf(marker);
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                index = i;
                break;
            }
        }
    }

    if (index == -1) {
        // Marker is not in our list of markers.
        return false;
    }

    marker.setMap(null);

    this.markers_.splice(index, 1);

    return true;
};


/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function(marker, opt_nodraw) {
    var removed = this.removeMarker_(marker);

    if (!opt_nodraw && removed) {
        this.resetViewport();
        this.redraw();
        return true;
    } else {
        return false;
    }
};


/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function(markers, opt_nodraw) {
    var removed = false;

    for (var i = 0, marker; marker = markers[i]; i++) {
        var r = this.removeMarker_(marker);
        removed = removed || r;
    }

    if (!opt_nodraw && removed) {
        this.resetViewport();
        this.redraw();
        return true;
    }
};


/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function(ready) {
    if (!this.ready_) {
        this.ready_ = ready;
        this.createClusters_();
    }
};


/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function() {
    return this.clusters_.length;
};


/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function() {
    return this.map_;
};


/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function(map) {
    this.map_ = map;
};


/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function() {
    return this.gridSize_;
};


/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function(size) {
    this.gridSize_ = size;
};


/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function() {
    return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function(size) {
    this.minClusterSize_ = size;
};


/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function(bounds) {
    var projection = this.getProjection();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
        bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
        bounds.getSouthWest().lng());

    // Convert the points to pixels and the extend out by the grid size.
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
};


/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function(marker, bounds) {
    return bounds.contains(marker.getPosition());
};


/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function() {
    this.resetViewport(true);

    // Set the markers a empty array.
    this.markers_ = [];
};


/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function(opt_hide) {
    // Remove all the clusters
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        cluster.remove();
    }

    // Reset the markers to not be added and to be invisible.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        marker.isAdded = false;
        if (opt_hide) {
            marker.setMap(null);
        }
    }

    this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function() {
    var oldClusters = this.clusters_.slice();
    this.clusters_.length = 0;
    this.resetViewport();
    this.redraw();

    // Remove the old clusters.
    // Do it in a timeout so the other clusters have been drawn first.
    window.setTimeout(function() {
        for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
            cluster.remove();
        }
    }, 0);
};


/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function() {
    this.createClusters_();
};


/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
 */
MarkerClusterer.prototype.distanceBetweenPoints_ = function(p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};


/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function(marker) {
    var distance = 40000; // Some large number
    var clusterToAddTo = null;
    var pos = marker.getPosition();
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        var center = cluster.getCenter();
        if (center) {
            var d = this.distanceBetweenPoints_(center, marker.getPosition());
            if (d < distance) {
                distance = d;
                clusterToAddTo = cluster;
            }
        }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
        clusterToAddTo.addMarker(marker);
    } else {
        var cluster = new Cluster(this);
        cluster.addMarker(marker);
        this.clusters_.push(cluster);
    }
};


/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function() {
    if (!this.ready_) {
        return;
    }

    // Get our current map view bounds.
    // Create a new bounds object so we don't affect the map.
    var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),
        this.map_.getBounds().getNorthEast());
    var bounds = this.getExtendedBounds(mapBounds);

    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
            this.addToClosestCluster_(marker);
        }
    }
};


/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
    this.markerClusterer_ = markerClusterer;
    this.map_ = markerClusterer.getMap();
    this.gridSize_ = markerClusterer.getGridSize();
    this.minClusterSize_ = markerClusterer.getMinClusterSize();
    this.averageCenter_ = markerClusterer.isAverageCenter();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(),
        markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function(marker) {
    if (this.markers_.indexOf) {
        return this.markers_.indexOf(marker) != -1;
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                return true;
            }
        }
    }
    return false;
};


/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function(marker) {
    if (this.isMarkerAlreadyAdded(marker)) {
        return false;
    }

    if (!this.center_) {
        this.center_ = marker.getPosition();
        this.calculateBounds_();
    } else {
        if (this.averageCenter_) {
            var l = this.markers_.length + 1;
            var lat = (this.center_.lat() * (l-1) + marker.getPosition().lat()) / l;
            var lng = (this.center_.lng() * (l-1) + marker.getPosition().lng()) / l;
            this.center_ = new google.maps.LatLng(lat, lng);
            this.calculateBounds_();
        }
    }

    marker.isAdded = true;
    this.markers_.push(marker);

    var len = this.markers_.length;
    if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
        // Min cluster size not reached so show the marker.
        marker.setMap(this.map_);
    }

    if (len == this.minClusterSize_) {
        // Hide the markers that were showing.
        for (var i = 0; i < len; i++) {
            this.markers_[i].setMap(null);
        }
    }

    if (len >= this.minClusterSize_) {
        marker.setMap(null);
    }

    this.updateIcon();
    return true;
};


/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function() {
    return this.markerClusterer_;
};


/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function() {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    var markers = this.getMarkers();
    for (var i = 0, marker; marker = markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }
    return bounds;
};


/**
 * Removes the cluster
 */
Cluster.prototype.remove = function() {
    this.clusterIcon_.remove();
    this.markers_.length = 0;
    delete this.markers_;
};


/**
 * Returns the center of the cluster.
 *
 * @return {number} The cluster center.
 */
Cluster.prototype.getSize = function() {
    return this.markers_.length;
};


/**
 * Returns the center of the cluster.
 *
 * @return {Array.<google.maps.Marker>} The cluster center.
 */
Cluster.prototype.getMarkers = function() {
    return this.markers_;
};


/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function() {
    return this.center_;
};


/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function() {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};


/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function(marker) {
    return this.bounds_.contains(marker.getPosition());
};


/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function() {
    return this.map_;
};


/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function() {
    var zoom = this.map_.getZoom();
    var mz = this.markerClusterer_.getMaxZoom();

    if (mz && zoom > mz) {
        // The zoom is greater than our max zoom so show all the markers in cluster.
        for (var i = 0, marker; marker = this.markers_[i]; i++) {
            marker.setMap(this.map_);
        }
        return;
    }

    if (this.markers_.length < this.minClusterSize_) {
        // Min cluster size not yet reached.
        this.clusterIcon_.hide();
        return;
    }

    var numStyles = this.markerClusterer_.getStyles().length;
    var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(sums);
    this.clusterIcon_.show();
};


/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
    cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

    this.styles_ = styles;
    this.padding_ = opt_padding || 0;
    this.cluster_ = cluster;
    this.center_ = null;
    this.map_ = cluster.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;

    this.setMap(this.map_);
}


/**
 * Triggers the clusterclick event and zoom's if the option is set.
 *
 * @param {google.maps.MouseEvent} event The event to propagate
 */
ClusterIcon.prototype.triggerClusterClick = function(event) {
    var markerClusterer = this.cluster_.getMarkerClusterer();

    // Trigger the clusterclick event.
    google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_, event);

    if (markerClusterer.isZoomOnClick()) {
        // Zoom into the cluster.
        this.map_.fitBounds(this.cluster_.getBounds());
    }
};


/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function() {
    this.div_ = document.createElement('DIV');
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.innerHTML = this.sums_.text;
    }

    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div_);

    var that = this;
    var isDragging = false;
    google.maps.event.addDomListener(this.div_, 'click', function(event) {
        // Only perform click when not preceded by a drag
        if (!isDragging) {
            that.triggerClusterClick(event);
        }
    });
    google.maps.event.addDomListener(this.div_, 'mousedown', function() {
        isDragging = false;
    });
    google.maps.event.addDomListener(this.div_, 'mousemove', function() {
        isDragging = true;
    });
};


/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function(latlng) {
    var pos = this.getProjection().fromLatLngToDivPixel(latlng);

    if (typeof this.iconAnchor_ === 'object' && this.iconAnchor_.length === 2) {
        pos.x -= this.iconAnchor_[0];
        pos.y -= this.iconAnchor_[1];
    } else {
        pos.x -= parseInt(this.width_ / 2, 10);
        pos.y -= parseInt(this.height_ / 2, 10);
    }
    return pos;
};


/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function() {
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = pos.y + 'px';
        this.div_.style.left = pos.x + 'px';
    }
};


/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.display = 'none';
    }
    this.visible_ = false;
};


/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function() {
    if (this.div_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.style.display = '';
    }
    this.visible_ = true;
};


/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function() {
    this.setMap(null);
};


/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function() {
    if (this.div_ && this.div_.parentNode) {
        this.hide();
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};


/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function(sums) {
    this.sums_ = sums;
    this.text_ = sums.text;
    this.index_ = sums.index;
    if (this.div_) {
        this.div_.innerHTML = sums.text;
    }

    this.useStyle();
};


/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function() {
    var index = Math.max(0, this.sums_.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    var style = this.styles_[index];
    this.url_ = style['url'];
    this.height_ = style['height'];
    this.width_ = style['width'];
    this.textColor_ = style['textColor'];
    this.anchor_ = style['anchor'];
    this.textSize_ = style['textSize'];
    this.backgroundPosition_ = style['backgroundPosition'];
    this.iconAnchor_ = style['iconAnchor'];
};


/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function(center) {
    this.center_ = center;
};


/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function(pos) {
    var style = [];
    style.push('background-image:url(' + this.url_ + ');');
    var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
    style.push('background-position:' + backgroundPosition + ';');

    if (typeof this.anchor_ === 'object') {
        if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
            this.anchor_[0] < this.height_) {
            style.push('height:' + (this.height_ - this.anchor_[0]) +
                'px; padding-top:' + this.anchor_[0] + 'px;');
        } else if (typeof this.anchor_[0] === 'number' && this.anchor_[0] < 0 &&
            -this.anchor_[0] < this.height_) {
            style.push('height:' + this.height_ + 'px; line-height:' + (this.height_ + this.anchor_[0]) +
                'px;');
        } else {
            style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
                'px;');
        }
        if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
            this.anchor_[1] < this.width_) {
            style.push('width:' + (this.width_ - this.anchor_[1]) +
                'px; padding-left:' + this.anchor_[1] + 'px;');
        } else {
            style.push('width:' + this.width_ + 'px; text-align:center;');
        }
    } else {
        style.push('height:' + this.height_ + 'px; line-height:' +
            this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
    }

    var txtColor = this.textColor_ ? this.textColor_ : 'black';
    var txtSize = this.textSize_ ? this.textSize_ : 11;

    style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
        pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
        txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
    return style.join('');
};


// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
window['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] =
    MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] =
    MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] =
    MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] =
    MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] =
    MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] =
    MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] =
    MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] =
    MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] =
    MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] =
    MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] =
    MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] =
    MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] =
    MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] =
    MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;

(function () {
    'use strict';

    angular.module('starter').filter('hashtag', hashtag);

    function hashtag($filter) {
        return function (text, target) {
            if (!text) return text;

            var replacedText = $filter('linky')(text, target);

            var targetAttr = "";
            if (angular.isDefined(target)) {
                targetAttr = target;
            }

            // replace #hashtags and send them to twitter
            var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
            replacedText        = text.replace(replacePattern1, '$1<a href="#/tab/search/%23$2"' + targetAttr + '>#$2</a>');

            // replace @mentions but keep them to our site
            var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
            replacedText        = replacedText.replace(replacePattern2, '$1<a href="#/tab/home/$2" >@$2</a>');

            return replacedText;
        };
    }

})();


(function () {
    'use strict';

    angular.module('starter').filter('words', words);

    function words() {

        ////////////////

        return function (input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '\u2026';
                }
            }
            return input;
        };
    }

})();


(function () {
    'use strict';

    angular.module('starter').directive('signinModal', signinModalDirective);

    function signinModalDirective($ionicModal, Loading, User, $state, Toast, AppConfig, $rootScope) {
        return {
            restrict: 'A',
            link    : signinModalLink,
        };

        function signinModalLink($scope, elem, attr) {
            elem.bind('click', function () {

                $scope.routeLogged = AppConfig.routes.home;

                $scope.form = {
                    username: '',
                    password: ''
                };

                $scope.submitLogin = function (rForm, data) {
                    var form = angular.copy(data);
                    if (rForm.$valid) {
                        Loading.start();
                        console.log(form);
                        User.signIn(form).then(function (data) {
                            console.log(data);
                            $rootScope.currentUser = data;
                            $state.go($scope.routeLogged, {
                                clear: true
                            });
                            $scope.closeModal();
                            Loading.end();
                        }).catch(function (resp) {
                            Toast.alert({
                                title: 'Error',
                                text : 'Incorrect username or password'
                            });
                            Loading.end();
                        });
                    } else {
                        return false;
                    }
                };

                $ionicModal.fromTemplateUrl('app/directive/SigninModalDirective.html', {
                    scope          : $scope,
                    animation      : 'slide-in-up',
                    focusFirstInput: true,
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });
            });
        }
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('signupModal', signupModalDirective);

    function signupModalDirective(AppConfig, Loading, User, $state, Toast, $ionicModal, $rootScope) {
        return {
            restrict: 'A',
            link    : signupModalLink,
        };

        function signupModalLink($scope, elem, attr) {
            elem.bind('click', function () {

                $scope.routeLogged = AppConfig.routes.home;

                $scope.form = {
                    username: '',
                    email   : '',
                    password: ''
                };

                $scope.submitRegister = function (rForm, data) {
                    if (rForm.$valid) {
                        Loading.start();
                        var form = angular.copy(data);
                        User.signUp(form).then(function (resp) {
                            console.log(resp);

                            // After register, login
                            User.signIn({
                                username: form.username,
                                password: form.password
                            }).then(function (data) {
                                console.log(data);
                                $rootScope.currentUser = Parse.User.current();
                                $state.go('user.avatar', {
                                    clear: true
                                });
                                Loading.end();
                                $scope.closeModal();
                            }).catch(function (resp) {
                                console.log(resp);
                                Toast.alert({
                                    title: 'Alert',
                                    text : resp.error
                                });
                                Loading.end();
                            });
                        }).catch(function (resp) {
                            console.log(resp);
                            Toast.alert({
                                title: 'Alert',
                                text : resp.error
                            });
                            Loading.end();
                        });
                    }


                };

                $ionicModal.fromTemplateUrl('app/directive/SignupModalDirective.html', {
                    scope          : $scope,
                    animation      : 'slide-in-up',
                    focusFirstInput: true,
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });
            });
        }
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('albumGrid', albumGridDirective);

    function albumGridDirective(GalleryAlbum, $rootScope) {

        return {
            restrict   : 'E',
            scope      : {
                username: '=',
                user    : '=',
                profile : '=',
                onReload: '=',
            },
            templateUrl: 'app/directive/albumGridDirective.html',
            link       : albumGridLink
        };

        function albumGridLink($scope, elem, attr) {
            // Can Edit
            $scope.canEdit = ($scope.username === Parse.User.current().username) ? true : false;

            init();

            if ($scope.username) {
                $scope.params.username = $scope.username;
            }


            $rootScope.$on('photoInclude', function (elem, item) {
                if (item.objectId) {
                    item.id = item.objectId;
                }
                $scope.data.unshift(item);
            });


            $rootScope.$on('gallery:search', function (elem, item) {
                console.log(elem, item);
                $scope.params.search = item.text;
                $scope.onReload();
            });

            $rootScope.$on('albumGrid:reload', function (elem, item) {
                init();
                $scope.onReload();
            });


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                GalleryAlbum.list($scope.params).then(function (data) {

                    // If can Edit
                    if ($scope.canEdit) {
                        if (!_.some($scope.data, {create: true})) {
                            $scope.data.push({
                                create: true
                            });
                        }
                    }

                    if (data.length > 0) {
                        $scope.params.page++;
                        data.map(function (item) {
                            $scope.data.push(item);
                        });
                    } else {
                        if ($scope.data.length === 0) {
                            $scope.showEmptyView = true;
                        }
                        $scope.moreDataCanBeLoaded = false;
                    }

                    $scope.loading = false;
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    $rootScope.$broadcast('scroll.refreshComplete');

                }).catch(function () {
                    if ($scope.data.length === 0) {
                        $scope.showErrorView = true;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            $scope.onLoadMore = function () {
                loadFeed();
            };

            $scope.onReload = function () {
                init()
                loadFeed();
                $scope.$broadcast('scroll.refreshComplete');
            };

            function init() {
                $scope.params              = {};
                $scope.params.page         = 1;
                $scope.data                = [];
                $scope.moreDataCanBeLoaded = true;
                $scope.loading             = false;
            }
        }

    }


})();

(function () {
    'use strict';

    angular.module('starter').directive('albumPhotoGrid', albumPhotoGridDirective);

    function albumPhotoGridDirective(AppConfig, Gallery, GalleryAlbum, Dialog, $rootScope, PhotoService, Loading, ParseFile, $translate, Toast, $ionicModal, $ionicPopover) {

        return {
            restrict: 'A',
            scope   : {
                album: '=',
                edit : '='
            },
            link    : albumPhotoGridCtrl
        };

        function albumPhotoGridCtrl($scope, elem, attr) {

            elem.bind('click', function () {
                $scope.theme   = AppConfig.theme;
                $scope.canEdit = $scope.edit;

                if (!$scope.album) {
                    return false;
                }
                $ionicModal.fromTemplateUrl('app/directive/albumPhotoGridDirective.html', {
                    scope: $scope,
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.closeAlbumPhotoGridModal = function () {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                function init() {
                    $scope.loading = true;
                    Gallery.getAlbum({id: $scope.album}).then(function (data) {
                        console.log(data);
                        $scope.title   = data.album.attributes.title;
                        $scope.data    = data.photos;
                        $scope.loading = false;
                    });
                }

                init();


                // Popover
                $scope.openPopover  = function ($event) {
                    $ionicPopover.fromTemplateUrl('app/directive/albumPhotoGridPopover.html', {
                        scope: $scope
                    }).then(function (popover) {
                        $scope.popover = popover;
                        $scope.popover.show($event);
                    });
                };
                $scope.closePopover = function () {
                    $scope.popover.hide();
                };

                $scope.uploadPhoto = function () {
                    $scope.closePopover();
                    PhotoService.open().then(PhotoService.modalPost).then(function (form) {
                        Loading.start();
                        ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                            form.image = imageUploaded;
                            Gallery.create(form).then(function (item) {
                                $scope.$emit('albumGrid:reload', item);
                                init();
                                Loading.end();
                            });
                        });
                    });
                    $scope.closePopover();
                };

                $scope.editAlbum = function () {
                    $scope.closePopover();
                    $scope.form = {
                        title      : '',
                        description: ''
                    };


                    $ionicModal.fromTemplateUrl('app/directive/galleryNewAlbumModalDirective.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        $scope.modalAlbum = modal;

                        Loading.start();
                        GalleryAlbum.get($scope.album).then(function (album) {
                            $scope.form = album;
                            $scope.modalAlbum.show();
                            Loading.end();
                        });
                    });
                    $scope.createAlbum = function (rForm, form) {
                        console.log(rForm, form);
                        if (rForm.$valid) {
                            $scope.form.save().then(function (data) {
                                console.log(data);
                                $scope.closeAlbumPhotoGridModal();
                                $scope.closeModal();
                                $rootScope.$emit('albumGrid:reload', true);
                            });
                        }
                    };

                    $scope.closeModal = function () {
                        $scope.modalAlbum.hide();
                    };
                };

                $scope.deleteAlbum = function () {
                    $scope.closePopover();
                    Dialog.confirm({
                        title  : $translate.instant('deleteAlbum'),
                        message: $translate.instant('areSure?')
                    }).then(function (resp) {
                        console.log(resp);
                        if (resp) {
                            Loading.start();
                            GalleryAlbum.get($scope.album).then(function (item) {
                                GalleryAlbum.destroy(item).then(function (resp) {
                                    console.log(resp);
                                    $scope.closeAlbumPhotoGridModal();
                                    Loading.end();
                                    Toast.alert({
                                        title: $translate.instant('album'),
                                        text : $translate.instant('removedSuccess')
                                    });
                                    $rootScope.$emit('albumGrid:reload', true);
                                });
                            })
                        }
                    });
                };


            });
        }

    }


})();

(function () {
    'use strict';
    angular
        .module('starter')
        .directive('buy', buyDirective);

    function buyDirective($cordovaInAppBrowser) {
        return {
            restrict: 'A',
            link: buyLink
        };

        function buyLink(scope, elem) {
            elem.bind('click', function () {
                var url     = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FAW4JZS7KJM5S';

                if(window.cordova ) {
                    cordova
                        .ThemeableBrowser
                        .open(url, '_blank', {
                            statusbar: {
                                color: '#ffffffff'
                            },
                            toolbar: {
                                height: 44,
                                color: '#f0f0f0ff'
                            },
                            title: {
                                color: '#333333',
                                showPageTitle: true
                            },
                            closeButton: {
                                image: 'close',
                                imagePressed: 'close_pressed',
                                align: 'left',
                                event: 'closePressed'
                            },
                            backButtonCanClose: true
                        });
                } else {
                    window.open(url,'_blank');
                }
            });
        }
    }

})();

(function () {
    'use strict';

    angular.module('starter').directive('compareTo', compareToDirective);

    function compareToDirective() {
        return {
            restrict: 'A',
            scope   : {
                targetModel: '=compareTo'
            },
            require : 'ngModel',
            link    : function postLink(scope, element, attrs, ctrl) {

                var compare = function () {

                    var e1 = element.val();
                    var e2 = scope.targetModel;

                    if (e2 !== null) {
                        return e1 === e2;
                    }

                    return false;
                };

                scope.$watch(compare, function (newValue) {
                    ctrl.$setValidity('errorCompareTo', newValue);
                });

            }
        };
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('distanceModal', distanceModalDirective);

    function distanceModalDirective($localStorage, $ionicModal) {
        return {
            restrict: 'A',
            link    : distanceModalLink
        };

        function distanceModalLink($scope, elem, attr) {

            elem.bind('click', function () {
                    $scope.storage   = $localStorage;
                    $scope.distances = [
                        {
                            val : 0.20,
                            text: 'perto'
                        },
                        {
                            val : 0.60,
                            text: 'longe'
                        },
                        {
                            val : 1.00,
                            text: '1 ' + $scope.storage.unit
                        },
                        {
                            val : 5.00,
                            text: '5 ' + $scope.storage.unit
                        },
                        {
                            val : 10.00,
                            text: '10 ' + $scope.storage.unit
                        },
                        {
                            val : 25.00,
                            text: '25 ' + $scope.storage.unit
                        },
                        {
                            val : 50.00,
                            text: '50 ' + $scope.storage.unit
                        },
                        {
                            val : 100.00,
                            text: '100 ' + $scope.storage.unit
                        },
                    ];

                    $ionicModal.fromTemplateUrl('app/directive/distanceModal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();

                    });

                    $scope.onDistanceSelected = function (distance) {
                        console.log('Distance', distance);
                    };

                    $scope.closeDistanceModal = function () {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    };


                }
            );
        }
    }

})
();
(function () {
    'use strict';

    angular.module('starter').directive('emailValidator', emailValidatorDirective);

    function emailValidatorDirective(User) {
        return {
            require: 'ngModel',
            link    : emailValidatorLink,
        };

        function emailValidatorLink(scope, elem, attr,ngModel) {
            ngModel.$asyncValidators.email = function  (modelValue, viewValue) {
                console.log(viewValue);
                if(viewValue) {
                    return User.validateEmail(viewValue);
                }
            }
        }
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, $q, $ionicPlatform, $state, $translate, AppConfig, Facebook, Dialog, User, $rootScope, Toast) {
        return {
            restrict: 'E',
            link    : facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ me.name || \'loginWithFacebook\'| translate}}</span> </button>',
        };

        function facebookLoginLink(scope, elem, attr) {

            scope.facebookStatus = null;

            elem.bind('click', facebookLogin);

            function facebookLogin() {
                console.log('Facebook login');

                scope.loading = true;

                Facebook.logIn().then(function (fbAuthData) {
                    console.log(fbAuthData);
                    Loading.start();
                    if (fbAuthData.status === 'connected') {
                        var fbData = null;
                        return Facebook.me().then(function (data) {
                            fbData = data;
                            return User.findByEmail(data.email);
                        }).then(function (user) {
                            if (!user.id) {
                                return User.signInViaFacebook(fbAuthData);
                            } else if (user.get('authData')) {
                                if (user.get('authData').facebook.id === fbData.id) {
                                    return User.signInViaFacebook(fbAuthData);
                                }
                            } else {
                                $rootScope.tempUser = user;
                                $state.go('user.merge', {clear: true});
                            }
                        }).then(function () {
                            return User.updateWithFacebookData(fbData);
                        }).then(function (user) {
                            if (user) {
                                $rootScope.currentUser = user;
                                $state.go(AppConfig.routes.home, {
                                    clear: true
                                });
                                console.log(user, user.attributes);
                                $rootScope.$broadcast('onUserLogged');
                                Loading.end();
                                Toast.alert({text: $translate.instant('loggedInAsText') + ' ' + user.get('email')});
                            } else {
                                console.log('Error ');
                            }
                        }, function (error) {
                            Dialog.alert(error);
                            Loading.end();
                            scope.loading = false;
                        });
                    }

                }).catch(function (err) {
                    console.log('err', err);
                    Loading.end();
                    scope.loading = false;
                });

            }

        }
    }

})();

(function () {
    'use strict';
    angular.module('starter').directive('focusMe', focusMeDirective);

    function focusMeDirective($timeout, $rootScope) {
        return {
            restrict: 'A',
            link    : function (scope, element, attrs) {

                $rootScope.$on('openKeyboard', openKeyboard);

                openKeyboard();

                function openKeyboard() {
                    $timeout(function () {
                        element[0].focus();
                        element[0].click();
                        if (window.cordova) {
                            cordova.plugins.Keyboard.show();
                        }
                    }, 750);
                }
            }
        };
    }

})();

(function () {
    'use strict';

    angular.module('starter').directive('galleryAlbumModal', galleryAlbumModalDirective);

    function galleryAlbumModalDirective($ionicModal, $q, GalleryAlbum, $rootScope) {
        return {
            restrict: 'A',
            link    : galleryAlbumModalLink,
            scope   : {
                ngModel: '='
            }
        };

        function galleryAlbumModalLink($scope, elem, attr) {

            elem.bind('click', openModal);

            function openModal() {
                var defer = $q.defer();

                $scope.loading = true;


                init();
                loadFeed();

                function loadFeed() {
                    if ($scope.loading) return;
                    $scope.loading = true;
                    GalleryAlbum.list($scope.params).then(function (data) {
                        console.log(data);
                        if (data.length > 0) {
                            $scope.params.page++;
                            data.map(function (item) {
                                $scope.data.push(item);
                            });
                        } else {
                            if ($scope.data.length === 0) {
                                $scope.showEmptyView = true;
                            }
                            $scope.moreDataCanBeLoaded = false;
                        }

                        $scope.loading = false;
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        $rootScope.$broadcast('scroll.refreshComplete');

                    }).catch(function (err) {
                        if ($scope.data.length === 0) {
                            $scope.showErrorView = true;
                        }
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }

                $scope.onLoadMore = function () {
                    loadFeed();
                };

                $scope.onReload = function () {
                    init()
                    loadFeed();
                    $scope.$broadcast('scroll.refreshComplete');
                };

                function init() {
                    $scope.params              = {};
                    $scope.params.page         = 1;
                    $scope.data                = [];
                    $scope.moreDataCanBeLoaded = true;
                    $scope.loading             = false;

                    if ($scope.canEdit) {
                        $scope.data.push({
                            create: true
                        });
                    }
                }

                $ionicModal.fromTemplateUrl('app/directive/galleryAlbumModalDirective.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $rootScope.$on('selectAlbum', function (event, album) {
                    console.log('selectAlbum', event);
                    console.log('selectAlbum', album);
                    $scope.ngModel = album;
                    $scope.closeModal();
                });


                $scope.closeModal = function () {
                    $scope.modal.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.selectAlbum = function (album) {
                    $scope.ngModel = album;
                    $scope.closeModal();
                };

                return defer.promise;
            }

        }
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('galleryNewAlbumModal', galleryNewAlbumModalDirective);

    function galleryNewAlbumModalDirective($ionicModal, $q, $rootScope, GalleryAlbum) {
        return {
            restrict: 'A',
            link    : galleryNewAlbumModalLink,
            scope   : {
                ngModel: '='
            }
        };

        function galleryNewAlbumModalLink($scope, elem, attr) {

            elem.bind('click', openModal);

            function openModal() {
                var defer = $q.defer();

                $scope.form = {
                    title      : '',
                    description: ''
                };


                $ionicModal.fromTemplateUrl('app/directive/galleryNewAlbumModalDirective.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.createAlbum = function (rForm, form) {
                    console.log(rForm, form);
                    if (rForm.$valid) {
                        GalleryAlbum.create(angular.copy(form)).then(function (album) {
                            console.log('album created', album);
                            $scope.ngModel = album;
                            $scope.closeModal();
                            $rootScope.$emit('selectAlbum', album);
                            $rootScope.$emit('albumGrid:reload', album);
                        });
                    } else {

                    }
                };

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.selectAlbum = function (album) {
                    $scope.ngModel = album;
                    $scope.closeModal();
                };

                return defer.promise;
            }

        }
    }

})();
(function () {
  'use strict';

 angular
    .module('starter')
    .directive('heart', heartDirective);

  function heartDirective() {
    return {
      restrict: 'A',
      scope: {
        item: '='
      },
      link: heartLink
    };

    function heartLink(scope, elem, attr) {
      elem.bind('click', function () {
        console.log(scope.item);
        elem.addClass('happy');
      });
    }
  }

})();

(function () {
    'use strict';

    angular.module('starter')
           .directive('ionLoading', ionLoading)
           .run(runLoading)
           .factory('Loading', Loading);

    function ionLoading() {
        return {
            restrict: 'E',
            scope   : {
                icon   : '@',
                loading: '='
            },
            template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
        };
    }

    function runLoading($rootScope, $ionicLoading) {
        //Loading
        $rootScope.$on('ionicLoading:true', function (text) {
            $rootScope.loading = true;
            $ionicLoading.show(text);
        });
        $rootScope.$on('ionicLoading:false', function () {
            $rootScope.loading = false;
            $ionicLoading.hide();
        });
    }

    function Loading($rootScope, $cordovaProgress, $timeout) {
        var seconds = 0;

        return {
            start: showLoading,
            end  : hideLoading,
        };


        function showLoading(text) {
            if (window.cordova) {
                $cordovaProgress.showSimple();
            } else {
                $rootScope.$broadcast('ionicLoading:true', text);
            }
        }

        function hideLoading() {
            $timeout(function () {
                if (window.cordova) {
                    $cordovaProgress.hide();
                } else {
                    $rootScope.$broadcast('ionicLoading:false');
                }
            }, parseInt(seconds + '000'));
        }
    }
})();
(function () {
  'use strict';

  angular
    .module('starter')
    .directive('loading', PhotogramLoadingDirective);

  function PhotogramLoadingDirective() {
    return {
      restrict: 'E',
      scope   : {
        loading: '=',
        icon   : '@'
      },
      template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
    };
  }

})();

(function () {
    'use strict';

    angular.module('starter').directive('mapPhotoUser', mapPhotoUserDirective);

    function mapPhotoUserDirective($state, $localStorage, Toast, Gallery, Geolocation, Dialog) {
        return {
            restrict: 'E',
            link    : mapPhotoUserLink,
            scope      : {
                username  : '=',
                load      : '=',
                onReload  : '=',
            },
            templateUrl: 'app/directive/mapPhotoUserDirective.html'
        };

        function mapPhotoUserLink($scope, elem, attr) {

            var markers      = [];
            var latlngbounds = new google.maps.LatLngBounds();
            $scope.maxRating = 5;
            $scope.storage   = $localStorage;
            $scope.galleries = [];
            $scope.params    = {
                location: null,
                distance: 100.00,
                page    : 1,
                limit   : 10,
                username: $scope.username
            };
            $scope.loading   = true;
            $scope.map

            function init() {
                $scope.galleries = [];
                removeGallerys();
                removeMarkers();

                var position   = {
                    latitude : -18.8800397,
                    longitude: -47.05878999999999
                };
                var mapOptions = {
                    center   : setPosition(position),
                    zoom     : 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
            }

            init();
            myPosition();


            function myPosition() {
                Geolocation.getCurrentPosition().then(function (position) {

                    console.log(position);

                    $scope.params.location = {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    var marker = {
                        position: setPosition($scope.params.location),
                        title   : 'I am here',
                        id      : 0
                    }

                    addMarker(marker);

                    // Set center locale
                    $scope.map.setCenter(setPosition($scope.params.location));

                    loadGallerys();
                }, function (error) {
                    $scope.params.location = null;

                    var errorMessage;
                    if (error.code === 1 || error.code === 3) {
                        errorMessage = 'errorGpsDisabledText';
                    } else {
                        errorMessage = 'errorLocationMissingText';
                    }
                    Dialog.alert(errorMessage);

                });
            }

            function setPosition(location) {
                if (location) {
                    return new google.maps.LatLng(location.latitude, location.longitude);
                }
            }

            function addMarker(item) {


                var markerOption = {
                    id       : item.id,
                    map      : $scope.map,
                    position : item.position,
                    title    : item.title,
                    animation: google.maps.Animation.DROP
                };

                if (item.icon) {
                    var size          = 40;
                    markerOption.icon = {
                        url       : item.icon,
                        size      : new google.maps.Size(size, size),
                        scaledSize: new google.maps.Size(size, size),
                        origin    : new google.maps.Point(0, 0),
                        anchor    : new google.maps.Point(size / 4, size / 4),
                    };
                }

                // VariÃ¡vel que define as opÃ§Ãµes do marcador
                var marker = new google.maps.Marker(markerOption);

                // Procedimento que mostra a Info Window atravÃ©s de um click no marcador
                google.maps.event.addListener(marker, 'click', function () {
                    // Open Profile
                    //if(item.username) {
                    //    $state.go('tab.mapProfile', {username: item.username})
                    //}

                    console.log(item.username);

                });

                markers.push(marker);

                new MarkerClusterer($scope.map, markers, {
                    imagePath: '../img/m'
                });

                latlngbounds.extend(item.position);
                $scope.map.fitBounds(latlngbounds);
            }

            function setGallerys(galleries) {
                $scope.galleries = galleries;
                galleries.map(function (item) {

                    if (item.location) {
                        var marker = {
                            map     : $scope.map,
                            id      : item.id,
                            position: setPosition(item.location),
                            title   : item.title,
                            image   : item.image.url(),
                            icon    : item.imageThumb.url(),
                            //username: item.user.attributes.username
                        };

                        addMarker(marker)
                    }
                });


            }

            function loadGallerys() {
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (galleries) {

                    if (galleries.length > 0) {
                        setGallerys(galleries);
                    } else {
                        Dialog.alert('galleriesNotFoundText');
                    }

                    $scope.loading = false;

                }, function () {
                    Toast.show('errorText');
                });
            }

            function removeGallerys() {
                $scope.galleries = [];
            }

            function removeMarkers() {
                markers.map(function (item) {
                    item.setMap(null);
                });
                markers = [];
            };

            $scope.onSearchHere = function () {
                $scope.params.location.latitude  = $scope.map.getCenter().lat();
                $scope.params.location.longitude = $scope.map.getCenter().lng();
                removeGallerys();
                removeMarkers();
                loadGallerys();
            }

            $scope.onGalleryClicked = function (item) {
                console.log(item);
            };
        }
    }

})();
(function () {
  'use strict';
  
  angular
    .module('starter')
    .directive('photogramFollow', photogramFollowDirective);

  function photogramFollowDirective($ionicModal, AppConfig, Photogram) {

    var path = AppConfig.path;

    return {
      restrict: 'A',
      scope: {
        user: '='
      },
      link: function (scope, elem, attr) {
        elem.bind('click', openModal);
        scope.closeModal = closeModal;

        function openModal() {
          $ionicModal.fromTemplateUrl(path + '/directive/follow/photogram.follow.modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modalFollow = modal;
            console.log('Open modal follow', scope.user);

            Photogram
              .getFollow(scope.user)
              .then(function (resp) {
                console.log(resp);
                scope.data = resp;
                scope.modalFollow.show();
              });

          });
        }

        function closeModal() {
          scope.modalFollow.hide();
          scope.modalFollow.remove();
        }
      }
    }
  }


})();

(function () {
    'use strict';

    angular.module('starter').directive('photoComment', photoCommentDirective);

    function photoCommentDirective($ionicModal, $timeout, $q, $ionicScrollDelegate, Loading, $ionicPopup, User, Dialog, $rootScope, Gallery, GalleryComment) {

        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function ($scope, elem) {


                elem.bind('click', openModalComment);

                function init() {
                    $scope.currentUser = Parse.User.current();
                    $scope.nocomments  = false;
                    $scope.loading     = false;
                    $scope.form        = {
                        gallery: $scope.ngModel.galleryObj,
                        text   : ''
                    };
                }

                function openModalComment() {
                    console.log($scope.ngModel);

                    init();

                    $scope.loading       = true;
                    $scope.submitComment = submitComment;
                    $scope.deleteComment = deleteComment;
                    $scope.editComment   = editComment;
                    $scope.closeModal    = function () {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    };

                    getComments();

                    //Mentios
                    // shows the use of dynamic values in mentio-id and mentio-for to link elements
                    $scope.myIndexValue = "5";


                    $scope.searchPeople = function (term) {
                        var peopleList = [];
                        return User.getFollowing().then(function (response) {
                            _.each(response, function (item) {
                                item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                                item.bio      = item.status;
                                if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                                    peopleList.push(item);
                                }
                            });
                            $scope.people = peopleList;
                            console.log(peopleList);
                            return $q.when(peopleList);
                        });
                    };

                    $scope.getPeopleTextRaw = function (item) {
                        return '@' + item.username;
                    };


                    //$scope.comments = $scope.ngModel.comments || [];
                    //$timeout(function () {
                    //    if ($scope.comments.length === 0) {
                    //        $scope.nocomments = true;
                    //    }
                    //}, 500);


                    $ionicModal.fromTemplateUrl('app/directive/photoCommentDirective.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();

                    });
                }

                function deleteComment(obj) {
                    console.log(obj);
                    Dialog.confirm(('Delete comment'), ('You are sure?')).then(function (resp) {
                        console.log(resp);
                        if (resp) {
                            GalleryComment.destroy(obj).then(function (resp) {
                                console.log(resp);
                                getComments();
                            });
                        }
                    });
                }

                function editComment(obj) {
                    console.log(obj);
                    // An elaborate, custom popup
                    $scope.data = angular.copy(obj);
                    $ionicPopup
                        .show({
                            template: '<input type="text" ng-model="data.text">',
                            title   : ('Edit comment'),
                            //subTitle: 'Please use normal things',
                            scope   : scope,
                            buttons : [{
                                text: ('Cancel')
                            }, {
                                text : '<b>OK</b>',
                                type : 'button-positive',
                                onTap: function (e) {
                                    console.log($scope.data);
                                    if (!$scope.data.text) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        return $scope.data;
                                    }
                                }
                            }]
                        })
                        .then(function (resp) {
                            console.log(resp);
                            if (resp) {
                                GalleryComment.update(resp)
                                              .then(function (resp) {
                                                  console.log(resp);
                                                  getComments();
                                              });
                            }
                        });
                }

                function getComments() {
                    $scope.loading = true;


                    Gallery.comments({galleryId: $scope.ngModel.id}).then(function (resp) {
                        $scope.comments         = resp;
                        $scope.ngModel.comments = resp;
                        $scope.loading          = false;

                        $timeout(function () {
                            // Scroll to bottom
                            $ionicScrollDelegate.scrollBottom();
                        }, 1);
                    });
                }

                function submitComment(rForm, form) {
                    if (rForm.$valid) {
                        var dataForm = angular.copy(form);
                        console.log(dataForm);
                        Loading.start();
                        GalleryComment.create(dataForm).then(function (resp) {
                            console.log(resp);
                            getComments();
                            $rootScope.$emit('openKeyboard');
                            Loading.end();
                            $scope.closeModal();
                        });
                    }
                }


            }
        };
    }

})();

(function () {
    'use strict';

    angular.module('starter').directive('photoGrid', photoGridDirective);

    function photoGridDirective(Gallery, $rootScope, $ionicPopup, Share, FeedbackModal, $ionicActionSheet) {

        return {
            restrict   : 'E',
            scope      : {
                username: '=',
                user    : '=',
                profile : '=',
                onReload: '=',
            },
            templateUrl: 'app/directive/photoGridDirective.html',
            link       : photoGridCtrl
        };

        function photoGridCtrl($scope, elem, attr) {
            init();

            if ($scope.username) {
                $scope.params.username = $scope.username;
            }

            $rootScope.$on('photoInclude', function (elem, item) {
                if (item.objectId) {
                    item.id = item.objectId;
                }
                $scope.data.unshift(item);
            });

            $rootScope.$on('gallery:search', function (elem, item) {
                console.log(elem, item);
                $scope.params.search = item.text;
                $scope.onReload();
            });


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (data) {
                    console.log(data);

                    if (data.length > 0) {
                        $scope.params.page++;
                        data.map(function (item) {
                            $scope.data.push(item);
                        });
                    } else {
                        if ($scope.data.length === 0) {
                            $scope.showEmptyView = true;
                        }
                        $scope.moreDataCanBeLoaded = false;
                    }

                    $scope.loading = false;
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    $rootScope.$broadcast('scroll.refreshComplete');

                }).catch(function () {
                    if ($scope.data.length === 0) {
                        $scope.showErrorView = true;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            $scope.onLoadMore = function () {
                loadFeed();
            };


            $scope.onReload = function () {
                init()
                loadFeed();
                $scope.$broadcast('scroll.refreshComplete');
            };

            function init() {
                $scope.params              = {};
                $scope.params.page         = 1;
                $scope.data                = [];
                $scope.moreDataCanBeLoaded = true;
                $scope.loading             = false;

                if ($scope.canEdit) {
                    $scope.data.push({
                        create: true
                    });
                }
            }

            $scope.action = function (gallery) {

                var buttons = [
                    {
                        text: '<i class="icon ion-share"></i>' + ('Share')
                    }, {
                        text: '<i class="icon ion-alert-circled"></i>' + ('Report')
                    }
                ];


                console.log(gallery);

                if (Parse.User.current().id === gallery.user_id) {
                    var buttonDelete = {
                        text: '<i class="icon ion-trash-b"></i>' + ('Delete your photo')
                    };
                    buttons.push(buttonDelete);
                }
                var message = {
                    text : gallery.title,
                    image: gallery.img
                };

                var actionSheet = {
                    buttons      : buttons,
                    titleText    : ('Photo'),
                    cancelText   : ('Cancel'),
                    buttonClicked: actionButtons
                };


                function actionButtons(index) {
                    switch (index) {
                        case 0:
                            Share.share(message);
                            break;
                        case 1:
                            FeedbackModal.modal(gallery);
                            break;
                        case 2:

                            $ionicPopup
                                .confirm({
                                    title   : ('Delete photo'),
                                    template: ('Are you sure?')
                                })
                                .then(function (res) {
                                    if (res) {
                                        Gallery.destroy(gallery).then(function () {
                                            console.log('Photo deleted');
                                            $scope.$emit('PhotogramHome:reload');
                                        });
                                    }
                                });


                    }
                    return true;
                }

                // Show the action sheet
                $ionicActionSheet.show(actionSheet);
            };

        }

    }


})();

(function () {
    'use strict';
    angular.module('starter').directive('photoLike', photoLikeDirective);

    function photoLikeDirective(Gallery) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function (scope, elem) {
                elem.bind('click', function () {
                        var _model      = scope.ngModel;
                        _model.progress = true;
                        _model.liked    = !_model.liked;

                        Gallery.likeGallery({galleryId: scope.ngModel.id}).then(function (resp) {
                            console.log(resp);
                            _model.likes    = resp.likes;
                            _model.progress = false;
                            console.log(_model, resp);
                            if (resp.action === 'like') {
                                scope.ngModel.isLiked = true;
                                scope.ngModel.likesTotal += 1;
                            }

                            if (resp.action === 'unlike') {
                                scope.ngModel.isLiked = false;
                                scope.ngModel.likesTotal -= 1;
                            }
                        });
                    }
                );

            }
        };
    }


})();

(function () {
    'use strict';

    angular.module('starter').directive('photoList', photoListDirective);

    function photoListDirective(Gallery, $rootScope, Loading, $ionicPopup, $translate, $state, Facebook, Toast, FeedbackModal, $ionicActionSheet) {

        return {
            restrict   : 'E',
            scope      : {
                username  : '=',
                profile   : '=',
                load      : '=',
                openLikers: '=',
                onReload  : '=',
                id        : '='
            },
            templateUrl: 'app/directive/photoListDirective.html',
            link       : photoListController
        };

        function photoListController($scope, elem, attr) {
            init();

            if ($scope.username) {
                $scope.params.username = $scope.username;
            }

            if ($scope.id) {
                $scope.params.id = $scope.id;
            }

            $rootScope.$on('photoInclude', function (elem, item) {
                if (item.objectId) {
                    item.id = item.objectId;
                }
                $scope.data.unshift(item);
            });

            $scope.openComment = function (galleryId) {
                $state.go('galleryComments', {galleryId: galleryId})
            };

            $scope.share = function  (item) {
                console.log(item);
                Facebook.postImage(item);
            };


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (data) {

                    console.log(data);
                    if (data.length > 0) {
                        $scope.params.page++;
                        data.map(function (item) {
                            $scope.data.push(item);
                        });
                    } else {
                        if ($scope.data.length === 0) {
                            $scope.showEmptyView = true;
                        }
                        $scope.moreDataCanBeLoaded = false;
                    }

                    $scope.loading = false;
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    $rootScope.$broadcast('scroll.refreshComplete');

                }).catch(function (err) {
                    if ($scope.data.length === 0) {
                        $scope.showErrorView = true;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            $scope.onLoadMore = function () {
                loadFeed();
            };

            $scope.onReload = function () {
                init()
                loadFeed();
                $scope.$broadcast('scroll.refreshComplete');
            };

            function init() {
                $scope.params              = {};
                $scope.params.page         = 1;
                $scope.data                = [];
                $scope.moreDataCanBeLoaded = true;
                $scope.loading             = false;

                if ($scope.canEdit) {
                    $scope.data.push({
                        create: true
                    });
                }
            }

            $rootScope.$on('onUserLogged', $scope.onReload);

            $scope.action = function (gallery) {

                var buttons = [
                    {
                        text: '<i class="icon ion-alert-circled"></i>' + $translate.instant('reportText')
                    }
                ];


                console.log(gallery);

                if (Parse.User.current().id === gallery.user.obj.id) {
                    var buttonDelete = {
                        text: '<i class="icon ion-trash-b"></i>' + $translate.instant('deleteGallery')
                    };
                    buttons.push(buttonDelete);
                }
                var message = {
                    text : gallery.title,
                    image: gallery.img
                };

                var actionSheet = {
                    buttons      : buttons,
                    cancelText   : $translate.instant('cancelText'),
                    buttonClicked: actionButtons
                };


                function actionButtons(index) {
                    switch (index) {
                        case 0:
                            FeedbackModal.modal(gallery.id);
                            break;
                        case 1:

                            $ionicPopup
                                .confirm({
                                    title   : $translate.instant('deleteGalleryConfirmText'),
                                    template: $translate.instant('areSure')
                                })
                                .then(function (res) {
                                    if (res) {
                                        Loading.start();
                                        Gallery.get(gallery.id).then(function (gallery) {
                                            if(gallery) {
                                                Gallery.destroy(gallery).then(function () {
                                                    console.log('Photo deleted');
                                                    Toast.alert({
                                                        title: 'Photo',
                                                        text : 'Photo deleted'
                                                    });
                                                    $scope.onReload();
                                                    Loading.end();
                                                });
                                            } else {
                                                $scope.onReload();
                                                Loading.end();
                                            }
                                        }).catch(function  () {
                                            $scope.onReload();
                                            Loading.end();
                                        })

                                    }
                                });


                    }
                    return true;
                }

                // Show the action sheet
                $ionicActionSheet.show(actionSheet);
            };

        }

    }


})();

(function () {
    'use strict';

    angular.module('starter').directive('profileModalEdit', profileModalEditDirective);

    function profileModalEditDirective($ionicModal, $rootScope, ParsePush, $localStorage, User, Loading, $state) {

        return {
            restrict: 'A',
            scope   : {
                user: '='
            },
            template: '',
            link    : function (scope, elem) {


                elem.bind('click', openModal);


                function init() {
                    scope.theme      = $rootScope.theme;
                    var user         = Parse.User.current().attributes;
                    scope.form       = {
                        name    : user.name,
                        email   : user.email,
                        status  : user.status,
                        photo   : user.photo,
                        username: user.username,
                        gender  : user.gender,
                        facebook: user.facebook
                    };
                }


                function openModal() {

                    scope.linkFacebook        = linkFacebook;
                    scope.logout              = logout;
                    scope.submitUpdateProfile = submitUpdateProfile;
                    scope.closeModal          = closeModal;
                    scope.currentUser         = $rootScope.currentUser;

                    init();

                    $ionicModal.fromTemplateUrl('app/directive/profile-edit-modal.html', {
                        scope: scope
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });

                    // Cleanup the modal when we're done with it!
                    scope.$on('$destroy', function () {
                        scope.modal.remove();
                    });

                }

                function logout() {
                    delete window.localStorage['Parse/myAppId/currentUser'];
                    delete window.localStorage['Parse/myAppId/installationId'];
                    $localStorage.$reset({});
                    $state.go('user.intro', {clear: true});
                    scope.closeModal();
                }

                function linkFacebook() {
                    User.facebookLink().then(function (resp) {
                        console.log(resp);
                    });
                }

                function submitUpdateProfile() {
                    var dataForm = angular.copy(scope.form);
                    Loading.start();

                    var username = Parse.User.current().username;

                    // Change Username Subscribe for Push
                    if (username != dataForm.username) {
                        ParsePush.unsubscribe(username);
                        ParsePush.subscribe(username);
                    }

                    User.update(dataForm).then(function (resp) {
                        scope.user             = resp;
                        $rootScope.currentUser = resp;
                        Loading.end();
                        scope.closeModal();
                    });
                }

                function closeModal() {
                    scope.modal.hide();
                }

            }
        };
    }

})();

(function () {
    'use strict';
    angular.module('starter').directive('profileModal', profileModalDirective);

    function profileModalDirective($ionicModal, User) {

        return {
            restrict: 'A',
            scope   : {
                username: '='
            },
            link    : profileModalLink
        };

        function profileModalLink(scope, elem) {
            elem.bind('click', function () {

                console.log(scope.username);

                User.profile(scope.username).then(function (data) {
                    console.log(data);
                    scope.user = data;
                    openModal();
                });

            });

            function openModal() {

                console.log(scope.user.attributes);

                $ionicModal.fromTemplateUrl('app/directive/profile-modal.html', {
                    scope: scope
                }).then(function (modal) {
                    scope.modalProfile  = modal;
                    scope.loadingFollow = true;
                    scope.changeTab     = changeTab;
                    scope.follow        = follow;
                    scope.closeModal    = closeModal;
                    scope.modalProfile.show();

                    changeTab('list');

                    function follow() {

                        scope.loadingFollow = true;
                        var status;

                        if (scope.user.follow) {
                            status = false;
                        } else {
                            status = true;
                        }

                        User.follow(scope.user.userObj.id).then(function (resp) {
                            console.log('Follow result', resp);
                            scope.user.isFollow = (resp === 'follow') ? true : false;
                            if (resp == 'follow') {
                                scope.user.followersTotal += 1;
                            }
                            if (resp == 'unfollow') {
                                scope.user.followersTotal -= 1;
                            }
                            scope.loadingFollow = false;
                        });


                    }

                    function closeModal() {
                        delete scope.data;
                        scope.modalProfile.hide();
                    }
                });

                // Cleanup the modal when we're done with it!
                scope.$on('$destroy', function () {
                    scope.modalProfile.remove();
                });
            }

            function changeTab(tab) {
                if (tab === 'list') {
                    scope.tab = {
                        list: true,
                        grid: false
                    };
                } else {
                    scope.tab = {
                        list: false,
                        grid: true
                    };
                }
            }


        }
    }

})();

(function () {
  'use strict';

  angular
    .module('starter')
    .directive('ionSearch', ionSearchDirective);

  function ionSearchDirective($timeout) {

    return {
      restrict   : 'E',
      scope      : {
        getData: '&source',
        ngModel: '=?',
        search : '=?filter'
      },
      templateUrl: 'app/module/photogram/directive/search/search-directive.html',
      link       : function (scope, element, attrs) {
        attrs.minLength = attrs.minLength || 0;
        scope.placeholder = attrs.placeholder || '';
        scope.clear = function () {
          console.log('Limpar campo');
          scope.input = '';
          scope.$apply();
        };

        if (attrs.class) {
          element.addClass(attrs.class);
        }

        if (attrs.source) {
          scope.$watch('search.value', watchSearch);
        }

        function watchSearch(newValue) {
          if (newValue.length > attrs.minLength) {
            $timeout(function () {
              scope
                .getData({
                  str: newValue
                })
                .then(function (results) {
                  scope.ngModel = results;
                });
            }, 1000);
          } else {
            scope.ngModel = [];
          }
        }

      }

    };
  }


})();

(function () {
    'use strict';

    angular
        .module('starter')
        .directive('settingsModal', settingsModalDirective);

    function settingsModalDirective($ionicModal, $translate, AppConfig, $cordovaInAppBrowser, Share, Auth, User,  $state) {

        return {
            restrict: 'A',
            template: '',
            link    : function (scope, elem) {

                elem.bind('click', openModal);
                scope.share = Share.share;

                scope.logout = function () {
                    $state.go(AppConfig.routes.login);
                    scope.closeSettingModal();
                };

                function init() {
                    scope.form       = Auth.getLoggedUser();
                    scope.languages  = AppConfig.locales;
                    scope.language   = $translate.use();
                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('app/directive/settings-modal.html', {
                        scope: scope
                    }).then(function (modal) {
                        scope.modalSetting = modal;
                        scope.modalSetting.show();

                    });

                    scope.closeSettingModal = function () {
                        scope.modalSetting.hide();
                        scope.modalSetting.remove();
                    };

                    scope.link       = function (sref) {
                        $state.go(sref);
                        scope.closeModal();
                    };
                }


            }
        };
    }


})();

(function () {
    'use strict';

    angular.module('starter').directive('usernameValidator', usernameValidatorDirective);

    function usernameValidatorDirective(User) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link    : usernameValidatorLink,
        };

        function usernameValidatorLink(scope, elem, attr, ngModel) {
            ngModel.$asyncValidators.username = function  (modelValue, viewValue) {
                if(viewValue) {
                    return User.validateUsername(viewValue);
                }
            }
        }
    }

})();
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.io = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('./url');
var parser = _dereq_('socket.io-parser');
var Manager = _dereq_('./manager');
var debug = _dereq_('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = _dereq_('./manager');
exports.Socket = _dereq_('./socket');

},{"./manager":2,"./socket":4,"./url":5,"debug":14,"socket.io-parser":40}],2:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var eio = _dereq_('engine.io-client');
var Socket = _dereq_('./socket');
var Emitter = _dereq_('component-emitter');
var parser = _dereq_('socket.io-parser');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:manager');
var indexOf = _dereq_('indexof');
var Backoff = _dereq_('backo2');

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function(){
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.engine.id;
    }
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function(v){
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function(){
  this.lastPing = new Date;
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function(){
  this.emitAll('pong', new Date - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function(){
      socket.id = self.engine.id;
    });

    if (this.autoConnect) {
      // manually call here since connecting evnet is fired before listening
      onConnecting();
    }
  }

  function onConnecting() {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  debug('cleanup');

  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' == this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

},{"./on":3,"./socket":4,"backo2":8,"component-bind":11,"component-emitter":12,"debug":14,"engine.io-client":16,"indexof":32,"socket.io-parser":40}],3:[function(_dereq_,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}

},{}],4:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var parser = _dereq_('socket.io-parser');
var Emitter = _dereq_('component-emitter');
var toArray = _dereq_('to-array');
var on = _dereq_('./on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:socket');
var hasBin = _dereq_('has-binary');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  var ack = this.acks[packet.id];
  if ('function' == typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function(compress){
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};

},{"./on":3,"component-bind":11,"component-emitter":12,"debug":14,"has-binary":30,"socket.io-parser":40,"to-array":43}],5:[function(_dereq_,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = _dereq_('parseuri');
var debug = _dereq_('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('/' == uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"debug":14,"parseuri":38}],6:[function(_dereq_,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],7:[function(_dereq_,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],8:[function(_dereq_,module,exports){

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],9:[function(_dereq_,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();

},{}],10:[function(_dereq_,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],11:[function(_dereq_,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],12:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],13:[function(_dereq_,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],14:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":15}],15:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":35}],16:[function(_dereq_,module,exports){

module.exports =  _dereq_('./lib/');

},{"./lib/":17}],17:[function(_dereq_,module,exports){

module.exports = _dereq_('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = _dereq_('engine.io-parser');

},{"./socket":18,"engine.io-parser":27}],18:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = _dereq_('./transports');
var Emitter = _dereq_('component-emitter');
var debug = _dereq_('debug')('engine.io-client:socket');
var index = _dereq_('indexof');
var parser = _dereq_('engine.io-parser');
var parseuri = _dereq_('parseuri');
var parsejson = _dereq_('parsejson');
var parseqs = _dereq_('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure :
    (global.location && 'https:' == location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;

  // other options for Node.js client
  var freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }
  }

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = _dereq_('./transport');
Socket.transports = _dereq_('./transports');
Socket.parser = _dereq_('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this,
    pfx: this.pfx,
    key: this.key,
    passphrase: this.passphrase,
    cert: this.cert,
    ca: this.ca,
    ciphers: this.ciphers,
    rejectUnauthorized: this.rejectUnauthorized,
    perMessageDeflate: this.perMessageDeflate,
    extraHeaders: this.extraHeaders
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function(){
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if('function' == typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' == typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' == this.readyState || 'closed' == this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function() {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close() {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose() {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade() {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./transport":19,"./transports":20,"component-emitter":26,"debug":14,"engine.io-parser":27,"indexof":32,"parsejson":36,"parseqs":37,"parseuri":38}],19:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var parser = _dereq_('engine.io-parser');
var Emitter = _dereq_('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":26,"engine.io-parser":27}],20:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
var XHR = _dereq_('./polling-xhr');
var JSONP = _dereq_('./polling-jsonp');
var websocket = _dereq_('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./polling-jsonp":21,"./polling-xhr":22,"./websocket":24,"xmlhttprequest-ssl":25}],21:[function(_dereq_,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = _dereq_('./polling');
var inherit = _dereq_('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  }
  else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
  
  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./polling":23,"component-inherit":13}],22:[function(_dereq_,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
var Polling = _dereq_('./polling');
var Emitter = _dereq_('component-emitter');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != global.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  } else {
    this.extraHeaders = opts.extraHeaders;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(fromError){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch(e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        try {
          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
        } catch (e) {
          var ui8Arr = new Uint8Array(this.xhr.response);
          var dataArray = [];
          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
            dataArray.push(ui8Arr[idx]);
          }

          data = String.fromCharCode.apply(null, dataArray);
        }
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (global.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./polling":23,"component-emitter":26,"component-inherit":13,"debug":14,"xmlhttprequest-ssl":25}],23:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parseqs = _dereq_('parseqs');
var parser = _dereq_('engine.io-parser');
var inherit = _dereq_('component-inherit');
var yeast = _dereq_('yeast');
var debug = _dereq_('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

},{"../transport":19,"component-inherit":13,"debug":14,"engine.io-parser":27,"parseqs":37,"xmlhttprequest-ssl":25,"yeast":45}],24:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parser = _dereq_('engine.io-parser');
var parseqs = _dereq_('parseqs');
var inherit = _dereq_('component-inherit');
var yeast = _dereq_('yeast');
var debug = _dereq_('debug')('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  try {
    WebSocket = _dereq_('ws');
  } catch (e) { }
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }

  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'buffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function(packet) {
      parser.encodePacket(packet, self.supportsBinary, function(data) {
        if (!BrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        //Sometimes the websocket has already been closed but the browser didn't
        //have a chance of informing us about it yet, in that case send will
        //throw an error
        try {
          if (BrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e){
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done(){
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function(){
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"../transport":19,"component-inherit":13,"debug":14,"engine.io-parser":27,"parseqs":37,"ws":undefined,"yeast":45}],25:[function(_dereq_,module,exports){
// browser shim for xmlhttprequest module
var hasCORS = _dereq_('has-cors');

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}

},{"has-cors":31}],26:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],27:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = _dereq_('./keys');
var hasBinary = _dereq_('has-binary');
var sliceBuffer = _dereq_('arraybuffer.slice');
var base64encoder = _dereq_('base64-arraybuffer');
var after = _dereq_('after');
var utf8 = _dereq_('utf8');

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = _dereq_('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!global.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./keys":28,"after":6,"arraybuffer.slice":7,"base64-arraybuffer":9,"blob":10,"has-binary":29,"utf8":44}],28:[function(_dereq_,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],29:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"isarray":33}],30:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && 'function' == typeof obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"isarray":33}],31:[function(_dereq_,module,exports){

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{}],32:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],33:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],34:[function(_dereq_,module,exports){
(function (global){
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],35:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],36:[function(_dereq_,module,exports){
(function (global){
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],37:[function(_dereq_,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],38:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],39:[function(_dereq_,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = _dereq_('isarray');
var isBuf = _dereq_('./is-buffer');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"./is-buffer":41,"isarray":33}],40:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('socket.io-parser');
var json = _dereq_('json3');
var isArray = _dereq_('isarray');
var Emitter = _dereq_('component-emitter');
var binary = _dereq_('./binary');
var isBuf = _dereq_('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    var buf = '';
    while (str.charAt(++i) != '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) != '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i == str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"./binary":39,"./is-buffer":41,"component-emitter":42,"debug":14,"isarray":33,"json3":34}],41:[function(_dereq_,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],42:[function(_dereq_,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],43:[function(_dereq_,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}],44:[function(_dereq_,module,exports){
(function (global){
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],45:[function(_dereq_,module,exports){
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

},{}]},{},[1])(1)
});

'use strict';
angular.module("ngLocale", [], ["$provide", function ($provide) {
  var PLURAL_CATEGORY = {
    ZERO: "zero",
    ONE: "one",
    TWO: "two",
    FEW: "few",
    MANY: "many",
    OTHER: "other"
  };
  $provide.value("$locale", {
    "DATETIME_FORMATS": {
      "AMPMS": [
        "AM",
        "PM"
      ],
      "DAY": [
        "domingo",
        "segunda-feira",
        "ter\u00e7a-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "s\u00e1bado"
      ],
      "ERANAMES": [
        "Antes de Cristo",
        "Ano do Senhor"
      ],
      "ERAS": [
        "a.C.",
        "d.C."
      ],
      "FIRSTDAYOFWEEK": 6,
      "MONTH": [
        "janeiro",
        "fevereiro",
        "mar\u00e7o",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
      ],
      "SHORTDAY": [
        "dom",
        "seg",
        "ter",
        "qua",
        "qui",
        "sex",
        "s\u00e1b"
      ],
      "SHORTMONTH": [
        "jan",
        "fev",
        "mar",
        "abr",
        "mai",
        "jun",
        "jul",
        "ago",
        "set",
        "out",
        "nov",
        "dez"
      ],
      "STANDALONEMONTH": [
        "janeiro",
        "fevereiro",
        "mar\u00e7o",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
      ],
      "WEEKENDRANGE": [
        5,
        6
      ],
      "fullDate": "EEEE, d 'de' MMMM 'de' y",
      "longDate": "d 'de' MMMM 'de' y",
      "medium": "d 'de' MMM 'de' y HH:mm:ss",
      "mediumDate": "d 'de' MMM 'de' y",
      "mediumTime": "HH:mm:ss",
      "short": "dd/MM/yy HH:mm",
      "shortDate": "dd/MM/yy",
      "shortTime": "HH:mm"
    },
    "NUMBER_FORMATS": {
      "CURRENCY_SYM": "R$",
      "DECIMAL_SEP": ",",
      "GROUP_SEP": ".",
      "PATTERNS": [{
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      }, {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }]
    },
    "id": "pt-br",
    "pluralCat": function (n, opt_precision) {
      if (n >= 0 && n <= 2 && n != 2) {
        return PLURAL_CATEGORY.ONE;
      }
      return PLURAL_CATEGORY.OTHER;
    }
  });
}]);
(function () {
    'use strict';
    //! moment.js locale configuration
//! locale : brazilian portuguese (pt-br)
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
    
    var pt_br = window.moment.defineLocale('pt', {
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split(
            '_'),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays: 'Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado'.split('_'),
        weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin: 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
        },
        calendar: {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime: {
            future: 'em %s',
            past: '%s atrás',
            s: 'segs',
            m: 'um minuto',
            mm: '%d minutos',
            h: 'uma hora',
            hh: '%d horas',
            d: 'um dia',
            dd: '%d dias',
            M: 'um mês',
            MM: '%d meses',
            y: 'um ano',
            yy: '%d anos'
        },
        ordinalParse: /\d{1,2}º/,
        ordinal: '%dº'
    });

    return pt_br;
})();
(function () {
    'use strict';
    angular.module('starter').factory('ActionSheet', ActionSheetFactory);

    function ActionSheetFactory($ionicActionSheet, Camera, $cordovaActionSheet, $q) {

        return {
            show : show,
            image: image
        };

        function image() {
            var defer = $q.defer();
            show({
                title     : 'Choose an option',
                cancelText: 'Cancel',
                options   : [{text: 'Photo Library'}, {text: 'Photo'}]
            }).then(function (option) {
                var sourceType;
                if (option === 1) {
                    sourceType = 'photoLibrary';
                }

                if (option === 2) {
                    sourceType = 'camera';
                }
                return Camera.getPicture({sourceType: sourceType});
            }).then(defer.resolve).catch(defer.reject);

            return defer.promise;
        }

        function show(params) {

            var defer = $q.defer();

            if (window.cordova) {

                var options = {
                    title                    : params.title,
                    buttonLabels             : _.map(params.options, function (item) {return item.text}),
                    addCancelButtonWithLabel : params.cancelText,
                    androidEnableCancelButton: true,
                    androidTheme             : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaActionSheet.show(options).then(function (btnIndex) {
                    if (btnIndex !== 3) {
                        defer.resolve(btnIndex);
                    }
                    defer.reject('cancel');
                });

            } else {
                var actionSheet = $ionicActionSheet.show({
                    buttons      : params.options,
                    titleText    : params.title,
                    cancelText   : params.cancelText,
                    cancel       : function () {
                        actionSheet();
                    },
                    buttonClicked: function (btnIndex) {
                        actionSheet();
                        if (btnIndex !== 3) {
                            defer.resolve(btnIndex);
                        }
                        defer.reject('cancel');
                    }
                });

            }
            return defer.promise;
        }
    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('Auth', function ($q) {

        var mSessionToken = null;
        return {
            getLoggedUser  : getLoggedUser,
            setSessionToken: setSessionToken,
            ensureLoggedIn : ensureLoggedIn,
            recoverPassword: recoverPassword,
            resetPassword  : resetPassword,
            logIn          : logIn,
            logOut         : logOut
        };

        function getLoggedUser() {
            return Parse.User.current();
        }

        function setSessionToken(sessionToken) {
            mSessionToken = sessionToken;
        }

        function ensureLoggedIn() {
            var defer = $q.defer();

            if (mSessionToken === null) {
                defer.reject('Session token invalid');
                return defer.promise;
            }

            if (!Parse.User.current()) {
                Parse.User.become(mSessionToken).then(defer.resolve, defer.reject);
            } else {
                defer.resolve(Parse.User.current());
            }

            return defer.promise;
        }

        function recoverPassword(email) {
            var defer = $q.defer();
            Parse.User.requestPasswordReset(email, {
                success: defer.resolve,
                error  : defer.reject
            });

            return defer.promise;
        }

        function resetPassword(email) {

            var defer = $q.defer();

            Parse.User.requestPasswordReset(email, {
                success: defer.resolve,
                error  : defer.reject
            });

            return defer.promise;
        }

        function logIn(obj) {
            var defer = $q.defer();

            Parse.User.logIn(obj.username, obj.password, {
                success: defer.resolve,
                error  : defer.reject
            });

            return defer.promise;
        }

        function logOut() {
            var defer = $q.defer();
            Parse.User.logOut().then(defer.resolve, defer.reject);
            return defer.promise;
        }


    });

})();

(function () {
    'use strict';
    angular.module('starter').service('Camera', CameraFactory);

    function CameraFactory($cordovaCamera, $q) {

        return {
            getPicture   : getPicture,
            resizeImage  : resizeImage,
            toBase64Image: toBase64Image
        };

        function getPicture(params) {

            var defer = $q.defer();
            if (window.cordova) {
                var sourceType = params.sourceType || Camera.PictureSourceType.CAMERA;
                if (params.sourceType === 'photoLibrary') {
                    sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                }
                if (params.sourceType === 'camera') {
                    sourceType = Camera.PictureSourceType.CAMERA;
                }

                var options = {
                    quality           : 70,
                    targetWidth       : 800,
                    targetHeight      : 800,
                    saveToPhotoAlbum  : false,
                    correctOrientation: true,
                    sourceType        : sourceType,
                    destinationType   : Camera.DestinationType.DATA_URL,
                    encodingType      : Camera.EncodingType.JPEG,
                };

                $cordovaCamera.getPicture(options).then(defer.resolve, defer.reject);
            } else {
                console.log('Input File');
                //defer.reject('Unsupported platform');

                var fileInput = angular.element('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
                fileInput[0].click();
                fileInput.on('change', function (evt) {
                    var tempImage = evt.currentTarget.files[0];
                    var reader    = new FileReader();
                    reader.onload = function (evt) {
                        defer.resolve(evt.target.result);
                    };
                    reader.readAsDataURL(tempImage);
                });
            }

            return defer.promise;
        }

        //https://github.com/timkalinowski/PhoneGap-Image-Resizer
        function toBase64Image(img_path, width, height) {
            var defer = $q.defer();
            window.imageResizer.resizeImage(defer.resolve, defer.reject, img_path, width || 1, height || 1, {
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                resizeType   : ImageResizer.RESIZE_TYPE_FACTOR,
                format       : 'jpg'
            });

            return defer.promise;
        }

        function resizeImage(img_path, width, height) {
            var defer = $q.defer();
            window.imageResizer.resizeImage(defer.resolve, defer.reject,  img_path, width || 640, height || 640, {
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                resizeType   : ImageResizer.RESIZE_TYPE_MIN_PIXEL,
                pixelDensity : true,
                storeImage   : false,
                photoAlbum   : false,
                format       : 'jpg'
            });

            return defer.promise;
        }

    }

})();

(function () {
    'use strict';
    angular
        .module('starter')
        .factory('ConnectMonitor', ConnectMonitorFactory);

    function ConnectMonitorFactory($rootScope, $cordovaNetwork) {
        
        return {
            watch: watch
        };

        function watch() {

            if (ionic.Platform.isWebView()) {
                $rootScope.onLine = $cordovaNetwork.isOnline();
                $rootScope.$apply();


                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log('went online');
                    $rootScope.onLine = true;
                    $rootScope.$apply();
                });

                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log('went offline');
                    $rootScope.onLine = false;
                    $rootScope.$apply();
                });
            } else {
                $rootScope.onLine = navigator.onLine;
                $rootScope.$apply();

                window.addEventListener('online', function (e) {
                    console.log('went online');
                    $rootScope.onLine = true;
                    $rootScope.$apply();
                }, false);

                window.addEventListener('offline', function (e) {
                    console.log('went offline');
                    $rootScope.onLine = false;
                    $rootScope.$apply();
                }, false);
            }
        }

    }

})();

(function () {
    'use strict';
    angular
        .module('starter')
        .factory('DAO', DAOFactory);
    function DAOFactory($interval, $q) {
        var _db;
        var _tables = [];

        return {
            init       : init,
            insert     : insert,
            query      : query,
            getLastSync: getLastSync,
            paginate   : paginate,
            fetchAll   : fetchAll
        };

        function init(database) {

            if (!_db) {
                if (window.sqlitePlugin !== undefined) {
                    _db = window.sqlitePlugin.openDatabase({
                        name              : database.name,
                        location          : 2,
                        createFromLocation: 1
                    });
                } else {
                    // For debugging in the browser
                    _db = window.openDatabase(database.name, "1.0", "Database", 200000);
                }
            }

            var _promises = [];
            angular.forEach(database.tables, function (table) {
                var columns = [];
                angular.forEach(table.columns, function (type, name) {
                    columns.push(name + ' ' + type);
                });
                query('DROP TABLE ' + table.name);
                var _query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                _promises.push(query(_query));
                _tables.push(table);
                // console.log(_query);
                // console.log('Table ' + table.name + ' initialized');
            });

            return $q.all(_promises);
        }

        function getLastSync(table, column) {
            var defer = $q.defer();
            query("SELECT MAX(" + column + ") as lastSync FROM " + table)
                .then(function (data) {
                    var lastSync = data.rows.item[0].lastSync;
                    defer.resolve(lastSync);
                });
            return defer.promise;
        }

        function insert(obj) {
            var defer    = $q.defer();
            var _columns = [];
            var _values  = [];

            angular.forEach(obj.columns, function (value, key) {
                _columns.push(key);
                if (typeof  value === 'number') {
                    _values.push(value);
                } else {
                    _values.push("'" + value + "'");
                }
            });

            var _query = "INSERT OR REPLACE INTO " + obj.table + " (" + _columns.join(',') + ") VALUES (" + _values.join(',') + ")"
            // console.info(_query);
            query(_query).then(defer.resolve).catch(defer.reject);
            return defer.promise;

        }

        function query(query, bindings) {
            bindings  = typeof bindings !== 'undefined' ? bindings : [];
            var defer = $q.defer();

            _db.transaction(function (transaction) {
                transaction.executeSql(query, bindings, function (transaction, result) {
                    // console.log(result);
                    var results = {
                        rows: []
                    };
                    if (result && result.rows) {
                        for (var i = 0; i < result.rows.length; i++) {
                            results.rows.push(angular.copy(result.rows[i]));
                        }
                    }
                    // console.log(results);
                    defer.resolve(results);
                }, function (transaction, error) {
                    console.log(transaction, error);
                    defer.reject(error);
                });
            });

            return defer.promise;
        }

        function paginate(_table, columns, _where, _join, _order, limit, page) {
            var defer = $q.defer();
            if (page === undefined) page = -1;
            var _columns = columns;
            var _limit   = limit ? limit : 10;
            var _query1  = "SELECT SUM(id) as TOTAL FROM " + _table + "  " + _where;
            var _query   = "SELECT " + _columns + " FROM " + _table + "  " + _where + " " + _join + " " + _order + " LIMIT " + _limit + " OFFSET " + page;

            console.log('query', _query1);
            console.log('query', _query);

            query(_query1).then(function (data) {
                var result = {
                    page : page,
                    total: data.rows[0].TOTAL,
                    rows : []
                };

                query(_query).then(function (data) {
                    console.log(data);

                    result.rows = data.rows;
                    defer.resolve(result);
                });
            });
            return defer.promise;
        }

        function fetchAll(result) {
            var output = [];
            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('starter')
        .factory('DataUtil', DataUtilFactory);

    function DataUtilFactory() {

        return {
            parseData: parseData,
            parseString: parseString,
            getDate: getDate,
            formatDate: formatDate,
            getMonthName: getMonthName,
            getFirstDay: getFirstDay,
            getLastDay: getLastDay
        };

        function parseData(string) {
            var parts = string.split('-');
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }

        function parseString(data) {
            return new Date(data).toLocaleDateString();
        }


        function getDate() {
            var data   = new Date();
            var inicio = "00";
            var year   = data.getFullYear();
            var month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
            var day    = (inicio + (data.getDate())).slice(-inicio.length);
            return year + '-' + month + '-' + day;
        }

        function formatDate(milliseconds) {
            var data   = new Date(milliseconds);
            var inicio = "00";
            var year   = data.getFullYear();
            var month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
            var day    = (inicio + (data.getDate())).slice(-inicio.length);
            return year + '-' + month + '-' + day;
        }

        function getMonthName(data) {
            var meses = ['Janeiro', 'Feveiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            return meses[data.getMonth()];
        }

        function getFirstDay(data) {
            var year  = data.getFullYear();
            var month = data.getMonth();
            return new Date(year, month, 1);
        }

        function getLastDay(data) {
            var year  = data.getFullYear();
            var month = data.getMonth() + 1;
            return new Date(year, month, 0);
        }


    }

})();

(function () {
    'use strict';
    angular.module('starter').service('Dialog', DialogFactory);

    function DialogFactory($cordovaDialogs, $ionicPopup, $q) {

        return {
            alert  : alert,
            confirm: confirm
        };

        function alert(message, title) {
            var defer = $q.defer();
            if (window.cordova) {
                $cordovaDialogs.alert(message, title).then(defer.resolve);
            } else {
                $ionicPopup.alert({
                    title   : title,
                    template: message
                });
            }
            return defer.promise;
        }

        function confirm(options) {
            var defer = $q.defer();
            if (window.cordova) {
                $cordovaDialogs.confirm(options.message, options.title, options.buttonsText).then(function (result) {
                    console.log(result);
                    if (result === 1) {
                        defer.resolve(true);
                    }
                    defer.reject(true);
                });

            } else {
                $ionicPopup.confirm({
                    title   : options.title,
                    template: options.message
                }).then(function (res) {
                    if (res) {
                        defer.resolve(true);
                    } else {
                        defer.reject(true);
                    }
                });
            }
            return defer.promise;
        }
    }

})();

(function () {
    'use strict';

    angular.module('starter').service('Facebook', FacebookFactory);

    function FacebookFactory($q, $facebook, $cordovaFacebook) {

        var facebook = window.cordova ? $cordovaFacebook : $facebook;
        var me;

        return {
            logIn         : logIn,
            logOut        : logOut,
            me            : getMe,
            invite        : invite,
            friends       : friends,
            api           : api,
            getCurrentUser: getCurrentUser,
            getFriends    : getFriends,
            postImage     : postImage,
            postImage1    : postImage1,
            link          : link
        };

        function getCurrentUser() {
            return facebook.getLoginStatus();
        }

        function logIn() {
            console.log('facebook login', facebook);
            return facebook.login(['public_profile', 'email']);
        }

        function logOut() {
            var defer = $q.defer();
            $cordovaFacebook.logout().then(defer.resolve, defer.reject);
            return defer.promise;
        }

        function postImage(image) {
            var defer = $q.defer();
            var item  = {
                method     : 'feed',
                name       : image.title,
                link       : 'https://photogram.codevibe.io/',
                picture    : image.image._url,
                caption    : image.title,
                description: image.title,
                message    : ''
            };

            console.log(item);
            facebook.ui(item, defer.resolve);
            return defer.promise;
        }

        function postImage1(image) {
            var defer = $q.defer();
            facebook.api('/me/feed', 'post', {
                message  : image.title,
                link     : image.image._url,
                picture  : image.image._url,
                published: true
            }, defer.resolve);
            return defer.promise;
        }

        function getFriends() {
            var defer = $q.defer();
            facebook.api('/me/friends', defer.resolve)
            return defer.promise;
        }

        function getMe() {

            var defer = $q.defer();
            if (window.cordova) {

                $cordovaFacebook
                    .api('me?fields=name,first_name,last_name,gender,email', ['public_profile'])
                    .then(defer.resolve, defer.reject);

            } else {
                facebook.api('/me', {fields: 'name, first_name, last_name, gender, email'}).then(function (response) {
                    if (!response || response.error) {
                        defer.reject(response.error);
                    } else {
                        defer.resolve(response);
                    }
                });
            }

            return defer.promise;
        }

        function invite() {
            var defer = $q.defer();
            if (window.cordova) {
                facebook.showDialog({
                    method : 'apprequests',
                    message: 'Venha para o nosso clube!'
                }).then(defer.resolve, defer.reject);
            } else {
                facebook.ui({
                    method : 'apprequests',
                    message: 'Venha para o nosso clube!'
                }).then(defer.resolve, defer.reject);
            }
            return defer.promise;
        }


        function friends() {
            var defer = $q.defer();
            facebook.api('me/friends').then(defer.resolve, defer.reject);
            return defer.promise;
        }

        function api(api) {
            var defer = $q.defer();
            facebook.api(api).then(defer.resolve, defer.reject);
            return defer.promise;
        }

        function link(user) {
            var defer = $q.defer();
            if (user) {
                facebook.login(['email']).then(function (response) {
                    console.log('facebook login', response);
                    console.log(user, response, data);

                    Parse.FacebookUtils.link(user, {
                        id             : String(response.authResponse.userID),
                        access_token   : response.authResponse.accessToken,
                        expiration_date: (new Date().getTime() + 1000).toString()
                    }, {
                        success: function (user) {
                            // Função caso tenha logado tanto no face quanto no Parse
                            console.log('User', user);
                            user.set('facebook', response['authResponse']['userID']);
                            user.set('facebookimg', 'https://graph.facebook.com/' + response['authResponse']['userID'] + '/picture?width=250&height=250');
                            user.set('facebook_complete', Boolean(true));
                            user.save().then(defer.resolve);
                        }
                    });
                }, defer.resolve);
            } else {
                defer.reject('not logged');
            }

            return defer.promise;
        }

    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryActivity', function ($q, ParseCloud, moment) {

        var ParseObject = Parse.Object.extend('GalleryActivity', {
            getStatus: function () {
                if (this.isApproved) {
                    return 'Approved';
                } else if (this.isApproved === false) {
                    return 'Rejected';
                } else {
                    return 'Pending';
                }
            }
        }, {
            update : function (item) {
                var defer = $q.defer();
                item.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            destroy: function (item) {
                var defer = $q.defer();
                item.destroy({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            feed   : function (params) {
                return ParseCloud.run('feedActivity', params);
            },
            all    : function (params) {
                var defer = $q.defer();
                var query = new Parse.Query(this);

                if (params.filter != '') {
                    query.contains('words', params.filter);
                }

                // Order Table
                if (params.order) {
                    if (params.order.indexOf('-') < -1) {
                        query.ascending(params.order);
                    } else {
                        query.descending(params.order.replace('-'));
                    }
                }

                if (params.date && params.date !== null) {
                    var start = moment(params.date).startOf('day');
                    var end   = moment(params.date).endOf('day');
                    query.greaterThanOrEqualTo('createdAt', start.toDate());
                    query.lessThanOrEqualTo('createdAt', end.toDate());
                }

                if (params.status && params.status !== null) {

                    if (params.status === 'pending') {
                        query.doesNotExist('isApproved');
                    } else if (params.status === 'rejected') {
                        query.equalTo('isApproved', false);
                    } else if (params.status === 'approved') {
                        query.equalTo('isApproved', true);
                    }

                }

                query.include('gallery')
                query.include('user')
                query.limit(params.limit);
                query.skip((params.page * params.limit) - params.limit);
                query.find({
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;
            },
            count  : function (params) {
                var defer = $q.defer();
                var query = new Parse.Query(this);

                if (params.filter != '') {
                    query.contains('words', params.filter);
                }


                if (params.date && params.date !== null) {
                    var start = moment(params.date).startOf('day');
                    var end   = moment(params.date).endOf('day');
                    query.greaterThanOrEqualTo('createdAt', start.toDate());
                    query.lessThanOrEqualTo('createdAt', end.toDate());
                }

                if (params.status && params.status !== null) {

                    if (params.status === 'pending') {
                        query.doesNotExist('isApproved');
                    } else if (params.status === 'rejected') {
                        query.equalTo('isApproved', false);
                    } else if (params.status === 'approved') {
                        query.equalTo('isApproved', true);
                    }
                }

                query.count({
                    success: function (count) {
                        defer.resolve(count);
                    },
                    error  : function (error) {
                        defer.reject(error);
                    }
                });

                return defer.promise;
            }
        });

        Object.defineProperty(ParseObject.prototype, 'fromUser', {
            get: function () {
                return this.get('fromUser');
            },
            set: function (value) {
                this.set('fromUser', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'toUser', {
            get: function () {
                return this.get('toUser');
            },
            set: function (value) {
                this.set('toUser', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'gallery', {
            get: function () {
                return this.get('gallery');
            },
            set: function (value) {
                this.set('gallery', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'title', {
            get: function () {
                return this.get('title');
            },
            set: function (value) {
                this.set('title', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'hashtags', {
            get: function () {
                return this.get('hashtags');
            },
            set: function (value) {
                this.set('hashtags', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'words', {
            get: function () {
                return this.get('words');
            },
            set: function (value) {
                this.set('words', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'address', {
            get: function () {
                return this.get('address');
            },
            set: function (value) {
                this.set('address', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'image', {
            get: function () {
                return this.get('image');
            },
            set: function (value) {
                this.set('image', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'imageThumb', {
            get: function () {
                return this.get('imageThumb');
            },
            set: function (value) {
                this.set('imageThumb', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'location', {
            get: function () {
                return this.get('location');
            },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });

        Object.defineProperty(ParseObject.prototype, 'isApproved', {
            get: function () {
                return this.get('isApproved');
            },
            set: function (value) {
                this.set('isApproved', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'expiresAt', {
            get: function () {
                return this.get('expiresAt');
            },
            set: function (value) {
                this.set('expiresAt', value);
            }
        });

        return ParseObject;

    });

})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryAlbum', GalleryFactory);

    function GalleryFactory($q, ParseCloud, moment) {

        var ParseObject = Parse.Object.extend('GalleryAlbum', {
                getStatus: function () {
                    if (this.isApproved) {
                        return 'Approved';
                    } else if (this.isApproved === false) {
                        return 'Rejected';
                    } else {
                        return 'Pending';
                    }
                }
            },
            {
                create : function (item) {
                    var defer       = $q.defer();
                    var parseObject = new ParseObject();
                    parseObject.save(item, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                update : function (item) {
                    var defer = $q.defer();
                    item.save(null, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                destroy: function (item) {
                    var defer = $q.defer();
                    item.destroy({
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                photos : function (params) {
                    return ParseCloud.run('photoAlbum', params);
                },
                list   : function (params) {
                    return ParseCloud.run('listAlbum', params);
                },
                get    : function (objectId) {
                    var defer = $q.defer();
                    new Parse.Query(this)
                        .get(objectId, {
                            success: defer.resolve,
                            error  : defer.reject
                        });

                    return defer.promise;
                },
            });

        Object.defineProperty(ParseObject.prototype, 'title', {
            get: function () {
                return this.get('title');
            },
            set: function (value) {
                this.set('title', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'qtyPhotos', {
            get: function () {
                return this.get('qtyPhotos');
            },
            set: function (value) {
                this.set('qtyPhotos', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'image', {
            get: function () {
                return this.get('image');
            },
            set: function (value) {
                this.set('image', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'imageThumb', {
            get: function () {
                return this.get('imageThumb');
            },
            set: function (value) {
                this.set('imageThumb', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'isApproved', {
            get: function () {
                return this.get('isApproved');
            },
            set: function (value) {
                this.set('isApproved', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'expiresAt', {
            get: function () {
                return this.get('expiresAt');
            },
            set: function (value) {
                this.set('expiresAt', value);
            }
        });

        return ParseObject;

    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryComment', function ($q, moment) {

        var ParseObject = Parse.Object.extend('GalleryComment', {
            getStatus: function () {
                if (this.isApproved) {
                    return 'Approved';
                } else if (this.isApproved === false) {
                    return 'Rejected';
                } else {
                    return 'Pending';
                }
            }
        }, {
            get        : function (itemId) {
                var defer = $q.defer();
                new Parse.Query(this)
                    .get(itemId, {
                        success: defer.resolve,
                        error  : defer.reject
                    });

                return defer.promise;
            },
            create : function (item) {
                var defer = $q.defer();
                new ParseObject().save(item, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            update : function (item) {
                var defer = $q.defer();
                item.save(null, {
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            destroy: function (item) {
                var defer = $q.defer();
                item.destroy({
                    success: defer.resolve,
                    error  : defer.reject
                });
                return defer.promise;
            },
            all    : function (params) {
                var defer = $q.defer();
                var query = new Parse.Query(this);

                // Order Table

                query.include('user');
                query.ascending('createdAt');
                query.equalTo('gallery', params.gallery);
                query.limit(params.limit);
                query.skip((params.page * params.limit) - params.limit);
                query.find({
                    success: defer.resolve,
                    error  : defer.reject
                });

                return defer.promise;
            },
            count  : function (params) {
                var defer = $q.defer();
                var query = new Parse.Query(this);

                if (params.filter != '') {
                    query.contains('words', params.filter);
                }


                if (params.date && params.date !== null) {
                    var start = moment(params.date).startOf('day');
                    var end   = moment(params.date).endOf('day');
                    query.greaterThanOrEqualTo('createdAt', start.toDate());
                    query.lessThanOrEqualTo('createdAt', end.toDate());
                }

                if (params.status && params.status !== null) {

                    if (params.status === 'pending') {
                        query.doesNotExist('isApproved');
                    } else if (params.status === 'rejected') {
                        query.equalTo('isApproved', false);
                    } else if (params.status === 'approved') {
                        query.equalTo('isApproved', true);
                    }
                }

                query.count({
                    success: function (count) {
                        defer.resolve(count);
                    },
                    error  : function (error) {
                        defer.reject(error);
                    }
                });

                return defer.promise;
            }
        });

        Object.defineProperty(ParseObject.prototype, 'user', {
            get: function () {
                return this.get('user');
            },
            set: function (value) {
                this.set('user', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'text', {
            get: function () {
                return this.get('text');
            },
            set: function (value) {
                this.set('text', value);
            }
        });

        return ParseObject;

    });

})();

(function () {
    'use strict';
    angular.module('starter').factory('Gallery', GalleryFactory);

    function GalleryFactory($q, ParseCloud, moment) {

        var ParseObject = Parse.Object.extend('Gallery', {
                getStatus: function () {
                    if (this.isApproved) {
                        return 'Approved';
                    } else if (this.isApproved === false) {
                        return 'Rejected';
                    } else {
                        return 'Pending';
                    }
                }
            },
            {
                create     : function (item) {
                    var defer    = $q.defer();
                    var objPlace = new ParseObject();

                    if (item.address.geo) {
                        item.location = new Parse.GeoPoint(item.address.geo);
                    }

                    objPlace.save(item, {
                        success: defer.resolve,
                        error  : defer.reject
                    });

                    return defer.promise;
                },
                update     : function (item) {
                    var defer = $q.defer();
                    item.save(null, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                destroy    : function (item) {
                    var defer = $q.defer();
                    item.destroy({
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                comments   : function (params) {
                    return ParseCloud.run('commentGallery', params);
                },
                getAlbum   : function (params) {
                    return ParseCloud.run('getAlbum', params);
                },
                feed       : function (params) {
                    console.log('feedGallery', params);
                    return ParseCloud.run('feedGallery', params);
                },
                search     : function (params) {
                    return ParseCloud.run('searchGallery', params);
                },
                follow     : function (params) {
                    console.log('Follow', params);
                    return ParseCloud.run('followUser', params);
                },
                likeGallery: function (params) {
                    console.log(params);
                    return ParseCloud.run('likeGallery', {galleryId: params.galleryId});
                },
                get        : function (galleryId) {
                    var defer = $q.defer();
                    new Parse.Query(this)
                        .get(galleryId, {
                            success: defer.resolve,
                            error  : defer.reject
                        });

                    return defer.promise;
                },
                all        : function (params) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);

                    //if (params.filter != '') {
                    //    query.contains('words', params.filter);
                    //}

                    // Order Table
                    if (params.order) {
                        if (params.order.indexOf('-') < -1) {
                            query.ascending(params.order);
                        } else {
                            query.descending(params.order.replace('-'));
                        }
                    }

                    // Status
                    if (params.status && params.status !== null) {
                        if (params.status === 'pending') {
                            query.doesNotExist('isApproved');
                        } else if (params.status === 'rejected') {
                            query.equalTo('isApproved', false);
                        } else if (params.status === 'approved') {
                            query.equalTo('isApproved', true);
                        }
                    }

                    // Limit by page
                    query.limit(params.limit);

                    // Paginate
                    query.skip((params.page * params.limit) - params.limit);
                    query.find({
                        success: defer.resolve,
                        error  : defer.reject
                    });

                    return defer.promise;
                },
                count      : function (params) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);

                    if (params.filter != '') {
                        query.contains('words', params.filter);
                    }

                    if (params.date && params.date !== null) {
                        var start = moment(params.date).startOf('day');
                        var end   = moment(params.date).endOf('day');
                        query.greaterThanOrEqualTo('createdAt', start.toDate());
                        query.lessThanOrEqualTo('createdAt', end.toDate());
                    }

                    if (params.status && params.status !== null) {

                        if (params.status === 'pending') {
                            query.doesNotExist('isApproved');
                        } else if (params.status === 'rejected') {
                            query.equalTo('isApproved', false);
                        } else if (params.status === 'approved') {
                            query.equalTo('isApproved', true);
                        }
                    }

                    query.count({
                        success: function (count) {
                            defer.resolve(count);
                        },
                        error  : function (error) {
                            defer.reject(error);
                        }
                    });

                    return defer.promise;
                }
            });

        Object.defineProperty(ParseObject.prototype, 'likesTotal', {
            get: function () {
                return this.get('likesTotal');
            },
            set: function (value) {
                this.set('likesTotal', value);
            }
        });
        Object.defineProperty(ParseObject.prototype, 'user', {
            get: function () {
                return this.get('user');
            },
            set: function (value) {
                this.set('user', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'title', {
            get: function () {
                return this.get('title');
            },
            set: function (value) {
                this.set('title', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'hashtags', {
            get: function () {
                return this.get('hashtags');
            },
            set: function (value) {
                this.set('hashtags', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'words', {
            get: function () {
                return this.get('words');
            },
            set: function (value) {
                this.set('words', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'location', {
            get: function () {
                return this.get('location');
            },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });

        Object.defineProperty(ParseObject.prototype, 'address', {
            get: function () {
                return this.get('address');
            },
            set: function (value) {
                this.set('address', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'image', {
            get: function () {
                return this.get('image');
            },
            set: function (value) {
                this.set('image', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'icon', {
            get: function () {
                return this.get('icon');
            },
            set: function (value) {
                this.set('icon', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'imageThumb', {
            get: function () {
                return this.get('imageThumb');
            },
            set: function (value) {
                this.set('imageThumb', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'isApproved', {
            get: function () {
                return this.get('isApproved');
            },
            set: function (value) {
                this.set('isApproved', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'expiresAt', {
            get: function () {
                return this.get('expiresAt');
            },
            set: function (value) {
                this.set('expiresAt', value);
            }
        });

        return ParseObject;

    }

})();

(function () {
  'use strict';
  angular.module('starter').factory('GalleryFeedback', function ($q, moment) {

    var ParseObject = Parse.Object.extend('GalleryFeedback', {
      getStatus: function () {
        if (this.isApproved) {
          return 'Approved';
        } else if (this.isApproved === false) {
          return 'Rejected';
        } else {
          return 'Pending';
        }
      }
    }, {
      create : function (item) {
        var defer    = $q.defer();
        var objPlace = new ParseObject();
        item.user    = Parse.User.current();
        objPlace.save(item, {
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      },
      update : function (item) {
        var defer = $q.defer();
        item.save(null, {
          success: defer.resolve,
          error  : defer.reject
        });
        return defer.promise;
      },
      destroy: function (item) {
        var defer = $q.defer();
        item.destroy({
          success: defer.resolve,
          error  : defer.reject
        });
        return defer.promise;
      },
      all    : function (params) {
        var defer = $q.defer();
        var query = new Parse.Query(this);

        if (params.filter != '') {
          query.contains('words', params.filter);
        }

        if (params.date && params.date !== null) {
          var start = moment(params.date).startOf('day');
          var end   = moment(params.date).endOf('day');
          query.greaterThanOrEqualTo('createdAt', start.toDate());
          query.lessThanOrEqualTo('createdAt', end.toDate());
        }

        if (params.status && params.status !== null) {

          if (params.status === 'pending') {
            query.doesNotExist('isApproved');
          } else if (params.status === 'rejected') {
            query.equalTo('isApproved', false);
          } else if (params.status === 'approved') {
            query.equalTo('isApproved', true);
          }

        }

        query.include('gallery')
        query.include('User')
        query.descending('createdAt');
        query.limit(params.limit);
        query.skip((params.page * params.limit) - params.limit);
        query.find({
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      },
      count  : function (params) {
        var defer = $q.defer();
        var query = new Parse.Query(this);

        if (params.filter != '') {
          query.contains('words', params.filter);
        }

        if (params.date && params.date !== null) {
          var start = moment(params.date).startOf('day');
          var end   = moment(params.date).endOf('day');
          query.greaterThanOrEqualTo('createdAt', start.toDate());
          query.lessThanOrEqualTo('createdAt', end.toDate());
        }

        // Order Table
        if (params.order) {
          if (params.order.indexOf('-') < -1) {
            query.ascending(params.order);
          } else {
            query.descending(params.order.replace('-'));
          }
        }

        if (params.status && params.status !== null) {

          if (params.status === 'pending') {
            query.doesNotExist('isApproved');
          } else if (params.status === 'rejected') {
            query.equalTo('isApproved', false);
          } else if (params.status === 'approved') {
            query.equalTo('isApproved', true);
          }
        }

        query.count({
          success: function (count) {
            defer.resolve(count);
          },
          error  : function (error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      }
    });

    Object.defineProperty(ParseObject.prototype, 'user', {
      get: function () {
        return this.get('user');
      },
      set: function (value) {
        this.set('user', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'subject', {
      get: function () {
        return this.get('subject');
      },
      set: function (value) {
        this.set('subject', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'message', {
      get: function () {
        return this.get('title');
      },
      set: function (value) {
        this.set('title', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'hashtags', {
      get: function () {
        return this.get('hashtags');
      },
      set: function (value) {
        this.set('hashtags', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'words', {
      get: function () {
        return this.get('words');
      },
      set: function (value) {
        this.set('words', value);
      }
    });


    Object.defineProperty(ParseObject.prototype, 'isApproved', {
      get: function () {
        return this.get('isApproved');
      },
      set: function (value) {
        this.set('isApproved', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'expiresAt', {
      get: function () {
        return this.get('expiresAt');
      },
      set: function (value) {
        this.set('expiresAt', value);
      }
    });

    return ParseObject;

  });

})();

(function () {
  'use strict';
  angular.module('starter').factory('GallerySetting', function ($q, moment) {

    var ParseObject = Parse.Object.extend('GallerySetting', {
      getStatus: function () {
        if (moment().toDate() >= this.expiresAt) {
          return 'Expired';
        }
        else if (this.isApproved) {
          return 'Approved';
        } else if (this.isApproved === false) {
          return 'Rejected';
        } else {
          return 'Pending';
        }
      }
    }, {
      create : function (item) {
        var defer    = $q.defer();
        var objPlace = new ParseObject();

        objPlace.save(item, {
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      },
      update : function (item) {
        var defer = $q.defer();
        item.save(null, {
          success: defer.resolve,
          error  : defer.reject
        });
        return defer.promise;
      },
      destroy: function (item) {
        var defer = $q.defer();
        item.destroy({
          success: defer.resolve,
          error  : defer.reject
        });
        return defer.promise;
      },
      all    : function (params) {
        var defer = $q.defer();
        var query = new Parse.Query(this);

        if (params.filter != '') {
          query.contains('canonical', params.filter);
        }

        query.descending('createdAt');
        query.limit(params.limit);
        query.skip((params.page * params.limit) - params.limit);
        query.find({
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      },
      count  : function (params) {
        var defer = $q.defer();
        var query = new Parse.Query(this);

        query.count({
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      }

    });

    Object.defineProperty(ParseObject.prototype, 'key', {
      get: function () {
        return this.get('key');
      },
      set: function (value) {
        this.set('key', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'value', {
      get: function () {
        return this.get('value');
      },
      set: function (value) {
        this.set('value', value);
      }
    });

    return ParseObject;

  });

})();

(function () {
    'use strict';
    angular.module('starter').factory('Geolocation', GeolocationFactory);

    function GeolocationFactory($ionicPlatform, $q) {
        return {
            getCurrentPosition: getCurrentPosition
        };

        function getCurrentPosition($cordovaGeolocation) {
            var defer = $q.defer();

            $ionicPlatform.ready(function () {
                var options = {
                    maximumAge        : 3000,
                    timeout           : 1000,
                    enableHighAccuracy: true
                };

                var options = {timeout: 10000, enableHighAccuracy: true};

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            // Get current cordinates.
                            console.log(position);
                            defer.resolve(position);
                        },
                        function(error) {
                            defer.reject(error);
                        },
                        {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
                    );
                }
                
                //$cordovaGeolocation.getCurrentPosition(options).then(defer.resolve).catch(defer.reject);

                //navigator.geolocation.getCurrentPosition(
                //    defer.resolve,
                //    defer.reject,
                //    options);
            });

            return defer.promise;
        }
    }

})();
(function () {
  'use strict';
  angular.module('starter').factory('GoogleAnalytics', GoogleAnalyticsFactory);

  function GoogleAnalyticsFactory($cordovaGoogleAnalytics) {
    var TAG      = 'AnalyticsService';
    var canTrack = false;
    return {
      init          : init,
      trackView     : trackView,
      trackEvent    : trackEvent,
      trackException: trackException
    };

    function init(trackingId) {
      if (trackingId !== null && trackingId !== '' && window.cordova) {
        $cordovaGoogleAnalytics.debugMode();
        $cordovaGoogleAnalytics.startTrackerWithId(trackingId);
        canTrack = true;
      } else {
        console.warn('[' + TAG + ']: Invalid Tracker ID or not using emulator');
      }
    }

    function trackEvent(category, action, label) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackEvent(category, action, label);
      }
    }

    function trackView(viewName) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackView(viewName);
      }
    }

    function trackException(description, isFatal) {
      if (canTrack) {
        $cordovaGoogleAnalytics.trackException(description, isFatal)
      }
    }
  }

})();

(function () {
    'use strict';
    angular.module('starter').factory('Install', InstallFactory);

    function InstallFactory(ParseCloud) {
        return {
            start : start,
            status: status,
        };

        function start(data) {
            return ParseCloud.run('install', data);
        }

        function status(data) {
            return ParseCloud.run('status', data);
        }
    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('ParseCloud', ParseCloudFactory);

    function ParseCloudFactory($q) {
        return {
            run: run
        };

        function run(action, data) {
            var defer = $q.defer();
            Parse.Cloud.run(action, data, {
                success: defer.resolve,
                error  : defer.reject
            });
            return defer.promise;
        }
    }

})();

(function () {
  'use strict';
  angular.module('starter').factory('ParseFile', function ($q) {
    return {
      upload: upload
    };

    function upload(file, ext) {
      var defer = $q.defer();
      var filename = 'file.jpg';

      if (ext) {
        filename.replace('.jpg', ext);
      }
      
      new Parse.File(filename, file)
        .save({
          success: defer.resolve,
          error  : defer.reject
        });
      return defer.promise;
    }
  });

})();

(function () {
    'use strict';
    angular.module('starter').factory('ParsePush', ParsePushFactory);

    function ParsePushFactory($q) {

        return {
            init            : init,
            on              : on,
            subscribe       : subscribe,
            getSubscriptions: getSubscriptions,
            unsubscribe     : unsubscribe,
            subscribeUser   : subscribeUser,
        };


        function init() {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.getInstallationId(function (id) {
                    console.log("device installationId: " + id);
                    subscribeUser();
                    defer.resolve(id);
                }, function (e) {
                    console.log('error', e);
                    defer.reject(e);
                });
            } else {
                defer.reject('Not Parse Push');
            }
            return defer.promise;
        }

        function getSubscriptions() {
            var defer = $q.defer();
            ParsePushPlugin.getSubscriptions(function (subscriptions) {
                console.log(subscriptions);
                defer.resolve(subscriptions);
            }, function (e) {
                console.log('error', e);
                defer.reject(e);
            });
            return defer.promise;
        }


        function subscribeUser() {
            var defer = $q.defer();
            var user  = Parse.User.current();

            if (window.ParsePushPlugin && user) {
                subscribe(user.username);
            } else {
                defer.reject('Not device');
            }
            return defer.promise;
        }

        function on(event, callback) {
            if (window.ParsePushPlugin) {
                ParsePushPlugin.on(event, callback);
            }
        }

        function subscribe(channel) {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.subscribe(channel, function (resp) {
                    console.log('Subcribe in channel', channel);
                    defer.resolve(resp);
                }, function (err) {
                    console.log('Not Subcribe in channel', channel);
                    defer.reject(err);
                });
            }
            return defer.promise;
        }

        function unsubscribe(channel) {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.unsubscribe(channel, function (resp) {
                    console.log('Unsubcribe in channel', channel);
                    defer.resolve(resp);
                }, function (err) {
                    console.log('Not Unsubcribe in channel', channel);
                    defer.reject(err);
                });
            }
            return defer.promise;
        }
    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('Share', PhotogramShareFactory);

    function PhotogramShareFactory(AppConfig, $q, $translate, $window) {

        var options = {
            title  : $translate.instant('Join me from ') + AppConfig.app.name + '!',
            subject: $translate.instant("I'm at ") + AppConfig.app.name + '!. ' + (
                'Install the application and follow me!') + ' ' + AppConfig.app.url,
            image  : AppConfig.app.image,
            link   : AppConfig.app.url
        };

        return {
            open: open
        };

        function open(image, title) {
            var defer = $q.defer();

            if (image) {
                options.image = image;
            }

            if (title) {
                options.title = title;
            }

            $window.plugins.socialsharing.shareWithOptions(options, defer.success, defer.reject);

            return defer.promise;
        }

    }
})();

(function () {
  'use strict';

  angular.module('starter').factory('Toast', ToastFactory);

  function ToastFactory($cordovaToast, $ionicPopup) {

    return {
      alert  : alert,
      confirm: confirm
    };

    function alert(params) {
      if (window.cordova) {
        $cordovaToast.show(params.text, 'short', 'bottom');
      } else {
        $ionicPopup.alert({
          title   : params.title,
          template: params.text,
          okType  : 'button button-clear button-assertive',
        });
      }
    }

    function confirm(title, msg) {
      return $ionicPopup.confirm({
        title   : title,
        template: msg
      });
    }
  }


})();

(function () {
    'use strict';
    angular.module('starter').factory('User', UserFactory);

    function UserFactory($q, $translate, $cordovaDevice, ParseCloud, ParsePush) {

        var User = Parse.User.extend({}, {
            profile               : function (username) {
                return ParseCloud.run('profile', {username: username})
            },
            list                  : function (params) {
                return ParseCloud.run('listUsers', params)
            },
            getFollowers          : function (username) {
                return ParseCloud.run('getFollowers', {username: username})
            },
            getLikers             : function (galleryId) {
                return ParseCloud.run('getLikers', {galleryId: galleryId})
            },
            getFollowing          : function (username) {
                return ParseCloud.run('getFollowing', {username: username})
            },
            signIn                : function (obj) {
                var defer = $q.defer();

                Parse.User.logIn(obj.username, obj.password, {
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
                            updateUser = {
                                device  : {device: window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./)[0]},
                                cordova : '',
                                model   : window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./)[0],
                                platform: window.navigator.platform,
                                uuid    : '',
                                version : window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./)[1]
                            };
                        }

                        // Save
                        updateUser.lang = $translate.use();

                        // Parse Push
                        ParsePush.init();

                        User.update(updateUser).then(function () {
                            defer.resolve(currentUser);
                        }).catch(defer.reject);

                        //user.save(defer.resolve, defer.reject);
                    },
                    error  : defer.reject
                });

                return defer.promise;
            },
            signUp                : function (data) {
                var user = new Parse.User()
                    .set({'name': data.name})
                    .set({'username': data.username})
                    .set({'email': data.email})
                    .set({'password': data.password})
                    .set({'roleName': 'User'});

                var acl = new Parse.ACL();
                acl.setPublicReadAccess(false);
                acl.setPublicWriteAccess(false);
                user.setACL(acl);
                return user.save(null);

            },
            signInViaFacebook     : function (authData) {
                //var expiration = new Date();

                var facebookAuthData = {
                    id             : authData.authResponse.userID,
                    access_token   : authData.authResponse.accessToken,
                    expiration_date: (new Date().getTime() + 1000).toString()
                };

                console.log(authData, facebookAuthData);

                var defer = $q.defer();

                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: function (user) {
                        console.log('User', user);
                        user.setACL(new Parse.ACL(user));
                        user.set('facebook', facebookAuthData.id);
                        user.save(null, {
                            success: function (user) {
                                ParsePush.init();
                                console.log('User', user);
                                defer.resolve(user);
                            },
                            error  : defer.reject
                        });
                    },
                    error  : defer.reject
                });

                return defer.promise;
            },
            logOut                : function () {
                return Parse.User.logOut();
            },
            findByEmail           : function (email) {
                return ParseCloud.run('findUserByEmail', {email: email});
            },
            updateWithFacebookData: function (data) {
                var defer = $q.defer();
                console.log('updateWithFacebookData', data);
                ParseCloud.run('saveFacebookPicture', {}).then(function () {
                    var user = Parse.User.current();

                    if (user.attributes.username === '') {
                        user.set({'username': data.email});
                    }

                    user.set({'email': data.email});
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
                return Parse.User.requestPasswordReset(email);
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
                return ParseCloud.run('followUser', {userId: userId});
            },
            all                   : function (params) {
                return ParseCloud.run('getUsers', params);
            },
            validateUsername      : function (input) {
                return ParseCloud.run('validateUsername', {username: input});
            },
            validateEmail         : function (input) {
                return ParseCloud.run('validateEmail', {email: input});
            },
            update                : function (params) {
                var user = Parse.User.current();
                // User Language
                params.lang = $translate.use();
                
                angular.forEach(params, function (value, key) {
                    user.set(key, value);
                });
                return user.save();
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

(function (window, angular, cordova, ionic, undefined) {
    'use strict';
    var default_config = {
        color: '#1D5ECE',
        bgcolor: '#eaeaea',
        semi: false,
        rounded: false,
        clockwise: true,
        radius: '15',
        stroke: '5',
        max: 100,
        iterations: 50,
        animation: 'easeOutCubic',
        interval: 200,
        showProgressCircleInBrowser: true,
        showProgressCircleInDevice: true
    };

    angular
        .module('ionic-cache-src', [
            'ionic',
            'angular-svg-round-progressbar',
            'ngCordova',
            'ngStorage'
        ])
        .provider('$cacheSrc', function () {
            this.config = default_config;
            this.set = function (obj, val) {
                var t = typeof obj;
                if (t == 'object') {
                    angular.extend(this.config, obj);
                } else if (t == 'string') {
                    this.config[obj] = val;
                }
                return this;
            };

            this.$get = function () {
                return this.config;
            };
        })
        .factory('cacheSrcStorage', function ($localStorage) {
            var c = {};
            c._cache = $localStorage.cache_src;
            c.get = function (url) {
                return c._cache[url] && (getCacheDir() + c._cache[url]);
            };
            c.set = function (url, localUrl) {
                c._cache[url] = localUrl;
                return c;
            };
            return c;
        })
        .directive('cacheSrc', function ($ionicPlatform, $interval, $timeout, $compile, $cacheSrc,
                                         $cordovaFileTransfer, $localStorage, $cordovaNetwork) {
            return {
                restrict: 'A',
                scope: {
                    'onProgress': '=?',
                    'onFinish': '=?',
                    'onError': '=?'
                },
                link: function (scope, element, attrs) {

                    function id() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 16; i++)
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        return text;
                    };

                    function makeProgressCircle($scope, $compile) {
                        return angular.element($compile(
                            '<div style="text-align:{{textAlign}}"><div round-progress  max="max"  current="progress"  color="{{color}}" bgcolor="{{bgcolor}}"  radius="{{radius}}"  stroke="{{stroke}}"  rounded="rounded" clockwise="clockwise" iterations="{{iterations}}"  animation="{{animation}}"></div></div>'
                        )($scope));
                    };

                    function startsWith(str, arr) {
                        for (var i = 0; i < arr.length; i++) {
                            var sub_str = arr[i];
                            if (str.indexOf(sub_str) === 0) {
                                return true;
                            }
                        }
                        return false;
                    };


                    function needDownload(path) {
                        if (startsWith(path, [
                                'http://',
                                'https://',
                                'ftp://'
                            ])) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    function attrToScope(scope, attrs) {
                        scope.progress = 0;
                        scope.max = 100;
                        scope.radius = attrs.radius;
                        scope.stroke = attrs.stroke;
                        scope.animation = attrs.animation;
                        scope.clockwise = attrs.clockwise;
                        scope.color = attrs.color;
                        scope.bgcolor = attrs.bgcolor;
                        scope.rounded = attrs.rounded;
                        scope.iterations = attrs.iterations;
                        scope.textAlign = 'center';
                    };

                    var isIOS = ionic.Platform.isIOS();
                    var isAndroid = ionic.Platform.isAndroid();

                    if (cordova & isIOS || isAndroid) {


                        var getCacheDir = function () {
                            switch (device.platform) {
                                case 'iOS':
                                    return cordova.file.documentsDirectory;
                                case 'Android':
                                    return cordova.file.dataDirectory;
                            }
                            return '';
                        };

                        var progress_circle;
                        var display;
                        var config = {};
                        angular.extend(config, $cacheSrc);
                        angular.extend(config, attrs);
                        attrToScope(scope, config);
                        scope.onProgress = scope.onProgress || function () {};
                        scope.onFinish = scope.onFinish || function () {};
                        scope.onError = scope.onError || function () {};
                        var cache = $localStorage.cache_src = $localStorage.cache_src || {};
                        //**********//
                        var finish = function (result) {
                            if (config.showProgressCircleInDevice) {
                                element.css('display', display);
                                progress_circle.remove();
                            }
                            addSrc(result);
                        };

                        var addSrc = function (result) {
                            element[0][config.srcIs || 'src'] = result;
                            scope.onFinish(result);
                        };


                        attrs.$observe('cacheSrc',
                            function () {
                                if (attrs.cacheSrc) {
                                    if (needDownload(attrs.cacheSrc)) {
                                        //if cached
                                        if (cache[attrs.cacheSrc]) {
                                            $ionicPlatform
                                                .ready()
                                                .then(function () {
                                                    addSrc(getCacheDir() + cache[attrs.cacheSrc]);
                                                });
                                        } else {
                                            // not cache
                                            if (config.showProgressCircleInDevice) {
                                                progress_circle = makeProgressCircle(scope, $compile);
                                                display = element.css('display');
                                                element.css('display', 'none');
                                                element.after(progress_circle);
                                            }
                                            $ionicPlatform
                                                .ready()
                                                .then(function () {
                                                    var ext = '.' + attrs.cacheSrc.split('.').pop();
                                                    var fileName = id() + ext;
                                                    $cordovaFileTransfer
                                                        .download(attrs.cacheSrc, getCacheDir() + fileName, {}, true)
                                                        .then(function (result) {
                                                            cache[attrs.cacheSrc] = fileName;
                                                            finish(getCacheDir() + fileName);
                                                        }, scope.onError, function (progress) {
                                                            scope.progress = (progress.loaded / progress.total) * 100;
                                                            scope.onProgress(scope.progress);
                                                        });
                                                });
                                        }
                                    } else {
                                        addSrc(attrs.cacheSrc);
                                    }
                                }
                            });
                    } else {
                        // in browser
                        var progress_circle = makeProgressCircle(scope, $compile);
                        var config = {};
                        angular.extend(config, $cacheSrc);
                        angular.extend(config, attrs);
                        attrToScope(scope, config);
                        scope.onProgress = scope.onProgress || function () {};
                        scope.onFinish = scope.onFinish || function () {};
                        attrs.$observe('cacheSrc', function () {
                            if (attrs.cacheSrc) {
                                if (needDownload(attrs.cacheSrc)) {
                                    if (config.showProgressCircleInBrowser) {
                                        var display = element.css('display');
                                        element.css('display', 'none');
                                        element
                                            .after(progress_circle);
                                    }
                                    var promise = $interval(function () {
                                        scope.progress += 10;
                                        scope.onProgress(scope.progress);
                                        if (scope.progress == 100) {
                                            $interval.cancel(promise);
                                            if (config.showProgressCircleInBrowser) {
                                                element.css('display', display);
                                                progress_circle.remove();
                                            }
                                            element[0][config.srcIs || 'src'] = attrs.cacheSrc;
                                            scope.onFinish(attrs.cacheSrc);
                                        }
                                    }, config.interval);
                                } else {
                                    element[0][config.srcIs || 'src'] = attrs.cacheSrc;
                                    scope.onFinish(attrs.cacheSrc);
                                }
                            }
                        });
                    }

                }
            };
        });

})(window, window.angular, window.cordova, window.ionic);
/* angular-svg-round-progressbar@0.4.6 2016-07-06 */
(function () {
    "use strict";
// shim layer with setTimeout fallback
// credit Erik Möller and http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    (function () {
        var lastTime = 0;
        var vendors  = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame  =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime   = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id         = window.setTimeout(function () { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime       = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                window.clearTimeout(id);
            };
        }
    }());

    angular.module('angular-svg-round-progressbar', []);
    angular.module('angular-svg-round-progressbar').constant('roundProgressConfig', {
        max           : 50,
        semi          : false,
        rounded       : false,
        responsive    : false,
        clockwise     : true,
        radius        : 100,
        color         : '#45ccce',
        bgcolor       : '#eaeaea',
        stroke        : 15,
        duration      : 800,
        animation     : 'easeOutCubic',
        animationDelay: 0,
        offset        : 0
    });

    angular.module('angular-svg-round-progressbar').service('roundProgressService', [
        '$window', function ($window) {
            var service  = {};
            var isNumber = angular.isNumber;
            var base     = document.head.querySelector('base');

            // credits to http://modernizr.com/ for the feature test
            service.isSupported = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect);

            // fixes issues if the document has a <base> element
            service.resolveColor = base && base.href ? function (value) {
                var hashIndex = value.indexOf('#');

                if (hashIndex > -1 && value.indexOf('url') > -1) {
                    return value.slice(0, hashIndex) + window.location.href + value.slice(hashIndex);
                }

                return value;
            } : function (value) {
                return value;
            };

            // deals with floats passed as strings
            service.toNumber = function (value) {
                return isNumber(value) ? value : parseFloat((value + '').replace(',', '.'));
            };

            service.getOffset = function (scope, options) {
                var value = +options.offset || 0;

                if (options.offset === 'inherit') {
                    var parent = scope.$parent;

                    while (parent) {
                        if (parent.hasOwnProperty('$$getRoundProgressOptions')) {
                            var opts = parent.$$getRoundProgressOptions();
                            value += ((+opts.offset || 0) + (+opts.stroke || 0));
                        }

                        parent = parent.$parent;
                    }
                }

                return value;
            };

            service.getTimestamp = ($window.performance && $window.performance.now && angular.isNumber($window.performance.now())) ? function () {
                return $window.performance.now();
            } : function () {
                return new $window.Date().getTime();
            };

            // credit to http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
            service.updateState = function (current, total, pathRadius, element, elementRadius, isSemicircle) {
                if (!elementRadius) return element;

                var value    = current > 0 ? Math.min(current, total) : 0;
                var type     = isSemicircle ? 180 : 359.9999;
                var perc     = total === 0 ? 0 : (value / total) * type;
                var start    = polarToCartesian(elementRadius, elementRadius, pathRadius, perc);
                var end      = polarToCartesian(elementRadius, elementRadius, pathRadius, 0);
                var arcSweep = (perc <= 180 ? 0 : 1);
                var d        = 'M ' + start + ' A ' + pathRadius + ' ' + pathRadius + ' 0 ' + arcSweep + ' 0 ' + end;

                return element.attr('d', d);
            };

            // Easing functions by Robert Penner
            // Source: http://www.robertpenner.com/easing/
            // License: http://www.robertpenner.com/easing_terms_of_use.html

            service.animations = {

                // t: is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time.
                // b: is the beginning value of the property.
                // c: is the change between the beginning and destination value of the property.
                // d: is the total time of the tween.
                // jshint eqeqeq: false, -W041: true

                linearEase: function (t, b, c, d) {
                    return c * t / d + b;
                },

                easeInQuad: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },

                easeOutQuad: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },

                easeInOutQuad: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                },

                easeInCubic: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },

                easeOutCubic: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },

                easeInOutCubic: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                },

                easeInQuart: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },

                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },

                easeInOutQuart: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                },

                easeInQuint: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },

                easeOutQuint: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },

                easeInOutQuint: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                },

                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },

                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },

                easeInOutSine: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                },

                easeInExpo: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },

                easeOutExpo: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },

                easeInOutExpo: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },

                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },

                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },

                easeInOutCirc: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                },

                easeInElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * 0.3;
                    if (a < Math.abs(c)) {
                        a = c;
                        s = p / 4;
                    }
                    else s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },

                easeOutElastic: function (t, b, c, d) {
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * 0.3;
                    if (a < Math.abs(c)) {
                        a = c;
                        s = p / 4;
                    }
                    else s = p / (2 * Math.PI) * Math.asin(c / a);
                    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
                },

                easeInOutElastic: function (t, b, c, d) {
                    // jshint eqeqeq: false, -W041: true
                    var s = 1.70158;
                    var p = 0;
                    var a = c;
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (0.3 * 1.5);
                    if (a < Math.abs(c)) {
                        a = c;
                        s = p / 4;
                    }
                    else s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
                },

                easeInBack: function (t, b, c, d, s) {
                    // jshint eqeqeq: false, -W041: true
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },

                easeOutBack: function (t, b, c, d, s) {
                    // jshint eqeqeq: false, -W041: true
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },

                easeInOutBack: function (t, b, c, d, s) {
                    // jshint eqeqeq: false, -W041: true
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                },

                easeInBounce: function (t, b, c, d) {
                    return c - service.animations.easeOutBounce(d - t, 0, c, d) + b;
                },

                easeOutBounce: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                    }
                },

                easeInOutBounce: function (t, b, c, d) {
                    if (t < d / 2) return service.animations.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
                    return service.animations.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
                }
            };

            // utility function
            function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                var x              = centerX + (radius * Math.cos(angleInRadians));
                var y              = centerY + (radius * Math.sin(angleInRadians));

                return x + ' ' + y;
            }

            return service;
        }
    ]);

    angular.module('angular-svg-round-progressbar').directive('roundProgress', [
        '$window', 'roundProgressService', 'roundProgressConfig', function ($window, service, roundProgressConfig) {
            var base = {
                restrict  : 'EA',
                replace   : true,
                transclude: true,
                scope     : {
                    current       : '=',
                    max           : '=',
                    semi          : '=',
                    rounded       : '=',
                    clockwise     : '=',
                    responsive    : '=',
                    onRender      : '=',
                    radius        : '@',
                    color         : '@',
                    bgcolor       : '@',
                    stroke        : '@',
                    duration      : '@',
                    animation     : '@',
                    offset        : '@',
                    animationDelay: '@'
                }
            };

            if (!service.isSupported) {
                return angular.extend(base, {
                    // placeholder element to keep the structure
                    template: '<div class="round-progress" ng-transclude></div>'
                });
            }

            return angular.extend(base, {
                link    : function (scope, element, attrs) {
                    var isNested        = !element.hasClass('round-progress-wrapper');
                    var svg             = isNested ? element : element.find('svg').eq(0);
                    var ring            = svg.find('path').eq(0);
                    var background      = svg.find('circle').eq(0);
                    var options         = angular.copy(roundProgressConfig);
                    var lastAnimationId = 0;
                    var lastTimeoutId;
                    var parentChangedListener;

                    scope.$$getRoundProgressOptions = function () {
                        return options;
                    };

                    var renderCircle = function () {
                        var isSemicircle   = options.semi;
                        var responsive     = options.responsive;
                        var radius         = +options.radius || 0;
                        var stroke         = +options.stroke;
                        var diameter       = radius * 2;
                        var backgroundSize = radius - (stroke / 2) - service.getOffset(scope, options);

                        svg.css({
                            top     : 0,
                            left    : 0,
                            position: responsive ? 'absolute' : 'static',
                            width   : responsive ? '100%' : (diameter + 'px'),
                            height  : responsive ? '100%' : (isSemicircle ? radius : diameter) + 'px',
                            overflow: 'hidden' // on some browsers the background overflows, if in semicircle mode
                        });

                        // when nested, the element shouldn't define its own viewBox
                        if (!isNested) {
                            // note that we can't use .attr, because if jQuery is loaded,
                            // it lowercases all attributes and viewBox is case-sensitive
                            svg[0].setAttribute('viewBox', '0 0 ' + diameter + ' ' + (isSemicircle ? radius : diameter));
                        }

                        element.css({
                            width        : responsive ? '100%' : 'auto',
                            position     : 'relative',
                            paddingBottom: responsive ? (isSemicircle ? '50%' : '100%') : 0
                        });

                        ring.css({
                            stroke       : service.resolveColor(options.color),
                            strokeWidth  : stroke,
                            strokeLinecap: options.rounded ? 'round' : 'butt'
                        });

                        if (isSemicircle) {
                            ring.attr('transform', options.clockwise ? 'translate(0, ' + diameter + ') rotate(-90)' : 'translate(' + diameter + ', ' + diameter + ') rotate(90) scale(-1, 1)');
                        } else {
                            ring.attr('transform', options.clockwise ? '' : 'scale(-1, 1) translate(' + (-diameter) + ' 0)');
                        }

                        background.attr({
                            cx: radius,
                            cy: radius,
                            r : backgroundSize >= 0 ? backgroundSize : 0
                        }).css({
                            stroke     : service.resolveColor(options.bgcolor),
                            strokeWidth: stroke
                        });
                    };

                    var renderState = function (newValue, oldValue, preventAnimationOverride) {
                        var max           = service.toNumber(options.max || 0);
                        var end           = newValue > 0 ? $window.Math.min(newValue, max) : 0;
                        var start         = (oldValue === end || oldValue < 0) ? 0 : (oldValue || 0); // fixes the initial animation
                        var changeInValue = end - start;

                        var easingAnimation  = service.animations[options.animation];
                        var duration         = +options.duration || 0;
                        var preventAnimation = preventAnimationOverride || (newValue > max && oldValue > max) || (newValue < 0 && oldValue < 0) || duration < 25;

                        var radius       = service.toNumber(options.radius);
                        var circleSize   = radius - (options.stroke / 2) - service.getOffset(scope, options);
                        var isSemicircle = options.semi;

                        svg.attr({
                            'aria-valuemax': max,
                            'aria-valuenow': end
                        });

                        var doAnimation = function () {
                            // stops some expensive animating if the value is above the max or under 0
                            if (preventAnimation) {
                                service.updateState(end, max, circleSize, ring, radius, isSemicircle);

                                if (options.onRender) {
                                    options.onRender(end, options, element);
                                }
                            } else {
                                var startTime = service.getTimestamp();
                                var id        = ++lastAnimationId;

                                $window.requestAnimationFrame(function animation() {
                                    var currentTime = $window.Math.min(service.getTimestamp() - startTime, duration);
                                    var animateTo   = easingAnimation(currentTime, start, changeInValue, duration);

                                    service.updateState(animateTo, max, circleSize, ring, radius, isSemicircle);

                                    if (options.onRender) {
                                        options.onRender(animateTo, options, element);
                                    }

                                    if (id === lastAnimationId && currentTime < duration) {
                                        $window.requestAnimationFrame(animation);
                                    }
                                });
                            }
                        };

                        if (options.animationDelay > 0) {
                            $window.clearTimeout(lastTimeoutId);
                            $window.setTimeout(doAnimation, options.animationDelay);
                        } else {
                            doAnimation();
                        }
                    };

                    var keys = Object.keys(base.scope).filter(function (key) {
                        return optionIsSpecified(key) && key !== 'current';
                    });

                    // properties that are used only for presentation
                    scope.$watchGroup(keys, function (newValue) {
                        for (var i = 0; i < newValue.length; i++) {
                            if (typeof newValue[i] !== 'undefined') {
                                options[keys[i]] = newValue[i];
                            }
                        }

                        renderCircle();
                        scope.$broadcast('$parentOffsetChanged');

                        // it doesn't have to listen for changes on the parent unless it inherits
                        if (options.offset === 'inherit' && !parentChangedListener) {
                            parentChangedListener = scope.$on('$parentOffsetChanged', function () {
                                renderState(scope.current, scope.current, true);
                                renderCircle();
                            });
                        } else if (options.offset !== 'inherit' && parentChangedListener) {
                            parentChangedListener();
                        }
                    });

                    // properties that are used during animation. some of these overlap with
                    // the ones that are used for presentation
                    scope.$watchGroup([
                        'current',
                        'max',
                        'radius',
                        'stroke',
                        'semi',
                        'offset'
                    ].filter(optionIsSpecified), function (newValue, oldValue) {
                        renderState(service.toNumber(newValue[0]), service.toNumber(oldValue[0]));
                    });

                    function optionIsSpecified(name) {
                        return attrs.hasOwnProperty(name);
                    }
                },
                template: function (element) {
                    var parent        = element.parent();
                    var directiveName = 'round-progress';
                    var template      = [
                        '<svg class="' + directiveName + '" xmlns="http://www.w3.org/2000/svg" role="progressbar" aria-valuemin="0">',
                        '<circle fill="none"/>',
                        '<path fill="none"/>',
                        '<g ng-transclude></g>',
                        '</svg>'
                    ];

                    while (
                    parent.length &&
                    parent[0].nodeName.toLowerCase() !== directiveName &&
                    typeof parent.attr(directiveName) === 'undefined'
                        ) {
                        parent = parent.parent();
                    }

                    if (!parent || !parent.length) {
                        template.unshift('<div class="round-progress-wrapper">');
                        template.push('</div>');
                    }

                    return template.join('\n');
                }
            });
        }
    ]);

})();
(function () {
    'use strict';

    var path = 'app/component/ion-language';

    angular
        .module('ion-language')
        .directive('ionLanguage', ionLanguageDirective);

    function ionLanguageDirective(AppConfig, $translate, $timeout, Loading, $ionicModal) {
        return {
            restrict: 'E',
            link: modalLanguageLink,
            templateUrl: path + '/ion-language.html'
        };

        function modalLanguageLink(scope, elem, attr) {


            scope.languages = AppConfig.locales;
            scope.language  = scope.languages.filter(function (item) {
                return item.code === $translate.use()
            })[0];

            console.log(scope.language);

            elem.bind('click', openModal);

            function openModal() {

                if(window.cordova) {
                    window.StatusBar.styleDefault();
                }

                scope.closeModal = function () {
                    scope.modal.hide();
                    // scope.modal.remove();
                    if(window.cordova) {
                        window.StatusBar.styleLightContent();
                    }
                };


                scope.searchValue = '';

                scope.selectLanguage = function (language) {
                    console.log(language);
                    $translate.use(language.code);
                    moment.locale(language.code);
                    scope.language = language;
                    Loading.start();
                    scope.closeModal();
                    $timeout(function () {
                        Loading.end();
                    }, 1000);
                };

                $ionicModal
                    .fromTemplateUrl(path + '/modal-language.html', {
                        scope: scope,
                        focusFirstInput: true
                    })
                    .then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();

                    });
            }
        }
    }

})();

(function () {
    'use strict';


    angular
        .module('ion-location')
        .factory('GeoService', GeoServiceFactory);

    function GeoServiceFactory($http, $window, $cordovaGeolocation, $ionicPopup, $timeout, $q) {

        /**
         'street_address', //indicates a precise street address.
         'route', //indicates a named route (such as "US 101").
         'intersection', //indicates a major intersection, usually of two major roads.
         'political', //indicates a political entity. Usually, this type indicates a polygon of some civil administration.
         'country', //indicates the national political entity, and is typically the highest order type returned by the Geocoder.
         'administrative_area_level_1', //indicates a first-order civil entity below the country level. Within the United States, these administrative levels are states. Not all nations exhibit these administrative levels.
         'administrative_area_level_2', //indicates a second-order civil entity below the country level. Within the United States, these administrative levels are counties. Not all nations exhibit these administrative levels.
         'administrative_area_level_3', //indicates a third-order civil entity below the country level. This type indicates a minor civil division. Not all nations exhibit these administrative levels.
         'colloquial_area', //indicates a commonly-used alternative name for the entity.
         'locality', //indicates an incorporated city or town political entity.
         'sublocality', //indicates an first-order civil entity below a locality
         'neighborhood', //indicates a named neighborhood
         'premise', //indicates a named location, usually a building or collection of buildings with a common name
         'subpremise', //indicates a first-order entity below a named location, usually a singular building within a collection of buildings with a common name
         'postal_code', //indicates a postal code as used to address postal mail within the country.
         'natural_feature', //indicates a prominent natural feature.
         'airport', //indicates an airport.
         'park', //indicates a named park.
         'point_of_interest', //indicates a named point of interest. Typically, these "POI"s are prominent local entities that don't easily fit in another category such as "Empire State Building" or "Statue of Liberty."

         //In addition to the above, address components may exhibit the following types:

         'post_box', //indicates a specific postal box.
         'street_number', //indicates the precise street number.
         'floor indicates', //the floor of a building address.
         'room indicates'; //the room of a building address.'
         */
        var options             = {
            types: ['geocode']
        };
        var autocompleteService = new $window.google.maps.places.AutocompleteService();
        var detailsService      = new $window.google.maps.places.PlacesService($window.document.createElement('input'),
            options);
        var componentForm       = {
            street_number              : 'long_name',
            //number
            route                      : 'long_name',
            //street
            locality                   : 'long_name',
            // district
            sublocality                : 'long_name',
            // district
            neighborhood               : 'long_name',
            //state
            political                  : 'long_name',
            //state
            administrative_area_level_1: 'long_name',
            //state
            country                    : 'long_name',
            //country
            postal_code                : 'long_name' //zipcode
        };
        var componentFormName   = {
            street_number              : 'number',
            //number
            route                      : 'street',
            //street
            locality                   : 'city',
            // district
            administrative_area_level_1: 'state',
            //state
            country                    : 'country',
            //country
            postal_code                : 'zipcode',
            //zipcode
            neighborhood               : 'district' //zipcode
        };

        var data = {
            coords: {},
            src   : ''
        };


        return {
            src          : src,
            getDetails   : getDetails,
            searchAddress: searchAddress,
            parseAddress : parseAddress,
            findMe       : findMe
        };

        function getLocation() {
            // Pega a Localização da Pessoa
            var defer = $q.defer();

            if (data.location) {
                $timeout(function () {
                    defer.resolve(data.location);
                }, 1000);
            } else {
                var posOptions = {
                    timeout           : 10000,
                    enableHighAccuracy: false
                };
                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    // console.log('Fez a requisição', position);
                    data.location = {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    defer.resolve(data.location);
                }, function (err) {
                    // error
                    // console.log('Error na geolocalização', err);
                    $ionicPopup.alert({
                        title   : 'Geo Error',
                        template: err.message
                    });
                    defer.reject(err);
                });
            }


            return defer.promise;
        }


        function findMe() {
            var defer = $q.defer();

            getLocation().then(function (pos) {
                console.log(pos);
                getGoogleAddress(pos.latitude, pos.longitude).success(function (resp) {
                    resp.geolocation = pos;
                    console.log(resp);
                    defer.resolve(resp);
                }).error(logErr);
            });
            return defer.promise;
        }


        function logErr(error) {
            console.log(error);
        }

        function getGoogleAddress(lat, lng) {
            return $http.get('http://maps.google.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true')
                        .success(function (data) {
                            data.address_normal = data.results[0].formatted_address;
                            data.address        = address(data.results[0].address_components);
                            data.src            = imagem(lat, lng, 18, 500, 300);
                        });
        }

        function address(data) {
            if (!data) {
                return false;
            } else {
                return {
                    numero  : data[0].short_name,
                    rua     : data[1].long_name,
                    bairro  : data[2].short_name,
                    cidade  : data[3].short_name,
                    estado  : data[5].long_name,
                    uf      : data[5].short_name,
                    pais    : data[6].long_name,
                    paisCode: data[6].short_name,
                    cep     : data[7].short_name
                };
            }

        }

        function imagem(lat, lng, zoom, w, h) {
            return 'http://maps.google.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom + '&size=' +
                w + 'x' + h + '&maptype=roadmap&sensor=true';
        }

        function parseAddress(place) {
            var defer = $q.defer();
            console.log('parseAddress', place);
            if(!place) {
                defer.reject('not place')
            }
            var address = {
                resume: '',
                geo   : {
                    latitude : place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                }
            };
            var image   = src(address.geo.latitude, address.geo.longitude, 16, 900, 200);

            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    var val                                 = place.address_components[i][componentForm[addressType]];
                    address[componentFormName[addressType]] = val;
                }
            }
            address.name   = place.name;
            address.street = address.street + ', ' + address.number;
            address.image  = image;
            address.resume = address.street + ' - ' + address.city + ', ' + address.state + ', ' + address.country;
            defer.resolve(address);

            return defer.promise;
        }

        function searchAddress(input) {
            var deferred = $q.defer();
            autocompleteService.getQueryPredictions({
                input: input
            }, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function getDetails(placeId) {
            var deferred = $q.defer();
            detailsService.getDetails({
                placeId: placeId
            }, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function src(lat, lng, zoom, w, h) {
            console.log('src latitude', lat, lng, zoom, w, h);

            var link = 'http://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lng + '&zoom=' + zoom +
                '&scale=1&size=' + w + 'x' + h +
                '&maptype=roadmap&format=jpg&visual_refresh=true&markers=size:small%7Ccolor:0xff2600%7Clabel:0%7C' + lat +
                ',' + lng + '&sensor=true';
            console.log(link);
            return link;
        }

    }
})();

(function () {
    'use strict';

    angular.module('ion-location').directive('ionLocation', ionLocationDirective);

    function ionLocationDirective($ionicModal, GeoService) {
        return {
            restrict: 'A',
            scope   : {
                location: '=ngModel'
            },
            link    : ionLocationLink
        };

        function ionLocationLink($scope, element) {


            element.bind('click', function () {
                function init() {
                    $scope.search             = {};
                    $scope.search.suggestions = [];
                    $scope.search.query       = '';
                }


                function selectPlace(place_id) {
                    GeoService.getDetails(place_id).then(function (location) {
                        GeoService.parseAddress(location).then(function (address) {
                            console.log(address);
                            $scope.location = address;
                            $scope.closeModalLocation();
                        })
                    });
                }

                init();

                $scope.findMe = function () {
                    $scope.loading = true;
                    GeoService.findMe().then(function (location) {
                        GeoService.searchAddress(location.address_normal).then(function (result) {
                            console.log(result);
                            $scope.search.suggestions = result;
                            $scope.loading            = false;
                        });
                    });
                };

                $scope.findMe();

                $scope.choosePlace = function (place) {
                    selectPlace(place.place_id);
                }

                $scope.modalLocation = $ionicModal.fromTemplate('<ion-modal-view>' +
                    '<ion-header-bar class="bar bar-light item-input-inset">' +
                    '<ion-spinner ng-if="loading"></ion-spinner>' +
                    '<button class="button button-clear button-icon ion-navigate" ng-click="findMe()" ng-hide="loading"></button>' +
                    '<label class="item-input-wrapper">' +
                    '<input type="search" ng-model="search.query" ng-model-options="{ debounce: 1500 }" placeholder="{{ \'searchText\' | translate }}"></label>' +
                    '<button class="button button-clear" ng-click="closeModalLocation()" translate="cancel"></button>' +
                    '</ion-header-bar>' +
                    '<ion-content padding="false">' +
                    '<ion-list>' +
                    '<div class="center padding" ng-if="loading1"><ion-spinner ></ion-spinner></div>' +
                    '<ion-item ng-repeat="suggestion in search.suggestions" ng-click="choosePlace(suggestion)" ng-bind="suggestion.description"></ion-item>' +
                    '<ion-item class="item-divider"><img src="https://developers.google.com/maps/documentation/places/images/powered-by-google-on-white.png"alt=""/></ion-item>' +
                    '</ion-list>' +
                    '</ion-content>' +
                    '</ion-modal-view>', {
                        scope          : $scope,
                        focusFirstInput: true
                    }
                );

                $scope.modalLocation.show();

                $scope.closeModalLocation = function () {
                    $scope.modalLocation.hide();
                    $scope.modalLocation.remove();
                };

                $scope.$watch('search.query', function (newValue) {
                    if (newValue) {
                        $scope.loading1           = true;
                        $scope.search.suggestions = [];
                        GeoService.searchAddress(newValue).then(function (result) {
                            console.log(result);
                            $scope.search.suggestions = result;
                            $scope.loading1           = false;
                        });
                    }
                });


            });

        }
    }
})();

(function () {

    angular.module('app.main').factory('FeedbackModal', FeedbackModalFactory);

    function FeedbackModalFactory($q, AppConfig, GalleryFeedback, $rootScope, GalleryFeedbackForm, $ionicModal, Loading, Toast) {
        var path = AppConfig.path;

        return {
            modal: modal
        };
        function modal(gallery) {
            var $scope            = $rootScope.$new();
            $scope.formFields     = GalleryFeedbackForm.form;
            $scope.submitFeedback = submitFeedback;
            $scope.closeModal     = closeModal;
            $scope.form           = {
                photogramId: gallery.id,
                subject    : 'complaint'
            };

            function submitFeedback() {
                var dataForm = angular.copy($scope.form);
                Loading.start();
                GalleryFeedback.create(dataForm).then(function (resp) {
                    Loading.end();
                    closeModal();

                });
            }


            function closeModal() {
                $scope.modal.hide();
                $scope.modal.remove();
                delete $scope.modal;
            }

            $ionicModal
                .fromTemplateUrl('app/main/feedback/feedback-modal.html', {
                    scope          : $scope,
                    focusFirstInput: true
                })
                .then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
        }
    }


})();

(function () {
    'use strict';
    angular
        .module('app.main')
        .factory('GalleryFeedbackForm', GalleryFeedbackFormFactory);

    function GalleryFeedbackFormFactory($translate) {

        var form = [{
            key: 'title',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: $translate.instant('feedbackTitle'),
                required: true
            }
        }, {
            key: 'subject',
            type: 'select',
            templateOptions: {
                label: $translate.instant('subject'),
                options: [{
                    'label': $translate.instant('complaint'),
                    'id': 'complaint',
                }, {
                    'label': $translate.instant('bug'),
                    'id': 'bug',
                }, {
                    'label': $translate.instant('suggestion'),
                    'id': 'suggestion',
                }],
                valueProp: 'id',
                labelProp: 'label',
                icon: 'icon-list',
                iconPlaceholder: true
            }
        }, {
            key: 'status',
            type: 'textarea',
            templateOptions: {
                type: 'text',
                placeholder: $translate.instant('message'),
                icon: 'ion-quote',
                required: true,
                iconPlaceholder: true
            }
        }];

        return {
            form: form
        };
    }


})();

(function () {
    'use strict';

    angular.module('app.main').directive('feedback', feedbackDirective);

    function feedbackDirective($ionicModal, GalleryFeedback, Gallery, Loading, $state) {

        return {
            restrict: 'A',
            scope   : {
                galleryId: '@'
            },
            template: '',
            link    : function (scope, elem, attr) {

                scope.link           = link;
                scope.submitFeedback = submitFeedback;
                scope.closeModal     = closeModal;
                elem.bind('click', openModal);

                function init() {
                    scope.form = {};
                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('app/main/feedback/feedback-modal.html', {
                        scope          : scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });
                }

                function link(sref) {
                    $state.go(sref)
                    scope.closeModal();
                }

                scope.submitFeedback = function (rForm, form) {
                    if (rForm.$valid) {
                        Loading.start();
                        var dataForm  = angular.copy(scope.form);
                        dataForm.user = Parse.User.current();
                        Gallery.get(scope.galleryId).then(function (gallery) {
                            dataForm.gallery = gallery;
                            GalleryFeedback.create(dataForm).then(function (resp) {
                                console.log(resp);
                                init();
                                scope.closeModal();
                                Loading.stop();
                            });
                        })
                    }
                }


                function closeModal() {
                    scope.modal.hide();
                    scope.modal.remove();
                }

            }
        };
    }

})();

(function () {
    'use strict';

    angular.module('starter').controller('GalleryComment', GalleryCommentController);

    function GalleryCommentController($scope, $stateParams, $q, $ionicScrollDelegate, $ionicHistory, Loading, $ionicPopup, User, Dialog, $timeout, Gallery, GalleryComment) {

        $scope.currentUser = Parse.User.current();
        $scope.loading     = true;

        function init() {
            $scope.nocomments = false;
            Gallery.get($stateParams.galleryId).then(function (gallery) {
                $scope.form = {
                    gallery: gallery,
                    text   : ''
                };
            });
        }

        $scope.backButton = function () {
            $ionicHistory.goBack();
        };

        getComments();
        init();

        //Mentios
        // shows the use of dynamic values in mentio-id and mentio-for to link elements
        $scope.myIndexValue = "5";

        $scope.searchPeople = function (term) {
            var peopleList = [];
            return User.getFollowing().then(function (response) {
                _.each(response, function (item) {
                    item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                    item.bio      = item.status;

                    if (item.name) {
                        if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                            peopleList.push(item);
                        }
                    } else {
                        item.name = 'Not name';
                        peopleList.push(item);
                    }
                });
                $scope.people = peopleList;
                console.log(peopleList);
                return $q.when(peopleList);
            });
        };

        $scope.getPeopleTextRaw = function (item) {
            return '@' + item.username;
        };


        $scope.deleteComment = function (item, index) {
            console.log(item);
            Dialog.confirm(('Delete comment'), ('You are sure?')).then(function (resp) {
                if (resp) {
                    GalleryComment.get(item.id).then(function (comment) {
                        GalleryComment.destroy(comment).then(function (resp) {
                            $scope.comments.splice(index, 1);
                        });
                    })
                }
            });
        }

        $scope.editComment = function (obj, index) {
            console.log(obj);
            // An elaborate, custom popup
            $scope.formEdit = {
                id  : obj.id,
                text: obj.text
            };

            $ionicPopup
                .show({
                    template: '<input type="text" ng-model="formEdit.text">',
                    title   : ('Edit comment'),
                    //subTitle: 'Please use normal things',
                    scope   : $scope,
                    buttons : [{
                        text: ('Cancel')
                    }, {
                        text : '<b>OK</b>',
                        type : 'button-positive',
                        onTap: function (e) {
                            console.log($scope.formEdit);
                            if (!$scope.formEdit.text) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.formEdit;
                            }
                        }
                    }]
                })
                .then(function (resp) {
                    console.log(resp);
                    if (resp) {
                        GalleryComment.get(obj.id).then(function (comment) {
                            comment.text                = resp.text;
                            $scope.comments[index].text = resp.text;
                            comment.save();
                        });
                    }
                });
        }

        function getComments() {
            $scope.loading = true;
            Gallery.comments({galleryId: $stateParams.galleryId}).then(function (resp) {
                $scope.comments = [];

                resp.map(function (comment) {
                    console.log(comment);
                    comment.canEdit = (comment.user.obj.id === $scope.currentUser.id) ? true : false;
                    $scope.comments.push(comment);
                });

                $scope.loading = false;
                $ionicScrollDelegate.scrollBottom();
            });
        }

        $scope.submitComment = function (rForm, form) {
            if (rForm.$valid) {
                var dataForm   = angular.copy(form);
                $scope.loading = true;
                GalleryComment.create(dataForm).then(function (resp) {
                    getComments();
                    $scope.form.text = '';
                });
            }
        }


    }

})();

(function () {
    'use strict';

    angular.module('app.main').controller('ProfileCtrl', ProfileController);

    function ProfileController(User, $state, $stateParams) {
        var vm = this;

        vm.loading = true;
        User.profile($stateParams.username).then(function (data) {
            console.log(data);
            console.log(Parse.User.current());
            vm.isMe    = Parse.User.current().id === data.id ? true : false;
            vm.user    = data;
            vm.loading = false;
        });

        vm.openFollowers = function () {
            console.log($state, $stateParams);
            switch ($state.current.name) {
                case 'tab.homeProfile':
                    $state.go('tab.homeProfileFollowers', {username: $stateParams.username});
                    break;
                case 'tab.activityProfile':
                    $state.go('tab.activityProfileFollowers', {username: $stateParams.username});
                    break;
            }
        };

        vm.openFollowing = function () {
            console.log($state, $stateParams);
            switch ($state.current.name) {
                case 'tab.homeProfile':
                    $state.go('tab.homeProfileFollowing', {username: $stateParams.username});
                    break;
                case 'tab.activityProfile':
                    $state.go('tab.activityProfileFollowing', {username: $stateParams.username});
                    break;
            }
        };

        vm.follow = function () {

            vm.loadingFollow = true;


            User.follow(vm.user.obj.id).then(function (resp) {
                console.log('Follow result', resp);
                vm.user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    vm.user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    vm.user.followersTotal -= 1;
                }
                vm.loadingFollow = false;
            });


        }

        init();
        vm.tab = {
            grid : true,
            list : false,
            album: false,
            map  : false
        };

        vm.changeTab = function changeTab(tab) {
            Object.keys(vm.tab).map(function (value) {
                if (value == tab) {
                    vm.tab[value] = true;
                } else {
                    vm.tab[value] = false;
                }
            });
        }


        function init() {
            vm.data  = {
                total    : false,
                galleries: []
            };
            vm.page  = 0;
            vm.empty = false;
            vm.more  = false;
        }


    }


})();

(function () {
    'use strict';

    angular.module('app.main').controller('LoadingCtrl', LoadingController);

    function LoadingController($scope, $rootScope, $ionicPlatform, $cordovaSplashscreen, AppConfig, $state) {
        var user  = $rootScope.currentUser;

        if (user) {
            console.log(user);
            if (user.name) {
                $state.go(AppConfig.routes.home, {
                    clear: true
                });
            } else {
                $state.go('user.avatar', {
                    clear: true
                });
            }
        } else {
            $state.go(AppConfig.routes.login, {
                clear: true
            });
        }

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                }
            });
        });


    }


})();

(function () {
    'use strict';

    angular.module('app.main').controller('ProfilePhotoCtrl', ProfileController);

    function ProfileController($stateParams) {
        var vm       = this;

        vm.id = $stateParams.id;
    }


})();

(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, $ionicHistory, ParsePush, Facebook, $scope, $rootScope, PhotoService, $ionicPlatform, Gallery, ParseFile, Loading) {
        var vm = this;

        // Android Clear
        $ionicHistory.clearHistory();

        $scope.storage = $localStorage;
        function clearBadge() {
            $scope.badge = 0;
        }

        clearBadge();

        $rootScope.$on('activity:clear', function () {
            clearBadge();
        })

        $ionicPlatform.ready(function () {

            ParsePush.init().then(function () {
                ParsePush.on('openPN', function (pn) {
                    console.log('The user opened a notification:' + JSON.stringify(pn));
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (pn) {
                    console.log('yo i got this push notification:' + JSON.stringify(pn));
                    $scope.badge++;
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (message) {
                    console.log('message', message);
                    $scope.$applyAsync();
                });
            })
        });

        vm.postPhoto = function () {
            PhotoService.open().then(PhotoService.modalPost).then(function (form) {
                Loading.start();
                console.log(form);
                ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                    form.image = imageUploaded;
                    Gallery.create(form).then(function (item) {
                        $scope.$emit('photoInclude', item);
                        Loading.end();
                    });
                });
            });
        };

    }
})();

(function () {
    'use strict';

    angular.module('app.main').controller('AccountCtrl', AccountController);

    function AccountController($scope, AppConfig, User, $state, $rootScope) {
        var vm = this;

        vm.user  = $rootScope.currentUser;
        vm.photo = $rootScope.currentUser.attributes.photo;

        vm.loading     = true;
        $scope.buttonTheme = 'button-' + AppConfig.theme;

        User.getPublicData(Parse.User.current()).then(function (user) {
            console.log('Profile', user.attributes);
            vm.user    = user;
            vm.loading = false;
        });

        vm.openFollowers = function () {
            $state.go('tab.accountFollowers', {username: $rootScope.currentUser.attributes.username});
        };

        vm.openFollowing = function () {
            $state.go('tab.accountFollowing', {username: $rootScope.currentUser.attributes.username});
        };

        init();

        vm.tab = {
            grid : true,
            list : false,
            album: false,
            map  : false
        };

        vm.changeTab = function changeTab(tab) {
            Object.keys(vm.tab).map(function (value) {
                if (value == tab) {
                    vm.tab[value] = true;
                } else {
                    vm.tab[value] = false;
                }
            });
        }

        function init() {
            vm.data  = {
                total    : false,
                galleries: []
            };
            vm.page  = 0;
            vm.empty = false;
            vm.more  = false;
            getFollower();
        }

        function getFollower() {
            vm.loadingFollowers = true;
            vm.loadingFollowing = true;
            vm.loadingPhotos    = true;
        }


    }


})();

(function () {
    'use strict';
    angular.module('app.main').controller('ActivityCtrl', ActivityController);

    function ActivityController($scope, $rootScope,$state, GalleryActivity) {
        init();

        $scope.openProfile = function (username) {
            $state.go('tab.activityProfile', {username: username})
        };

        loadFeed();

        $rootScope.$emit('activity:clear', true);

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;
            GalleryActivity.feed($scope.params).then(function (data) {
                console.log(data);
                if (data.length > 0) {
                    $scope.params.page++;
                    data.map(function (item) {
                        $scope.data.push(item);
                    });
                } else {
                    if ($scope.data.length === 0) {
                        $scope.showEmptyView = true;
                    }
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.loading = false;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.$broadcast('scroll.refreshComplete');

            }).catch(function (err) {
                if ($scope.data.length === 0) {
                    $scope.showErrorView = true;
                }
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.onReload = function () {
            init()
            loadFeed();
            $scope.$broadcast('scroll.refreshComplete');
        };

        function init() {
            $scope.params              = {};
            $scope.params.page         = 1;
            $scope.data                = [];
            $scope.moreDataCanBeLoaded = true;
            $scope.loading             = false;

            if ($scope.canEdit) {
                $scope.data.push({
                    create: true
                });
            }
        }

    }

})();

(function () {
    'use strict';

    angular.module('app.main').controller('HomeCtrl', HomeController);

    function HomeController($state, $ionicHistory) {
        var vm = this;

        vm.openProfile = function (username) {
            $state.go('tab.homeProfile', {username: username})
        };

        vm.openLikers = function (galleryId) {
            $state.go('tab.homeGalleryLikers', {galleryId: galleryId})
        };
    }


})();

(function () {
    'use strict';

    angular.module('app.main').controller('SearchCtrl', SearchCtrl);

    function SearchCtrl($scope, $filter, Gallery, $rootScope) {


        $scope.onSearch = function () {
            var text             = $filter('lowercase')($scope.params.search);
            $scope.params.search = text;
            $scope.onReload();
        };

        $scope.params      = {};
        $scope.params.page = 1;
        $scope.params.text = '';
        $scope.data        = [];

        if ($scope.username) {
            $scope.params.username = $scope.username;
        }

        $scope.loading = true;

        loadFeed();

        var isLoadingViewShown   = false;
        var isGalleriesViewShown = false;
        var isErrorViewShown     = false;
        var isEmptyViewShown     = false;

        var isMoreData = false;

        function showLoading() {
            isLoadingViewShown   = true;
            isGalleriesViewShown = false;
            isErrorViewShown     = false;
            isEmptyViewShown     = false;
        }

        function showGalleries() {
            isGalleriesViewShown = true;
            isLoadingViewShown   = false;
            isErrorViewShown     = false;
            isEmptyViewShown     = false;
        }

        function showErrorView() {
            isErrorViewShown     = true;
            isGalleriesViewShown = false;
            isLoadingViewShown   = false;
            isEmptyViewShown     = false;
        }

        function showEmptyView() {
            isEmptyViewShown     = true;
            isErrorViewShown     = false;
            isGalleriesViewShown = false;
            isLoadingViewShown   = false;
        }


        function ensureMoreData(length) {
            isMoreData = false;
            if (length > 0) {
                isMoreData = true;
            }
        }

        function setGalleries(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.data.push(data[i]);
            }
        }

        function setCurrentPage(page) {
            $scope.params.page = page;
        }

        function loadFeed() {

            Gallery.search($scope.params).then(function (data) {
                ensureMoreData(data.length);
                setCurrentPage($scope.params.page + 1);
                setGalleries(data);

                if ($scope.data.length === 0) {
                    showEmptyView();
                } else {
                    showGalleries();
                }

                $scope.loading = false;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.$broadcast('scroll.refreshComplete');

            }).catch(function () {
                if ($scope.data.length === 0) {
                    showErrorView();
                }
                isMoreData = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.moreDataCanBeLoaded = function () {
            return isMoreData;
        };

        $scope.showLoadingView = function () {
            return isLoadingViewShown;
        };

        $scope.showGalleries = function () {
            return isGalleriesViewShown;
        };

        $scope.showErrorView = function () {
            return isErrorViewShown;
        };

        $scope.showEmptyView = function () {
            return isEmptyViewShown;
        };

        $scope.onReload = function () {
            $scope.params.page = 0;
            $scope.data        = [];
            $scope.loading     = true;
            showLoading();
            loadFeed();
            $scope.$broadcast('scroll.refreshComplete');
        };


    }


})();

(function () {
    'use strict';
    angular.module('app.main').controller('SearchMapCtrl', SearchMapController);

    function SearchMapController($scope, $state, $localStorage, Toast, Gallery, Geolocation, Dialog) {

        var markers      = [];
        var latlngbounds = new google.maps.LatLngBounds();
        $scope.maxRating = 5;
        $scope.storage   = $localStorage;
        $scope.galleries = [];
        $scope.params    = {
            location: null,
            distance: 100.00,
            page    : 1,
            limit   : 10
        };
        $scope.loading   = true;
        $scope.map

        function init() {
            $scope.galleries = [];
            removeGallerys();
            removeMarkers();

            var position   = {
                latitude : -18.8800397,
                longitude: -47.05878999999999
            };
            var mapOptions = {
                center   : setPosition(position),
                zoom     : 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        }

        $scope.$on('$ionicView.enter', function (scopes, states) {
            if(!$scope.map) {
                init();
                myPosition();
            }
        });


        function myPosition() {
            Geolocation.getCurrentPosition().then(function (position) {

                console.log(position);

                $scope.params.location = {
                    latitude : position.coords.latitude,
                    longitude: position.coords.longitude
                };

                var marker = {
                    position: setPosition($scope.params.location),
                    title   : 'I am here',
                    id      : 0
                }

                addMarker(marker);

                // Set center locale
                $scope.map.setCenter(setPosition($scope.params.location));

                loadGallerys();
            }, function (error) {
                $scope.params.location = null;

                var errorMessage;
                if (error.code === 1 || error.code === 3) {
                    errorMessage = 'errorGpsDisabledText';
                } else {
                    errorMessage = 'errorLocationMissingText';
                }
                Dialog.alert(errorMessage);

            });
        }

        function setPosition(location) {
            if (location) {
                return new google.maps.LatLng(location.latitude, location.longitude);
            }
        }

        function addMarker(item) {


            var markerOption = {
                id       : item.id,
                map      : $scope.map,
                position : item.position,
                title    : item.title,
                animation: google.maps.Animation.DROP
            };

            if (item.icon) {
                var size          = 40;
                markerOption.icon = {
                    url       : item.icon,
                    size      : new google.maps.Size(size, size),
                    scaledSize: new google.maps.Size(size, size),
                    origin    : new google.maps.Point(0, 0),
                    anchor    : new google.maps.Point(size / 4, size / 4),
                };
            }

            // VariÃ¡vel que define as opÃ§Ãµes do marcador
            var marker = new google.maps.Marker(markerOption);

            // Procedimento que mostra a Info Window atravÃ©s de um click no marcador
            google.maps.event.addListener(marker, 'click', function () {
                // Open Profile
                if(item.username) {
                    $state.go('tab.mapProfile', {username: item.username})
                }

            });

            markers.push(marker);

            new MarkerClusterer($scope.map, markers, {
                imagePath: '../img/m'
            });

            latlngbounds.extend(item.position);
            $scope.map.fitBounds(latlngbounds);
        }

        function setGallerys(galleries) {
            $scope.galleries = galleries;
            galleries.map(function (item) {

                if (item.location) {
                    var marker = {
                        map     : $scope.map,
                        id      : item.id,
                        position: setPosition(item.location),
                        title   : item.title,
                        image   : item.image.url(),
                        icon    : item.imageThumb.url(),
                        username: item.attributes.user.attributes.username
                    };

                    addMarker(marker)
                }
            });


        }

        function loadGallerys() {
            $scope.loading = true;
            Gallery.all($scope.params).then(function (galleries) {

                if (galleries.length > 0) {
                    setGallerys(galleries);
                } else {
                    Dialog.alert('galleriesNotFoundText');
                }

                $scope.loading = false;

            }, function () {
                Toast.show('errorText');
            });
        }

        function removeGallerys() {
            $scope.galleries = [];
        }

        function removeMarkers() {
            markers.map(function (item) {
                item.setMap(null);
            });
            markers = [];
        };

        $scope.onSearchHere = function () {
            $scope.params.location.latitude  = $scope.map.getCenter().lat();
            $scope.params.location.longitude = $scope.map.getCenter().lng();
            removeGallerys();
            removeMarkers();
            loadGallerys();
        }

        $scope.onGalleryClicked = function (item) {
            console.log(item);
        };
    }

})();
(function () {
    'use strict';

    angular.module('app.main').controller('UserAvatarCtrl', UserAvatarController);

    function UserAvatarController(User, $translate, $scope, Loading, Auth, AppConfig, $rootScope, $state, Toast) {

        init();

        $scope.photo = Parse.User.current().attributes.photo;

        function init() {
            var user    = Auth.getLoggedUser();
            $scope.form = {
                name    : user.name,
                email   : user.email,
                status  : user.status,
                gender  : user.gender,
                img     : user.img,
                username: user.username
            };
            console.log($scope.form);
            console.log($scope.formFields);
        }

        $scope.submitAvatar = function (rForm, form) {
            console.log(form);
            Loading.start();

            if (rForm.$valid) {
                var dataForm = angular.copy(form);
                console.log(dataForm);

                User.update(dataForm).then(function (resp) {
                    console.log(resp);
                    $rootScope.currentUser = Parse.User.current();
                    $state.go(AppConfig.routes.home, {
                        clear: true
                    });
                    Loading.end();
                });
            } else {
                Toast.alert({
                    title: $translate.instant('invalidForm'),
                    text : $translate.instant('fillAllFields')
                });
                Loading.end();
            }

        }

    }


})();

(function () {
    'use strict';

    angular.module('app.main').directive('userAvatar', userAvatarDirective);

    function userAvatarDirective(ActionSheet, $rootScope, ParseFile, User) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function ($scope, elem) {

                elem.bind('click', openModal);

                function openModal() {
                    var tempImage;
                    var user        = $scope.ngModel;
                    var currentUser = $rootScope.currentUser;

                    console.log(user);
                    console.log(currentUser);

                    if (user.id != currentUser.id) {
                        return false;
                    }

                    ActionSheet.image().then(function (image) {
                        tempImage = image;
                        //return PhotoFilter.load(image);
                        return image;
                    }).then(function (form) {
                        $scope.loading = true;
                        ParseFile.upload({base64: form}).then(function (imageUploaded) {
                            User.setPhoto(imageUploaded).then(function (user) {
                                $rootScope.currentUser.photo = user.attributes.photo;
                                $scope.loading = false;
                            });
                        });
                    });
                }

            }
        };
    }

})();

(function () {
    'use strict';
    angular.module('starter').controller('UserFollowerCtrl', UserFollowerController);

    function UserFollowerController(User, $scope, $stateParams, $state) {
        var vm     = this;
        vm.loading = true;
        User.getFollowers($stateParams.username).then(function (data) {
            console.log(data);
            vm.users   = data;
            vm.loading = false;
        });

        $scope.clearSearch = function () {
            $scope.searchValue = '';
        }

        vm.openProfile = function (user) {
            console.log('user', user);
            $state.go('tab.homeProfile', {username: user.username})
        };


        vm.follow = function (user) {

            vm.loadingFollow = true;
            User.follow(user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    user.followersTotal -= 1;
                }
                vm.loadingFollow = false;
            });


        }
    }

})();
(function () {
    'use strict';
    angular.module('starter').controller('UserFollowingCtrl', UserFollowingController);

    function UserFollowingController(User, $scope, $stateParams, $state) {
        var vm     = this;
        vm.loading = true;
        User.getFollowing($stateParams.username).then(function (data) {
            console.log(data);
            vm.users   = data;
            vm.loading = false;
        });

        $scope.clearSearch = function () {
            $scope.searchValue = '';
        }

        vm.openProfile = function (user) {
            console.log('user', user);
            $state.go('tab.homeProfile', {username: user.username})
        };


        vm.follow = function (user) {

            vm.loadingFollow = true;
            User.follow(user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    user.followersTotal -= 1;
                }
                vm.loadingFollow = false;
            });


        }
    }

})();
(function () {
    'use strict';
    angular.module('starter').controller('UserIntroCtrl', UserIntroController);

    function UserIntroController($scope, $ionicPlatform, $ionicSlideBoxDelegate, $cordovaSplashscreen) {
        var vm              = this;
        var currentPlatform = window.ionic.Platform.platform();
        vm.slideIndex       = 0;

        vm.slideChanged = function (index) {
            vm.slideIndex = index;
        };
        vm.next         = function () {
            $ionicSlideBoxDelegate.next();
        };
        vm.previous     = function () {
            $ionicSlideBoxDelegate.previous();
        };

        if (currentPlatform) {
            vm.device = (currentPlatform === 'android') ? 'android' : 'iphone';
        } else {
            vm.device = 'android';
        }

        vm.slides                          = [
            {
                text: 'STEP1',
                img : 'img/intro1.png'
            }, {
                text: 'STEP2',
                img : 'img/intro2.png'
            }, {
                text: 'STEP3',
                img : 'img/intro3.png'
            }, {
                text: 'STEP4',
                img : 'img/intro4.png'
            }, {
                text: 'STEP5',
                img : 'img/intro5.png'
            }, {
                text: 'STEP6',
                img : 'img/intro6.png'
            }, {
                text: 'STEP7',
                img : 'img/intro7.png'
            }
        ];
        window.localStorage['walkthrough'] = true;

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                    window.StatusBar.styleLightContent()
                }
            });
        });
    }

})();
(function () {
    'use strict';
    angular.module('starter').controller('UserLikersCtrl', UserLikerController);

    function UserLikerController(User, $scope, $stateParams, $state) {
        var vm     = this;
        vm.loading = true;

        User.getLikers($stateParams.galleryId).then(function (data) {
            console.log(data);
            vm.users   = data;
            vm.loading = false;
        });

        $scope.clearSearch = function () {
            $scope.searchValue = '';
        }

        vm.openProfile = function (user) {
            console.log('user', user);
            $state.go('tab.homeProfile', {username: user.username})
        };


        vm.follow = function (user) {

            vm.loadingFollow = true;
            User.follow(user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    user.followersTotal -= 1;
                }
                vm.loadingFollow = false;
            });


        }
    }

})();
(function () {
    'use strict';
    angular.module('starter').controller('UserListCtrl', UserListController);

    function UserListController(User, $scope, $rootScope, $state) {
        init();
        loadFeed();
        function loadFeed() {

            if ($scope.loading) return;
            $scope.loading = true;

            User.list($scope.params).then(function (data) {
                console.log(data);
                if (data.length > 0) {
                    $scope.params.page++;
                    data.map(function (item) {
                        $scope.data.push(item);
                    });
                } else {
                    if ($scope.data.length === 0) {
                        $scope.showEmptyView = true;
                    }
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.loading = false;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.$broadcast('scroll.refreshComplete');

            }).catch(function (err) {
                if ($scope.data.length === 0) {
                    $scope.showErrorView = true;
                }
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.onReload = function () {
            init()
            loadFeed();
            $scope.$broadcast('scroll.refreshComplete');
        };

        function init() {
            $scope.params              = {};
            $scope.params.page         = 1;
            $scope.data                = [];
            $scope.moreDataCanBeLoaded = true;
            $scope.loading             = false;

            if ($scope.canEdit) {
                $scope.data.push({
                    create: true
                });
            }
        }

        $scope.openProfile = function (user) {
            console.log('user', user);
            $state.go('tab.homeProfile', {username: user.username})
        };


        $scope.follow = function (user) {

            user.loading = true;
            User.follow(user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    user.followersTotal -= 1;
                }
                user.loading = false;
            });


        }
    }

})();
(function () {
    'use strict';

    angular.module('app.main').controller('UserMergeCtrl', UserMergeController);

    function UserMergeController(Auth, $scope, $rootScope, AppConfig, Facebook, $state, Toast) {
        var vm        = this;

        init();
        function init() {
            if ($rootScope.tempUser) {
                $scope.form = {
                    email   : $rootScope.tempUser.attributes.email,
                    username: $rootScope.tempUser.attributes.username,
                    password: ''
                };
            } else {
                $state.go('user.intro', {clear: true});
            }
        }

        $scope.submitMerge = function (rForm, form) {

            console.log(rForm);
            console.table(form);
            if (vm.form.password !== '') {
                console.log(form);
                Auth.logIn(form).then(function (user) {
                    console.log(user);
                    $rootScope.currentUser = user;
                    if (Auth.getLoggedUser()) {
                        Facebook.link(Parse.User.current()).then(function (resp) {
                            console.log(resp);
                            $state.go(AppConfig.routes.home, {
                                clear: true
                            });
                        }).catch(function (resp) {
                            console.log(resp);
                            Toast.alert({
                                title: 'Ops',
                                text : resp.message
                            });
                        });
                    }


                }).catch(function (resp) {
                    Toast.alert({
                        title: 'Ops',
                        text : resp.message
                    });
                });
            } else {
                Toast.alert({
                    title: ('Invalid form'),
                    text : ('Please enter your email')
                });
            }

        };

    }


})();

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name recoveryPass
   *
   * @description
   * _Please update the description and restriction._
   *
   * @restrict E
   * */

  angular
    .module('app.main')
    .directive('recoveryPass', recoveryPassDirective);

  function recoveryPassDirective(User, $ionicPopup, Loading, Toast) {
    return {
      restrict: 'A',
      scope: {
        login: '@',
        register: '@',
      },
      link: function ($scope, elem) {

        elem.bind('click', openModal);

        function openModal() {

          $scope.form = {
            recovery: ''
          };

          $scope.erro = '';

          $scope.text = {
            button: (''),
            input: ('Email')
          };

          $ionicPopup
            .show({
              scope: $scope,
              template: '<div class="popup-recovery"><form name="form.recovery" form-manager><label class="item item-input"><i class="icon ion-email placeholder-icon"></i><input type="email" ng-model="email" id="email" name="email" placeholder="{{ text.input }}" required ng-maxlength="80"></label><span class="error-msg">{{erro}}</span></form></div>',
              title: ('A new password will be sent to your e-mail address'),
              buttons: [{
                text: ('Cancel'),
                type: 'button-calm'
              }, {
                text: ('Send'),
                type: 'button-positive',
                onTap: function (e) {
                  if ($scope.form.recovery.$valid) {
                    return $scope.form.recovery.email.$viewValue;
                  } else {
                    //não permite o usuário fechar até ele digitar o email
                    e.preventDefault();
                    $scope.erro = ('Invalid Email');
                  }
                }
              }]
            })
            .then(function (res) {
              if (!angular.isUndefined(res)) {
                var email = res;

                console.log(res);

                Loading.start();

                User
                  .forgot(email)
                  .then(function (resp) {
                    console.log(resp);
                    Toast.alert({
                      login: ('Forgot your password'),
                      text: ('Access your accout mail')
                    });
                    Loading.end();
                  })
                  .catch(function (resp) {
                    Toast.alert({
                      login: 'Ops',
                      text: resp
                    });
                    Loading.end();
                  });
              }
            });

        }
      }
    };
  }


})();

(function () {
  'use strict';
  /**
   * @ngdoc controller
   * @name UserRecoveryPassCtrl
   *
   * @description
   * _Please update the description and dependencies._
   *
   * @requires $scope
   * */
  angular
    .module('app.main')
    .controller('UserRecoveryPassCtrl', UserRecoveryPassController);

  function UserRecoveryPassController(User, Toast) {
    var vm = this;
    vm.form = {};
    vm.submitForgot = submitForgot;

    function submitForgot() {
      User
        .forgot(vm.form)
        .then(function (resp) {
          console.log(resp);
        })
        .catch(function (resp) {
          Toast.alert('Ops', resp);
        });
    }
  }


})();

(function () {
    'use strict';

    angular.module('ion-photo').directive('ionCrop', ionCropDirective);

    function ionCropDirective($jrCrop, $translate, $ionicActionSheet) {

        return {
            restrict: 'A',
            scope   : {
                ngModel : '=',
                option  : '=',
                cropSave: '&'
            },
            template: '<div><input type="file" id="browseBtn" image="image" accept="image/*" style="display: none"/></div>',
            link    : ionCropLink
        };

        function ionCropLink($scope, element) {

            // Triggered on a button click, or some other target
            $scope.action = action;
            element.bind('click', getElem);
            $scope.crop = crop;
            angular.element(document.getElementById('browseBtn'))
                   .on('change', fileUpload);


            function getElem() {
                document.getElementById('browseBtn')
                        .click();
            }

            function action() {

                // Show the action sheet
                $ionicActionSheet.show({
                    buttons      : [
                        {
                            text: '<i class="icon ion-camera"></i>' + ('Photo Camera')
                        }, {
                            text: '<i class="icon ion-images"></i> ' + ('Photo Album')
                        }
                    ],
                    //destructiveText:  ('Delete'),
                    titleText    : ('Change Image'),
                    cancelText   : ('Cancel'),
                    cancel       : function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {

                        if (index === 0) {
                            console.log('Photo Camera');
                        }
                        // Photo Album
                        if (index === 1) {
                            document.getElementById('browseBtn')
                                    .click();
                        }
                        return true;
                    }
                });

            }

            function fileUpload(e) {

                var file   = e.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = function (event) {
                    var image = event.target.result;
                    $scope.crop(image);
                };

                // Clear input file
                angular.element(document.getElementById('browseBtn')).val('');

            }

            function crop(image) {

                console.log($scope.option);

                $jrCrop
                    .crop({
                        url       : image,
                        width     : $scope.option ? $scope.option.width : 200,
                        height    : $scope.option ? $scope.option.height : 200,
                        cancelText: ('Cancel'),
                        chooseText: ('Save')
                    })
                    .then(function (canvas) {
                        var image = canvas.toDataURL();
                        //            var name = $scope.option ? $scope.option.name : 'thumb';
                        //            var filename = ($scope.option ? $scope.option.name : '') + '_' + name + window.Number(new window.Date() + '.jpg';

                        //var file = base64ToBlob(image.replace('data:image/png;base64,', ''), 'image/jpeg');
                        //            file.name = filename;

                        //upload(file);

                        console.log(image);
                        $scope.ngModel = image;


                    });

            }
        }
    }

})();

(function () {
    'use strict';

    angular.module('ion-photo').directive('sliderFilter', sliderFilterDirective);

    function sliderFilterDirective() {
        return {
            restrict: 'E',
            link    : sliderFilterLink,
            scope   : {
                filter: '='
            },
            template: '<div class="item range range-positive"> ' +
            '<input type="range" name="filter.slider.name" min="-100" max="100" step="1" ng-model="filter.slider.value"  > ' +
            '</div>'
        };

        function sliderFilterLink(scope, elem, attr) {

            console.log(scope.filter);

            scope.$watch('filter.slider.value', function (value) {
                if (value) {
                    scope.filter.slider.value = parseInt(value);
                    scope.filter.setSlider(scope.filter.slider);
                }
            });
        }
    }

})();
(function () {
    'use strict';
    /**
     * jr-crop - A simple ionic plugin to crop your images.
     * @version 1.0.0
     * @link https://github.com/JrSchild/jr-crop
     * @author Joram Ruitenschild
     * @license MIT
     */
    angular.module('jrCrop', [])
           .factory('$jrCrop', function ($ionicModal, $rootScope, $q) {

               var template = '<div class="jr-crop modal">' +
                   '<div class="jr-crop-center-container">' +
                   '<div class="jr-crop-img" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
                   '</div>' +
                   '<div class="jr-crop-center-container">' +
                   '<div class="jr-crop-select" style="overflow: hidden" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
                   '</div>' +
                   '<div class="bar bar-footer bar-dark jr-crop-footer">' +
                   '<button class="button button-clear" ng-click="cancel()">{{cancelText}}</button>' +
                   '<div class="title">{{title}}</div>' +
                   '<button class="button button-clear" ng-click="crop()">{{chooseText}}</button>' +
                   '</div>' +
                   '</div>';

               var jrCropController = ionic.views.View.inherit({

                   promise  : null,
                   imgWidth : null,
                   imgHeight: null,

                   // Elements that hold the cropped version and the full
                   // overlaying image.
                   imgSelect: null,
                   imgFull  : null,

                   // Values exposed by scaling and moving. Needed
                   // to calculate the result of cropped image
                   posX  : 0,
                   posY  : 0,
                   scale : 1,
                   rotate: 0,

                   last_scale : 1,
                   last_posX  : 0,
                   last_posY  : 0,
                   last_rotate: 0,

                   initialize: function (options) {
                       var self = this;

                       self.options = options;
                       self.promise = $q.defer();
                       self.loadImage().then(function (elem) {
                           self.imgWidth  = elem.naturalWidth;
                           self.imgHeight = elem.naturalHeight;

                           self.options.modal.el.querySelector('.jr-crop-img')
                               .appendChild(self.imgSelect = elem.cloneNode());
                           self.options.modal.el.querySelector('.jr-crop-select')
                               .appendChild(self.imgFull = elem.cloneNode());

                           self.bindHandlers();
                           self.initImage();
                       });

                       // options === scope. Expose actions for modal.
                       self.options.cancel = this.cancel.bind(this);
                       self.options.crop   = this.crop.bind(this);
                   },

                   /**
                    * Init the image in a center position
                    */
                   initImage: function () {
                       if (this.options.height < this.imgHeight || this.options.width < this.imgWidth) {
                           var imgAspectRatio    = this.imgWidth / this.imgHeight;
                           var selectAspectRatio = this.options.width / this.options.height;

                           if (selectAspectRatio > imgAspectRatio) {
                               this.scale = this.last_scale = this.options.width / this.imgWidth;
                           } else {
                               this.scale = this.last_scale = this.options.height / this.imgHeight;
                           }
                       }

                       var centerX = (this.imgWidth - this.options.width) / 2;
                       var centerY = (this.imgHeight - this.options.height) / 2;

                       this.posX = this.last_posX = -centerX;
                       this.posY = this.last_posY = -centerY;

                       this.setImageTransform();
                   },

                   cancel: function () {
                       var self = this;

                       self.options.modal.remove().then(function () {
                           self.promise.reject('canceled');
                       });
                   },

                   /**
                    * This is where the magic happens
                    */
                   bindHandlers: function () {
                       var self                                             = this,

                           min_pos_x                                        = 0, min_pos_y = 0,
                           max_pos_x                                        = 0, max_pos_y = 0,
                           transforming_correctX = 0, transforming_correctY = 0,

                           scaleMax                                         = 1, scaleMin,
                           image_ratio                                      = self.imgWidth / self.imgHeight,
                           cropper_ratio                                    = self.options.width / self.options.height;

                       if (cropper_ratio < image_ratio) {
                           scaleMin = self.options.height / self.imgHeight;
                       } else {
                           scaleMin = self.options.width / self.imgWidth;
                       }

                       function setPosWithinBoundaries() {
                           calcMaxPos();
                           if (self.posX > min_pos_x) {
                               self.posX = min_pos_x;
                           }
                           if (self.posX < max_pos_x) {
                               self.posX = max_pos_x;
                           }
                           if (self.posY > min_pos_y) {
                               self.posY = min_pos_y;
                           }
                           if (self.posY < max_pos_y) {
                               self.posY = max_pos_y;
                           }
                       }

                       /**
                        * Calculate the minimum and maximum positions.
                        * This took some headaches to write, good luck
                        * figuring this out.
                        */
                       function calcMaxPos() {
                           // Calculate current proportions of the image.
                           var currWidth  = self.scale * self.imgWidth;
                           var currHeight = self.scale * self.imgHeight;

                           // Images are scaled from the center
                           min_pos_x = (currWidth - self.imgWidth) / 2;
                           min_pos_y = (currHeight - self.imgHeight) / 2;
                           max_pos_x = -(currWidth - min_pos_x - self.options.width);
                           max_pos_y = -(currHeight - min_pos_y - self.options.height);
                       }

                       // Based on: http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js
                       var options = {
                           prevent_default_directions: ['left', 'right', 'up', 'down']
                       };
                       ionic.onGesture('touch transform drag dragstart dragend rotate', function (e) {
                           switch (e.type) {
                               case 'touch':
                                   self.last_scale = self.scale;
                                   break;
                               case 'drag':
                                   self.posX = self.last_posX + e.gesture.deltaX - transforming_correctX;
                                   self.posY = self.last_posY + e.gesture.deltaY - transforming_correctY;
                                   setPosWithinBoundaries();
                                   break;
                               case 'transform':
                                   self.scale = Math.max(scaleMin, Math.min(self.last_scale * e.gesture.scale, scaleMax));
                                   setPosWithinBoundaries();
                                   break;
                               case 'dragend':
                                   self.last_posX = self.posX;
                                   self.last_posY = self.posY;
                                   break;
                               case 'dragstart':
                                   self.last_scale = self.scale;

                                   // After scaling, hammerjs needs time to reset the deltaX and deltaY values,
                                   // when the user drags the image before this is done the image will jump.
                                   // This is an attempt to fix that.
                                   if (e.gesture.deltaX > 1 || e.gesture.deltaX < -1) {
                                       transforming_correctX = e.gesture.deltaX;
                                       transforming_correctY = e.gesture.deltaY;
                                   } else {
                                       transforming_correctX = 0;
                                       transforming_correctY = 0;
                                   }
                                   break;
                               case 'rotate':
                                   self.rotate = self.last_rotate + e.gesture.rotation;
                                   break;
                           }

                           self.setImageTransform();

                       }, self.options.modal.el, options);
                   },

                   setImageTransform: function () {
                       var self = this;

                       var transform =
                               'translate3d(' + self.posX + 'px,' + self.posY + 'px, 0) ' +
                               'scale3d(' + self.scale + ',' + self.scale + ', 1)' +
                               'rotate(' + self.rotate + 'deg)';

                       self.imgSelect.style[ionic.CSS.TRANSFORM] = transform;
                       self.imgFull.style[ionic.CSS.TRANSFORM]   = transform;
                   },

                   /**
                    * Calculate the new image from the values calculated by
                    * user input. Return a canvas-object with the image on it.
                    *
                    * Note: It doesn't actually downsize the image, it only returns
                    * a cropped version. Since there's inconsistenties in image-quality
                    * when downsizing it's up to the developer to implement this. Preferably
                    * on the server.
                    */
                   crop: function () {
                       var canvas  = document.createElement('canvas');
                       var context = canvas.getContext('2d');

                       // Canvas size is original proportions but scaled down.
                       canvas.width  = this.options.width / this.scale;
                       canvas.height = this.options.height / this.scale;

                       // The full proportions
                       var currWidth  = this.imgWidth * this.scale;
                       var currHeight = this.imgHeight * this.scale;

                       // Because the top/left position doesn't take the scale of the image in
                       // we need to correct this value.
                       var correctX = (currWidth - this.imgWidth) / 2;
                       var correctY = (currHeight - this.imgHeight) / 2;

                       var sourceX = (this.posX - correctX) / this.scale;
                       var sourceY = (this.posY - correctY) / this.scale;

                       //see http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
                       //move the origin
                       context.translate(sourceX, sourceY);
                       //move to center and rotate
                       context.translate(this.imgWidth / 2, this.imgHeight / 2);
                       context.rotate(this.rotate * Math.PI / 180);

                       context.drawImage(this.imgFull, this.imgWidth / 2 * -1, this.imgHeight / 2 * -1);

                       this.options.modal.remove();
                       this.promise.resolve(canvas);
                   },

                   /**
                    * Load the image and return the element.
                    * Return Promise that will fail when unable to load image.
                    */
                   loadImage: function () {
                       var promise = $q.defer();

                       // Load the image and resolve with the DOM node when done.
                       angular.element('<img />')
                              .bind('load', function (e) {
                                  promise.resolve(this);
                              })
                              .bind('error', promise.reject)
                              .prop('src', this.options.url);

                       // Return the promise
                       return promise.promise;
                   }
               });

               return {
                   defaultOptions: {
                       width      : 0,
                       height     : 0,
                       aspectRatio: 0,
                       cancelText : 'Cancel',
                       chooseText : 'Choose'
                   },

                   crop: function (options) {
                       options = this.initOptions(options);

                       var scope = $rootScope.$new(true);

                       ionic.extend(scope, options);

                       scope.modal = $ionicModal.fromTemplate(template, {
                           scope: scope
                       });

                       // Show modal and initialize cropper.
                       return scope.modal.show().then(function () {
                           return (new jrCropController(scope)).promise.promise;
                       });
                   },

                   initOptions: function (_options) {
                       var options;

                       // Apply default values to options.
                       options = ionic.extend({}, this.defaultOptions);
                       options = ionic.extend(options, _options);

                       if (options.aspectRatio) {

                           if (!options.width && options.height) {
                               options.width = 200;
                           }

                           if (options.width) {
                               options.height = options.width / options.aspectRatio;
                           } else if (options.height) {
                               options.width = options.height * options.aspectRatio;
                           }
                       }

                       return options;
                   }
               };
           });
})();
(function () {
    'use strict';

    angular.module('ion-photo').factory('PhotoService', PhotoServiceFactory);

    function PhotoServiceFactory($ionicActionSheet, $cordovaCapture, User,  $cordovaCamera, $translate, $cordovaActionSheet, $jrCrop, $rootScope, $ionicModal, ActionSheet, $q) {

        var deviceInformation = ionic.Platform.device();
        var isIOS             = ionic.Platform.isIOS();

        console.log('isIOS', isIOS);

        // Default Setting
        var tempImage;
        var cordova = window.cordova;
        var setting = {
            jrCrop            : false,
            quality           : 90,
            allowEdit         : true,
            filter            : true,
            correctOrientation: true,
            targetWidth       : 640,
            targetHeight      : 640,
            saveToPhotoAlbum  : false,
            allowRotation     : true,
            aspectRatio       : 0
        };


        return {
            open     : openModal,
            crop     : cropModal,
            modalPost: modalPost,
        };

        function openModal(setOptions) {
            var defer = $q.defer();
            console.log(deviceInformation);

            // Change Settings
            if (setOptions) {
                Object.keys(setOptions).map(function (key, index) {
                    setting[key] = setOptions[key];
                });

                console.log(setting);
            }

            var options = {
                quality           : setting.quality,
                aspectRatio       : setting.aspectRatio,
                allowRotation     : setting.allowRotation,
                allowEdit         : setting.allowEdit,
                correctOrientation: setting.correctOrientation,
                targetWidth       : setting.targetWidth,
                targetHeight      : setting.targetHeight,
                saveToPhotoAlbum  : setting.saveToPhotoAlbum,
                destinationType   : window.cordova ? Camera.DestinationType.DATA_URL : null,
                encodingType      : window.cordova ? Camera.EncodingType.JPEG : null,
                popoverOptions    : window.cordova ? CameraPopoverOptions : null,
            };

            image().then(function (index) {
                console.log(index);
                capture(index - 1, options)
                    .then(cropModal)
                    .then(defer.resolve)
                    .catch(function (resp) {
                        console.log(resp);
                    });
            })

            return defer.promise;
        }

        function cropModal(image) {
            var defer = $q.defer();
            if (window.cordova) {
                image = 'data:image/jpeg;base64,' + image;
            }

            if (setting.jrCrop || !window.cordova) {
                $jrCrop.crop({
                    url          : image,
                    aspectRatio  : 1,
                    allowRotation: setting.allowRotation,
                    width        : setting.targetWidth,
                    height       : setting.targetHeight,
                    cancelText   : $translate.instant('cancel'),
                    chooseText   : $translate.instant('submit')
                }).then(function (canvas) {
                    defer.resolve(canvas.toDataURL());
                }).catch(defer.reject);
            } else {
                defer.resolve(image);
            }

            return defer.promise;
        }

        function image() {
            var defer = $q.defer();
            show({
                title     : $translate.instant('choseOption'),
                cancelText: $translate.instant('cancel'),
                options   : [
                    {text: $translate.instant('photo')},
                    {text: $translate.instant('library')}
                ]
            }).then(function (option) {
                defer.resolve(option);
            }).then(defer.resolve).catch(defer.reject);

            return defer.promise;
        }

        function show(params) {
            var defer = $q.defer();

            if (window.cordova) {
                var options = {
                    title                    : params.title,
                    buttonLabels             : _.map(params.options, function (item) {return item.text}),
                    addCancelButtonWithLabel : params.cancelText,
                    androidEnableCancelButton: true,
                    androidTheme             : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaActionSheet.show(options).then(function (btnIndex) {
                    if (btnIndex !== 3) {
                        defer.resolve(btnIndex);
                    }
                    defer.reject('cancel');
                });

            } else {
                var actionSheet = $ionicActionSheet.show({
                    buttons      : params.options,
                    titleText    : params.title,
                    cancelText   : params.cancelText,
                    cancel       : function () {
                        actionSheet();
                    },
                    buttonClicked: function (btnIndex) {
                        actionSheet();
                        if (btnIndex !== 3) {
                            defer.resolve(btnIndex);
                        }
                        defer.reject('cancel');
                    }
                });

            }
            return defer.promise;
        }

        function capture(type, options) {
            var defer = $q.defer();

            // CAMERA
            if (type === 0) {
                getPicture(0);
            }

            // GALLERY
            if (type === 1) {
                getPicture(1);
            }

            // Video
            if (type === 2) {
                getVideo();
            }

            function getPicture(method) {
                if (method === 0 && cordova) options.sourceType = Camera.PictureSourceType.CAMERA;
                if (method === 1 && cordova) options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

                if (cordova) {
                    $cordovaCamera.getPicture(options).then(defer.resolve, defer.reject);
                } else {
                    var fileInput = angular.element('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
                    fileInput[0].click();
                    fileInput.on('change', function (evt) {
                        tempImage     = evt.currentTarget.files[0];
                        var reader    = new FileReader();
                        reader.onload = function (evt) {
                            defer.resolve(evt.target.result);
                        };
                        reader.readAsDataURL(tempImage);
                    });
                }
            }

            function getVideo() {
                $cordovaCapture.captureVideo({
                    limit   : 1,
                    duration: 5
                }).then(function (mediaFiles) {
                    tempImage = mediaFiles[0].fullPath;
                    defer.resolve(tempImage);
                }, defer.reject);
            }

            return defer.promise;
        }

        function modalPost(image) {
            var defer  = $q.defer();
            var $scope = $rootScope.$new();

            $scope.image = image;
            $scope.form  = {
                title        : '',
                facebookShare: true
            };

            //Mentios
            // shows the use of dynamic values in mentio-id and mentio-for to link elements
            $scope.searchPeople = function (term) {
                var peopleList = [];
                return User.getFollowing().then(function (response) {
                    _.each(response, function (item) {
                        item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                        item.bio      = item.status;
                        if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                            peopleList.push(item);
                        }
                    });
                    $scope.people = peopleList;
                    //console.log(peopleList);
                    return $q.when(peopleList);
                });
            };

            $scope.getPeopleTextRaw = function (item) {
                return '@' + item.username;
            };

            $scope.theme = $rootScope.theme;

            $ionicModal.fromTemplateUrl('app/main/share/share-modal.html', {
                scope          : $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.modalFilter = modal;
                $scope.modalFilter.show();
            });


            $scope.form.address = {};
            $scope.closeAddress = function () {
                $scope.form.address = {};
            };

            $scope.close = function () {
                $scope.modalFilter.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            $scope.submit = function (rForm, form) {
                if (rForm.$valid) {
                    var form   = angular.copy($scope.form);
                    form.image = $scope.image;
                    tempImage  = '';
                    $scope.close();
                    defer.resolve(form);
                } else {
                    console.log('Error', rForm);
                }
            };

            return defer.promise;
        }

    }
})();

(function () {
    'use strict';

    angular.module('ion-photo').factory('Video', VideoFactory);

    function VideoFactory($window, $q) {
        var deferred = $q.defer();
        //https://devdactic.com/capture-and-store-videos-ionic/
        // Resolve the URL to the local file
        // Start the copy process
        function createFileEntry(fileURI) {
            $window.resolveLocalFileSystemURL(fileURI, function (entry) {
                return copyFile(entry);
            }, fail);
        }

        // Create a unique name for the videofile
        // Copy the recorded video to the app dir
        function copyFile(fileEntry) {
            var name    = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            $window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                    fileEntry.copyTo(fileSystem2, newName, function (succ) {
                        return onCopySuccess(succ);
                    }, fail);
                },
                fail
            );
        }

        // Called on successful copy process
        // Creates a thumbnail from the movie
        // The name is the moviename but with .png instead of .mov
        function onCopySuccess(entry) {
            var name = entry.nativeURL.slice(0, -4);
            $window.PKVideoThumbnail.createThumbnail(entry.nativeURL, name + '.png', function (prevSucc) {
                return prevImageSuccess(prevSucc);
            }, fail);
        }

        // Called on thumbnail creation success
        // Generates the currect URL to the local moviefile
        // Finally resolves the promies and returns the name
        function prevImageSuccess(succ) {
            var correctUrl = succ.slice(0, -4);
            correctUrl += '.MOV';
            deferred.resolve(correctUrl);
        }

        // Called when anything fails
        // Rejects the promise with an Error
        function fail(error) {
            console.log('FAIL: ' + error.code);
            deferred.reject('ERROR');
        }

        // Function to make a unique filename
        function makeid() {
            var text     = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        // The object and functions returned from the Service
        return {
            // This is the initial function we call from our controller
            // Gets the videoData and calls the first service function
            // with the local URL of the video and returns the promise
            saveVideo: function (data) {
                createFileEntry(data[0].localURL);
                return promise;
            }
        };
    }

})();

;(function() {
"use strict";

angular.module("ionic").run(["$templateCache", function($templateCache) {$templateCache.put("app/directive/SigninModalDirective.html","<ion-modal-view id=\"user-layout\" class=\"modal-auth bg-animate\" cache-view=\"false\"><ion-header-bar><h1 class=\"title\" \ntranslate=\"signin\"></h1><a ng-click=\"closeModal()\" class=\"button button-icon icon ion-ios-close-empty\"></a>\n</ion-header-bar><ion-content class=\"padding\" scroll=\"false\"><div class=\"step2\"><form name=\"myForm\" \nnovalidate=\"novalidate\" ng-submit=\"submitLogin(myForm, form)\"><label class=\"item item-input\"><i \nclass=\"icon icon-user placeholder-icon\"></i> <input required=\"required\" type=\"text\" name=\"username\" \nng-model=\"form.username\" ng-minlength=\"4\" ng-maxlength=\"12\" ng-model-options=\"{debounce: 1000}\" \nng-pattern=\"/^[a-zA-Z\'. -]+$/\" placeholder=\"{{\'yourLogin\' | translate}}\"></label><div ng-if=\"myForm.username.$dirty\">\n<div ng-messages=\"myForm.email.$error\" class=\"validation-error\"><div ng-message=\"required\" \ntranslate=\"usernameRequired\"></div><div ng-message=\"email\" translate=\"usernameInUse\"></div></div><div \nng-messages=\"myForm.email.$pending\" class=\"validation-pending\"><div ng-message=\"email\" translate=\"checkingUsername\">\n</div></div></div><label class=\"item item-input\"><i class=\"icon icon-lock placeholder-icon\"></i> <input required \ntype=\"password\" name=\"password\" ng-model=\"form.password\" placeholder=\"{{\'password\'|translate}}\"></label><button \nclass=\"button button-block button-outline button-light\" type=\"submit\" translate=\"{{\'submit\' | translate}}\"></button>\n</form><span class=\"term\">{{\'termAccept\' | translate}} <a href=\"https://photogramapp.com\">{{\'terms\' | translate}}</a>\n</span></div></ion-content></ion-modal-view>");
$templateCache.put("app/directive/SignupModalDirective.html","<ion-modal-view id=\"user-layout\" class=\"modal-auth bg-animate\" cache-view=\"false\"><ion-header-bar><h1 class=\"title\" \ntranslate=\"register\"></h1><a ng-click=\"closeModal()\" class=\"button button-icon icon ion-ios-close-empty\"></a>\n</ion-header-bar><ion-content class=\"padding\" scroll=\"false\"><div class=\"step2\"><form name=\"myForm\" \nnovalidate=\"novalidate\" ng-submit=\"submitRegister(myForm, form)\"><label class=\"item item-input\"><i \nclass=\"icon icon-envelope placeholder-icon\"></i> <input required=\"required\" type=\"email\" name=\"email\" \nng-model=\"form.email\" email-validator ng-model-options=\"{debounce: 1000}\" placeholder=\"user@example.com\"></label><div \nng-if=\"myForm.email.$dirty\"><div ng-messages=\"myForm.email.$error\" class=\"validation-error\"><div ng-message=\"required\" \ntranslate=\"emailRequired\"></div><div ng-message=\"email\" translate=\"emailInUse\"></div></div><div \nng-messages=\"myForm.email.$pending\" class=\"validation-pending\"><div ng-message=\"email\" translate=\"checkingEmail\"></div>\n</div></div><label class=\"item item-input\"><i class=\"icon icon-user placeholder-icon\"></i> <input required=\"required\" \ntype=\"text\" name=\"username\" ng-model=\"form.username\" username-validator ng-minlength=\"4\" ng-maxlength=\"12\" \nng-model-options=\"{debounce: 1000}\" ng-pattern=\"/^[a-zA-Z\'. -]+$/\" placeholder=\"{{\'yourLogin\' | translate}}\"></label>\n<div ng-if=\"myForm.username.$dirty\"><div ng-messages=\"myForm.email.$error\" class=\"validation-error\"><div \nng-message=\"required\" translate=\"usernameRequired\"></div><div ng-message=\"email\" translate=\"usernameInUse\"></div></div>\n<div ng-messages=\"myForm.email.$pending\" class=\"validation-pending\"><div ng-message=\"email\" \ntranslate=\"checkingUsername\"></div></div></div><label class=\"item item-input\"><i \nclass=\"icon icon-lock placeholder-icon\"></i> <input required type=\"password\" name=\"password\" ng-model=\"form.password\" \nplaceholder=\"{{\'password\'|translate}}\"></label><button class=\"button button-block button-outline button-light\" \ntype=\"submit\" translate=\"{{\'submit\' | translate}}\"></button></form><span class=\"term\">{{\'termAccept\' | translate}} <a \nhref=\"https://photogramapp.com\">{{\'terms\' | translate}}</a></span></div></ion-content></ion-modal-view>");
$templateCache.put("app/directive/albumGridDirective.html","<div class=\"center padding\" ng-if=\"showErrorView\"><div class=\"error\"><i \nclass=\"icon icon-large ion-ios-cloud-download-outline\"></i><p>{{ \"errorText\" | translate }}</p><button \nclass=\"button button-primary\" ng-click=\"onReload()\">{{ \"tryAgainText\" | translate }}</button></div></div><div \nclass=\"center padding\" ng-if=\"showEmptyView\"><div class=\"error\"><i class=\"icon icon-large ion-android-alert\"></i><p>\n{{ \"galleriesNotFoundText\" | translate }}</p></div></div><div class=\"row\" ng-if=\"$index % 2 === 0\" \nng-repeat=\"image in data | orderBy:\'createdAt\':true\"><div class=\"col col-50 newAlbum\" \nng-if=\"$index < data.length && data[$index].create\" gallery-new-album-modal ng-model=\"ngModel\"><div class=\"desc\"><i \nclass=\"icon ion-ios-plus-empty\"></i><h2 translate=\"createAlbum\"></h2></div></div><div class=\"col col-50\" \nng-if=\"$index < data.length && !data[$index].create\" album-photo-grid album=\"data[$index].id\" edit=\"canEdit\"><img \nng-src=\"{{ ::data[$index].imageThumb._url || \'img/albumnone.png\'}}\" width=\"100%\"><div class=\"desc\"><h2>\n{{::data[$index].title}}</h2><p>{{::data[$index].qtyPhotos}} photos</p></div></div><div class=\"col col-50\" \nng-if=\"$index + 1 < data.length\" album-photo-grid album=\"data[$index+1].id\" edit=\"canEdit\"><img \nng-src=\"{{ ::data[$index + 1].imageThumb._url || \'img/albumnone.png\'}}\" width=\"100%\"><div class=\"desc\"><h2>\n{{::data[$index+1].title}}</h2><p>{{::data[$index+1].qtyPhotos}} photos</p></div></div></div><ion-infinite-scroll \non-infinite=\"onLoadMore()\" ng-if=\"moreDataCanBeLoaded\" spinner distance=\"1%\"></ion-infinite-scroll>");
$templateCache.put("app/directive/albumPhotoGridDirective.html","<ion-modal-view cache-view=\"false\"><ion-header-bar class=\"bar bar-{{theme}}\"><a ng-click=\"closeAlbumPhotoGridModal()\" \nclass=\"button button-icon icon ion-ios-close-empty\"></a><h1 class=\"title\" ng-bind=\"title\"></h1><a \nclass=\"button button-icon icon ion-android-more-vertical\" ng-if=\"canEdit\" ng-click=\"openPopover($event)\"></a>\n</ion-header-bar><ion-content class=\"padding\"><div class=\"center padding\" ng-if=\"loading\"><ion-spinner></ion-spinner>\n</div><div class=\"row\" ng-if=\"$index % 3 === 0\" ng-repeat=\"image in data | orderBy:\'createdAt\':true\"><div \nclass=\"col col-33\" ng-if=\"$index < data.length\"><img ng-if=\"profile\" profile-modal user=\"data[$index].user.obj\" \nng-src=\"{{ ::data[$index].imageThumb._url}}\" width=\"100%\"> <img ng-if=\"!profile\" ion-slideshow ng-model=\"data\" \nindex=\"$index\" ng-src=\"{{ ::data[$index].imageThumb._url}}\" width=\"100%\"></div><div class=\"col col-33\" \nng-if=\"$index + 1 < data.length\"><img ng-if=\"profile\" profile-modal user=\"data[$index + 1].user.obj\" \nng-src=\"{{ ::data[$index + 1].imageThumb._url}}\" width=\"100%\"> <img ng-if=\"!profile\" ion-slideshow ng-model=\"data\" \nindex=\"$index+1\" ng-src=\"{{ ::data[$index + 1].imageThumb._url}}\" width=\"100%\"></div><div class=\"col col-33\" \nng-if=\"$index + 2 < data.length\"><img ng-if=\"profile\" profile-modal user=\"data[$index + 2].user.obj\" \nng-src=\"{{ ::data[$index + 2].imageThumb._url}}\" width=\"100%\"> <img ng-if=\"!profile\" ion-slideshow ng-model=\"data\" \nindex=\"$index+2\" ng-src=\"{{ ::data[$index + 2].imageThumb._url}}\" width=\"100%\"></div></div></ion-content>\n</ion-modal-view>");
$templateCache.put("app/directive/albumPhotoGridPopover.html","<ion-popover-view><ion-content><div class=\"list\"><a class=\"item item-icon-left\" ng-click=\"uploadPhoto()\"><i \nclass=\"icon ion-ios-camera-outline\"></i> <span translate=\"addPhoto\"></span> </a><a class=\"item item-icon-left\" \nng-click=\"editAlbum()\"><i class=\"icon ion-ios-compose-outline\"></i> <span translate=\"renameAlbum\"></span> </a><a \nclass=\"item item-icon-left\" ng-click=\"deleteAlbum()\"><i class=\"icon ion-ios-trash-outline\"></i> <span \ntranslate=\"deleteAlbum\"></span></a></div></ion-content></ion-popover-view>");
$templateCache.put("app/directive/distanceModal.html","<ion-modal-view><ion-header-bar class=\"bar-light\"><div class=\"buttons\"><button \nclass=\"button button-clear button-icon ion-ios-close-empty\" ng-click=\"closeDistanceModal()\"></button></div><div \nclass=\"title\">{{ \"chooseDistanceText\" | translate }}</div></ion-header-bar><ion-content><ion-list><ion-item \nclass=\"item item-icon-right\" ng-repeat=\"distance in distances\" ng-click=\"onDistanceSelected(distance.val)\" bindonce><h2\n bo-bind=\"distance.text\"></h2><i class=\"icon ion-checkmark\" ng-show=\"params.distance === distance.val\"></i></ion-item>\n</ion-list></ion-content></ion-modal-view>");
$templateCache.put("app/directive/follow.modal.html","<ion-modal-view class=\"modal-profile photogram-profile\"><ion-header-bar class=\"bar-positive\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">\nFollow Users</div></ion-header-bar><ion-content><div class=\"list\"><div class=\"item item-avatar item-button-right\" \nng-repeat=\"item in data\"><img ng-src=\"{{ ::item.src }}\"><h2>{{ ::item.name }}</h2><p>{{ ::item.status }}</p><button \nclass=\"button\" ng-click=\"item.follow = !item.follow\" ng-class=\"item.follow ? \'button-positive\' : \'button-stable\'\"><i \nclass=\"icon\" ng-class=\"item.follow? \'ion-thumbsup\' : \'ion-plus\'\"></i></button></div></div></ion-content>\n</ion-modal-view>");
$templateCache.put("app/directive/galleryAlbumModalDirective.html","<ion-modal-view><ion-header-bar class=\"bar bar-{{theme}}\"><a ng-click=\"closeModal()\" \nclass=\"button button-clear button-positive\" translate=\"cancel\"></a><h1 class=\"title\" translate=\"selectAlbumText\"></h1>\n</ion-header-bar><ion-content><div class=\"list\"><div class=\"item item-thumbnail-left\" gallery-new-album-modal \nng-model=\"ngModel\"><img src=\"img/albumnew.png\"><h2>Create Album</h2></div><div class=\"item item-thumbnail-left\" \nng-repeat=\"item in data | filter:searchValue\" ng-click=\"selectAlbum(item)\"><img \nng-src=\"{{item.imageThumb._url || \'img/albumnone.png\'}}\"><h2 ng-bind=\"item.title\"></h2><p>{{item.qtyPhotos}} photos</p>\n</div></div><ion-infinite-scroll on-infinite=\"onLoadMore()\" ng-if=\"moreDataCanBeLoaded\" spinner></ion-infinite-scroll>\n</ion-content></ion-modal-view>");
$templateCache.put("app/directive/galleryNewAlbumModalDirective.html","<ion-modal-view><form name=\"rForm\" novalidate><ion-header-bar class=\"bar bar-{{theme}}\"><button \nng-click=\"closeModal()\" class=\"button button-clear\" translate=\"cancel\"></button><h1 class=\"title\" \ntranslate=\"createAlbum\" ng-if=\"!form.id\"></h1><h1 class=\"title\" translate=\"editAlbum\" ng-if=\"form.id\"></h1><button \nng-click=\"createAlbum(rForm, form)\" class=\"button button-clear\" translate=\"submit\"></button></ion-header-bar>\n<ion-content><div class=\"list\"><label class=\"item item-input\"><input type=\"text\" name=\"title\" \nplaceholder=\"{{\'albumName\' | translate}}\" ng-model=\"form.title\" required></label><label class=\"item item-input\">\n<textarea name=\"description\" placeholder=\"{{\'albumDesc\' | translate}}\" ng-model=\"form.description\"></textarea></label>\n</div></ion-content></form></ion-modal-view>");
$templateCache.put("app/directive/likeDirective.html","<ion-modal-view class=\"modal-comment\"><ion-header-bar class=\"bar-dark\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">\n{{ ::\'Likes\' | translate }} ({{ ::likes.length }})</div></ion-header-bar><ion-content><div class=\"list step1\"><div \nng-repeat=\"item in likes\" class=\"item item-avatar item-button-right\"><img ng-src=\"{{ ::item.user.img }}\"><h2>\n{{ ::item.user.name }}</h2><div>{{ ::item.text }}</div><p>{{ ::item.created | amTimeAgo }}</p><button \nclass=\"button button-positive button-outline\"><i class=\"icon ion-ios-plus-empty\"></i> {{ ::\'Follow\' }}</button></div>\n</div></ion-content></ion-modal-view>");
$templateCache.put("app/directive/mapPhotoUserDirective.html","<div id=\"map_canvas\" data-tap-disabled=\"true\"></div>");
$templateCache.put("app/directive/photoCommentDirective.html","<ion-modal-view class=\"modal-comment\"><ion-header-bar class=\"bar bar-{{theme}}\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">\n<span translate=\"commentPhotoText\"></span>({{ comments.length }})</div></ion-header-bar><ion-content><div \nclass=\"padding center\" ng-if=\"loading\"><ion-spinner></ion-spinner></div><ion-list class=\"list\" \nng-show=\"comments.length\" can-swipe=\"true\"><ion-item ng-repeat=\"item in comments | orderBy:createdAt\" \nclass=\"item item-avatar\"><img ng-src=\"{{ ::item.user.photo._url || \'./img/user.png\'}}\"><div class=\"row\"><h2>\n{{ ::item.user.name }}</h2></div><div class=\"row\"><div class=\"text\">{{ ::item.text }}</div></div><div class=\"row\"><p>\n{{ ::item.createdAt | amTimeAgo }}</p></div><div ng-if=\"item.user.id === currentUser.id\"><ion-option-button \nclass=\"button-info\" ng-click=\"editComment(item)\" translate=\"edit\">Edit</ion-option-button><ion-option-button \nclass=\"button-assertive\" ng-click=\"deleteComment(item)\" translate=\"remove\">Remove</ion-option-button></div></ion-item>\n</ion-list><div class=\"center-ico\" ng-if=\"nocomments\"><i class=\"icon ion-ios-chatbubble-outline\"></i><h1 \ntranslate=\"noComments\"></h1></div></ion-content><form name=\"rForm\" ng-submit=\"submitComment(rForm, form)\" novalidate>\n<ion-footer-bar class=\"bar-stable item-input-inset message-footer\" keyboard-attach><label class=\"item-input-wrapper\"><i\n class=\"icon ion-ios-compose-outline placeholder-icon\"></i><textarea mentio mentio-trigger-char=\"\'@\'\" \nmentio-items=\"people\" mentio-template-url=\"app/mentio/people-mentions.html\" mentio-search=\"searchPeople(term)\" \nmentio-select=\"getPeopleTextRaw(item)\" mentio-id=\"\'theTextArea\'\" ng-trim=\"false\" ng-model=\"form.text\" \nplaceholder=\"Send a comment...\" required minlength=\"1\" maxlength=\"1500\">\n                </textarea></label><div \nclass=\"footer-btn-wrap\"><button class=\"button button-positive button-outline\" type=\"submit\" \nng-disabled=\"!form.text || form.text === \'\'\">Publish</button></div></ion-footer-bar></form></ion-modal-view>");
$templateCache.put("app/directive/photoGridDirective.html","<div class=\"center padding\" ng-if=\"showErrorView\"><div class=\"error\"><i \nclass=\"icon icon-large ion-ios-cloud-download-outline\"></i><p>{{ \"errorText\" | translate }}</p><button \nclass=\"button button-primary\" ng-click=\"onReload()\">{{ \"tryAgainText\" | translate }}</button></div></div><div \nclass=\"center padding\" ng-if=\"showEmptyView\"><div class=\"error\"><i class=\"icon icon-large ion-android-alert\"></i><p>\n{{ \"galleriesNotFoundText\" | translate }}</p></div></div><div class=\"row\" ng-if=\"$index % 3 === 0\" \nng-repeat=\"image in data | orderBy:\'createdAt\':true\"><div class=\"col col-33\" ng-if=\"$index < data.length\"><img \nng-if=\"profile\" profile-modal user=\"data[$index].user.obj\" ng-src=\"{{ ::data[$index].imageThumb._url}}\" width=\"100%\"> \n<img ng-if=\"!profile\" ion-slideshow ng-model=\"data\" index=\"$index\" ng-src=\"{{ ::data[$index].imageThumb._url}}\" \nwidth=\"100%\"></div><div class=\"col col-33\" ng-if=\"$index + 1 < data.length\"><img ng-if=\"profile\" profile-modal \nuser=\"data[$index + 1].user.obj\" ng-src=\"{{ ::data[$index + 1].imageThumb._url}}\" width=\"100%\"> <img ng-if=\"!profile\" \nion-slideshow ng-model=\"data\" index=\"$index+1\" ng-src=\"{{ ::data[$index + 1].imageThumb._url}}\" width=\"100%\"></div><div\n class=\"col col-33\" ng-if=\"$index + 2 < data.length\"><img ng-if=\"profile\" profile-modal \nuser=\"data[$index + 2].user.obj\" ng-src=\"{{ ::data[$index + 2].imageThumb._url}}\" width=\"100%\"> <img ng-if=\"!profile\" \nion-slideshow ng-model=\"data\" index=\"$index+2\" ng-src=\"{{ ::data[$index + 2].imageThumb._url}}\" width=\"100%\"></div>\n</div><ion-infinite-scroll on-infinite=\"onLoadMore()\" ng-if=\"moreDataCanBeLoaded\" spinner distance=\"1%\">\n</ion-infinite-scroll>");
$templateCache.put("app/directive/photoListDirective.html","<div class=\"center padding\" ng-if=\"showErrorView\"><div class=\"error\"><i \nclass=\"icon icon-large ion-ios-cloud-download-outline\"></i><p>{{ \"errorText\" | translate }}</p><button \nclass=\"button button-primary\" ng-click=\"onReload\">{{ \"tryAgainText\" | translate }}</button></div></div><div \nclass=\"center padding\" ng-if=\"showEmptyView\"><div class=\"error\"><i class=\"icon icon-large ion-android-alert\"></i><p>\n{{ \"galleriesNotFoundText\" | translate }}</p></div></div><div class=\"list card\" \nng-repeat=\"gallery in data | orderBy:\'createdAt\':true\"><div class=\"item item-avatar\" \nng-click=\"load(gallery.user.username)\" ion-affix data-affix-within-parent-with-class=\"card\"><img ng-if=\"profile\" \nng-src=\"{{ ::gallery.user.photo._url}}\"> <img ng-src=\"{{ ::gallery.user.photo._url || \'img/user.png\'}}\"><h2>\n{{ ::gallery.user.name}}</h2><p>{{ ::gallery.user.status}}</p><span>{{ ::gallery.createdAt | amTimeAgo}}</span></div>\n<div class=\"item item-body\" on-double-tap=\"like(gallery.id)\" ng-model=\"gallery\"><div class=\"icon ion-ios-heart heart\" \nng-class=\"gallery.isLiked ? \'happy\' : \'broken\' \"></div><i class=\"icon\" ng-if=\"like\"></i> <img \nng-src=\"{{ gallery.image._url}}\" id=\"{{ ::gallery.id}}\"></div><div class=\"item item-buttons\"><div class=\"row\"><div \nclass=\"col col-30\"><ion-spinner ng-show=\"gallery.progress\"></ion-spinner><button photo-like ng-model=\"gallery\" \nng-if=\"!gallery.progress\" ng-class=\"gallery.isLiked ? \'ion-ios-heart\' : \'ion-ios-heart-outline\' \" \nclass=\"button-clear button-icon button-heart\"></button> <button ng-click=\"openComment(gallery.id)\" ng-model=\"gallery\" \nclass=\"button-clear button-icon ion-ios-chatbubble-outline\"></button> <button ng-click=\"share(gallery)\" \nphotogram=\"{{ :: gallery.id }}\" class=\"button-clear button-icon ion-android-share\"></button></div><div \nclass=\"col album-name text-center\" album-photo-grid album=\"gallery.album.id\"><div \nng-bind=\"gallery.album.attributes.title\"></div></div><div class=\"col text-right\"><button ng-click=\"action(gallery)\" \nphotogram=\"{{ :: gallery.id }}\" class=\"button-clear button-icon ion-android-more-vertical\"></button></div></div></div>\n<div class=\"padding\"><span class=\"likes\" ng-click=\"openLikers(gallery.id)\"><i class=\"icon ion-ios-heart\"></i> <span \nng-if=\"!gallery.progress\">{{ gallery.likesTotal }}</span> <span translate=\"likesText\"></span></span><div \nclass=\"list-comments\"><div class=\"comment-item\"><span profile-modal username=\"gallery.user.username\" class=\"username\">\n{{ :: gallery.user.name }}</span> <span class=\"comment\" ng-bind-html=\"gallery.title | hashtag \"></span></div><div \nclass=\"comment-item\" ng-repeat=\"item in gallery.comments |limitTo:3 | orderBy:\'createdAt\':true\"><span class=\"username\" \nprofile-modal username=\"gallery.user.username\">{{ :: item.user.name }}</span> <span class=\"comment\" \nng-bind-html=\"item.text | hashtag\"></span></div><a class=\"comment-item\" photo-comment ng-model=\"gallery\" \nng-if=\"gallery.commentsTotal>3\" translate=\"seeAllCommentText\"></a></div><button \nclass=\"button button-block button-clear button-comment\" photo-comment ng-model=\"gallery\"><span translate=\"addComment\">\n</span></button></div></div><ion-infinite-scroll on-infinite=\"onLoadMore()\" ng-if=\"moreDataCanBeLoaded\" spinner>\n</ion-infinite-scroll>");
$templateCache.put("app/directive/profile-edit-modal.html","<ion-modal-view class=\"profile-edit\"><ion-header-bar class=\"bar bar-{{theme}}\"><button class=\"button button-clear\" \nng-click=\"closeModal()\" translate=\"cancel\"></button><div class=\"title\">{{ ::\'editProfile\' | translate }}</div>\n</ion-header-bar><ion-content class=\"view-avatar\"><div class=\"step2\"><form name=\"rForm\" \nng-submit=\"submitUpdateProfile(rForm, form)\" novalidate><img class=\"avatar\" user-avatar ng-model=\"currentUser\" \nng-src=\"{{ currentUser.photo.url() || \'img/user.png\' }}\"><label class=\"item item-input\"><i \nclass=\"icon ion-clipboard placeholder-icon\"></i> <input required=\"required\" type=\"text\" name=\"name\" \nng-model=\"form.name\" placeholder=\"{{\'name\' | translate}}\"></label><label class=\"item item-input\"><i \nclass=\"icon ion-at placeholder-icon\"></i> <input required=\"required\" type=\"text\" name=\"username\" \nng-model=\"form.username\" ng-minlength=\"4\" ng-maxlength=\"12\" ng-pattern=\"/^[a-zA-Z\'. -]+$/\" \nplaceholder=\"{{\'username\' | translate}}\"></label><label class=\"item item-input\"><i \nclass=\"icon ion-earth placeholder-icon\"></i> <input type=\"url\" name=\"website\" ng-model=\"form.website\" \nplaceholder=\"{{\'site\' | translate}}\"></label><label class=\"item item-input\"><i \nclass=\"icon ion-information-circled placeholder-icon\"></i> <input required=\"required\" type=\"text\" name=\"status\" \nng-model=\"form.status\" placeholder=\"{{\'status\' | translate}}\"></label><ion-item class=\"item-divider\" \ntranslate=\"privateInformation\"></ion-item><label class=\"item item-input\"><i \nclass=\"icon icon-envelope placeholder-icon\"></i> <input type=\"email\" name=\"email\" ng-model=\"form.email\" \ndisabled=\"disabled\" ng-model-options=\"{debounce: 1000}\" placeholder=\"user@example.com\"></label><label \nclass=\"item item-input\"><i class=\"icon ion-iphone placeholder-icon\"></i> <input required=\"required\" type=\"tel\" \nname=\"phone\" ng-model=\"form.phone\" placeholder=\"{{\'phone\' | translate }}\"></label><div class=\"padding\"><button \ntype=\"submit\" class=\"button button-block button-positive\" translate=\"submit\"></button></div></form></div></ion-content>\n</ion-modal-view>");
$templateCache.put("app/directive/profile-modal.html","<ion-modal-view id=\"account-view\"><ion-header-bar class=\"bar-{{theme}}\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\">\n{{ user.name }}</div></ion-header-bar><ion-content overflow-scroll=\"true\"><div class=\"profile-top\"><div class=\"row\">\n<div class=\"col-25\"><img class=\"avatar\" ng-src=\"{{ user.photo._url || \'img/user.png\'}}\"></div><div \nclass=\"col col-statics\"><div class=\"row\"><div class=\"row\"><div class=\"col\"><span class=\"text-center\">\n{{ ::user.galleriesTotal || 0}}</span><h3 translate=\"postsText\"></h3></div><div class=\"col\"><span class=\"text-center\">\n{{ user.followersTotal || 0}}</span><h3 translate=\"followersText\"></h3></div><div class=\"col\"><span \nclass=\"text-center\">{{ ::user.followingsTotal || 0}}</span><h3 translate=\"followingText\"></h3></div></div></div><div \nclass=\"row col-edit\"><div class=\"col\"><photogram-loading loading=\"loadingFollow\"></photogram-loading><button \nng-class=\"{\'button-unfollow\': user.isFollow, \'button-follow\': !user.isFollow}\" ng-click=\"follow()\" class=\"button\"><span\n ng-show=\"!user.isFollow\" translate>Follow</span> <span ng-show=\"user.isFollow\" translate>Following</span></button>\n</div></div></div></div><div class=\"padding\"><span class=\"user-username\">{{ user.name }}</span><p class=\"user-status\">\n{{ user.status }}</p></div></div><div class=\"item bar\"><div class=\"button-bar\"><button \nclass=\"button button-icon icon ion-grid\" ng-class=\"{active: tab.grid}\" ng-click=\"changeTab(\'grid\')\"></button> <button \nclass=\"button button-icon icon ion-drag\" ng-class=\"{active: tab.list}\" ng-click=\"changeTab(\'list\')\"></button> <button \nclass=\"button button-icon icon ion-ios-location\"></button></div></div><div class=\"item item-divider\" \ntranslate=\"recent\"></div><div class=\"tab\" ng-if=\"tab.list\"></div><div class=\"tab\" ng-if=\"tab.grid\"></div></ion-content>\n</ion-modal-view>");
$templateCache.put("app/directive/search-directive.html","<label class=\"item item-input\"><i class=\"icon ion-search placeholder-icon\"></i> <input type=\"search\" ng-model=\"input\" \nplaceholder=\"{{\'SEARCH.FORM.INPUT\' | translate }}\"> <button class=\"button button-icon\" ng-if=\"input.length\" \nng-click=\"clearSearch()\"><i class=\"icon ion-close\"></i></button></label>");
$templateCache.put("app/directive/settings-modal.html","<ion-modal-view class=\"modal-profile\"><ion-header-bar class=\"bar bar-{{theme}}\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeSettingModal()\"></button><div \nclass=\"title\" translate=\"settingTitle\"></div></ion-header-bar><ion-content class=\"animated fadeIn\"><div class=\"list\">\n<ion-language></ion-language><ion-toggle class=\"toggle-positive\" ng-model=\"form.push\"><h3><small \ntranslate=\"notificationText\"></small></h3><p ng-if=\"form.push\" translate=\"on\"></p><p ng-if=\"!form.push\" \ntranslate=\"off\"></p></ion-toggle><ion-item class=\"item-icon-right\" href=\"http://photogramapp.com\"><h3><small \ntranslate=\"terms\"></small></h3><i class=\"icon ion-ios-arrow-right\"></i></ion-item></div><div class=\"padding\"><button \nng-click=\"logout()\" class=\"button button-block button-positive\" translate=\"logout\"></button></div></ion-content>\n</ion-modal-view>");
$templateCache.put("app/mentio/people-mentions.html","<ul class=\"list-group user-search\"><li mentio-menu-item=\"person\" ng-repeat=\"person in items\" class=\"list-group-item\">\n<img ng-src=\"{{person.imageUrl}}\" class=\"user-photo\"><div class=\"description\"><span class=\"text-primary\" \nng-bind-html=\"person.username | mentioHighlight:typedTerm:\'menu-highlighted\' | unsafe\"></span> <em class=\"text-muted\" \nng-bind=\"person.status | words:5\"></em></div></li></ul>");
$templateCache.put("app/mentio/photo-mentions.html","<ul class=\"list-group product-search demo-scrollable-menu\"><li mentio-menu-item=\"product\" ng-repeat=\"product in items\" \nclass=\"list-group-item clearfix\"><div class=\"row\"><div class=\"col-xs-2 text-center\"><img ng-src=\"{{product.imageUrl}}\" \nclass=\"product-photo\"></div><div class=\"col-xs-10\"><h4 class=\"list-group-item-heading\">{{product.title | words:5}}</h4>\n<p class=\"list-group-item-text\">{{product.description | words:7}}</p></div></div></li></ul>");
$templateCache.put("app/component/ion-language/ion-language.html","<button class=\"button button-block button-clear button-{{theme}} button-language\">{{language.translation | translate}} \n<i class=\"icon ion-android-arrow-dropdown\"></i></button>");
$templateCache.put("app/component/ion-language/modal-language.html","<ion-modal-view><ion-header-bar><h1 class=\"title\" translate=\"selectLanguageText\"></h1><a ng-click=\"closeModal()\" \nclass=\"button button-icon icon ion-close\"></a></ion-header-bar><div \nclass=\"bar bar-subheader item-input-inset bar-stable\"><label class=\"item-input-wrapper\"><i \nclass=\"icon ion-ios-search placeholder-icon\"></i> <input type=\"search\" placeholder=\"{{\'searchText\' | translate}}\" \nng-model=\"searchValue\"></label><button type=\"button\" class=\"button button-clear\" ng-show=\"searchValue.length\" \nng-click=\"searchValue=\'\'\">Clear</button></div><ion-content class=\"has-subheader has-header\"><ion-list><ion-item \nclass=\"item\" ng-click=\"selectLanguage(item)\" ng-repeat=\"item in languages | filter:searchValue\" \nng-bind-html=\"item.translation | translate\"></ion-item></ion-list></ion-content></ion-modal-view>");
$templateCache.put("app/component/ion-slideshow/image-popover.html","<div class=\"modal image-modal transparent\" ng-click=\"closeModal()\"><ion-slide-box \non-slide-changed=\"slideChanged(index)\" show-pager=\"true\" active-slide=\"activeSlide\"><ion-slide \nng-repeat=\"item in allImages\"><img ng-src=\"{{item.image._url}}\" class=\"fullscreen-image\"></ion-slide></ion-slide-box>\n</div>");
$templateCache.put("app/component/ion-slideshow/video-popover.html","<div class=\"modal transparent fullscreen-player\" ng-click=\"closeModal()\"><video ng-src=\"{{clipSrc}}\" class=\"centerme\" \ncontrols=\"controls\" autoplay></video></div>");
$templateCache.put("app/main/account-friend-list/account-friend-list.html","<ion-view><ion-content></ion-content></ion-view>");
$templateCache.put("app/main/feedback/feedback-modal.html","<ion-modal-view class=\"modal-profile\"><ion-header-bar class=\"bar bar-{{theme}}\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModal()\"></button><div class=\"title\" \ntranslate=\"feedbackTitle\"></div></ion-header-bar><ion-content><form name=\"myForm\" novalidate=\"novalidate\" \nng-submit=\"submitFeedback(myForm, form)\"><label class=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\">\n</i> <input required=\"required\" type=\"text\" name=\"title\" ng-model=\"form.title\" \nplaceholder=\"{{\'feedbackTitle\' | translate}}\"></label><label class=\"item item-input item-select\"><i \nclass=\"icon ion-ios-information-outline placeholder-icon\"></i><div class=\"input-label\" translate>subject</div><select \nng-model=\"form.subject\"><option selected=\"selected\" translate>complaint</option><option translate>bug</option><option \ntranslate>suggestion</option></select></label><label class=\"item item-input\"><i \nclass=\"icon ion-ios-compose-outline placeholder-icon\"></i><textarea ng-model=\"form.message\" \nplaceholder=\"{{\'message\' | translate}}\"></textarea></label><div class=\"padding\"><button \nclass=\"button button-block button-positive\" type=\"submit\" translate=\"{{\'submit\' | translate}}\"></button></div></form>\n</ion-content></ion-modal-view>");
$templateCache.put("app/main/gallery-comment/gallery-comment.html","<ion-view class=\"modal-comment\" cache-view=\"false\"><ion-nav-bar class=\"bar bar-{{theme}}\"><ion-nav-buttons side=\"left\">\n<button class=\"button button-icon button-clear ion-ios-arrow-left\" ng-click=\"$ionicGoBack()\"></button>\n</ion-nav-buttons><ion-nav-title><div class=\"title\"><span translate=\"commentPhotoText\"></span>({{ comments.length }})\n</div></ion-nav-title></ion-nav-bar><ion-content><div class=\"padding center\" ng-if=\"loading\"><ion-spinner>\n</ion-spinner></div><ion-list class=\"list\" ng-if=\"!loading\" can-swipe=\"true\"><ion-item \nng-repeat=\"item in comments | orderBy:\'createdAt\':false\" class=\"item item-avatar\"><img \nng-src=\"{{ ::item.user.photo._url || \'./img/user.png\'}}\"><div class=\"row\"><h2>{{ ::item.user.name }}</h2></div><div \nclass=\"row\"><div class=\"text\">{{ ::item.text }}</div></div><div class=\"row\"><p>{{ ::item.createdAt | amTimeAgo }}</p>\n</div><div ng-if=\"item.canEdit\"><ion-option-button class=\"button-info\" ng-click=\"editComment(item, $index)\" \ntranslate=\"edit\">Edit</ion-option-button><ion-option-button class=\"button-assertive\" \nng-click=\"deleteComment(item, $index)\" translate=\"remove\">Remove</ion-option-button></div></ion-item></ion-list><div \nclass=\"center-ico\" ng-if=\"nocomments\"><i class=\"icon ion-ios-chatbubble-outline\"></i><h1 translate=\"noComments\"></h1>\n</div></ion-content><form name=\"rForm\" ng-submit=\"submitComment(rForm, form)\" novalidate><ion-footer-bar \nng-hide=\"loading\" class=\"bar-stable item-input-inset message-footer\" keyboard-attach><label class=\"item-input-wrapper\">\n<i class=\"icon ion-ios-compose-outline placeholder-icon\"></i><textarea mentio mentio-trigger-char=\"\'@\'\" \nmentio-items=\"people\" mentio-template-url=\"app/mentio/people-mentions.html\" mentio-search=\"searchPeople(term)\" \nmentio-select=\"getPeopleTextRaw(item)\" mentio-id=\"\'theTextArea\'\" ng-trim=\"false\" ng-model=\"form.text\" focus-me \nid=\"textComment\" placeholder=\"Send a comment...\" required minlength=\"1\" maxlength=\"1500\">\n                </textarea>\n</label><div class=\"footer-btn-wrap\"><button class=\"button button-positive button-outline\" type=\"submit\" \nng-disabled=\"!form.text || form.text === \'\'\">Publish</button></div></ion-footer-bar></form></ion-view>");
$templateCache.put("app/main/loading/loading.html","<ion-view id=\"user-layout\" class=\"bg-animate\"><ion-content></ion-content></ion-view>");
$templateCache.put("app/main/profile/profile.html","<ion-view cache-view=\"false\" id=\"account-view\"><ion-nav-bar class=\"bar bar-{{theme}}\"><ion-nav-back-button>\n</ion-nav-back-button></ion-nav-bar><ion-nav-title><span>{{ vm.user.name }}</span></ion-nav-title><ion-content \nscroll-sista=\"header-tabs\" class=\"animated fadeIn\"><ion-refresher pulling-text=\"Loading\" on-refresh=\"onReload()\">\n</ion-refresher><div class=\"profile-top\"><div class=\"row\"><div class=\"col-25\"><img class=\"avatar\" user-avatar \nng-model=\"vm.user\" ng-src=\"{{ vm.user.photo._url || \'img/user.png\' }}\"></div><div class=\"col col-statics\"><div \nclass=\"row\"><div class=\"col\"><span class=\"text-center\">{{ vm.user.galleriesTotal || 0}}</span><h3 \ntranslate=\"postsText\"></h3></div><div class=\"col\" ng-click=\"vm.openFollowers()\"><span class=\"text-center\">\n{{ vm.user.followersTotal || 0}}</span><h3 translate=\"followersText\"></h3></div><div class=\"col\" \nng-click=\"vm.openFollowing()\"><span class=\"text-center\">{{ vm.user.followingsTotal || 0}}</span><h3 \ntranslate=\"followingText\"></h3></div></div><div class=\"row col-edit\"><div class=\"col center\" ng-if=\"vm.loading\">\n<ion-spinner></ion-spinner></div><div class=\"col\" ng-if=\"vm.isMe && !vm.loading\"><button profile-modal-edit \nuser=\"vm.user\" class=\"button\"><div translate=\"editProfile\"></div></button></div><div class=\"col\" \nng-if=\"!vm.isMe && !vm.loading\"><button \nng-class=\"{\'button-unfollow\': vm.user.isFollow, \'button-follow\': !vm.user.isFollow}\" ng-click=\"vm.follow()\" \nclass=\"button\"><span ng-show=\"!vm.user.isFollow\" translate>Follow</span> <span ng-show=\"vm.user.isFollow\" translate>\nFollowing</span></button></div></div></div></div><div class=\"padding\"><span class=\"user-username\">{{ vm.user.name }}\n</span><p class=\"user-status\">{{ vm.user.status }}</p></div></div><div class=\"item bar\"><div class=\"button-bar\"><button\n class=\"button button-icon icon ion-grid\" ng-class=\"{\'active\': vm.tab.grid}\" ng-click=\"vm.changeTab(\'grid\')\"></button> \n<button class=\"button button-icon icon ion-ios-camera-outline\" ng-class=\"{\'active\': vm.tab.album}\" \nng-click=\"vm.changeTab(\'album\')\"></button> <button class=\"button button-icon icon ion-drag\" \nng-class=\"{\'active\': vm.tab.list}\" ng-click=\"vm.changeTab(\'list\')\"></button> <button \nclass=\"button button-icon icon ion-ios-location-outline\" ng-class=\"{\'active\': vm.tab.map}\" \nng-click=\"vm.changeTab(\'map\')\"></button></div></div><div ng-if=\"!vm.loading\"><div class=\"tab\" \nng-if=\"vm.tab.grid && !vm.loading\"><div class=\"item item-divider\" translate=\"recent\"></div><photo-grid \nusername=\"vm.user.username\" on-reload=\"onReload\"></photo-grid></div><div class=\"tab\" \nng-if=\"vm.tab.album && !vm.loading\"><div class=\"item item-divider\" translate=\"albums\"></div><album-grid \nusername=\"vm.user.username\" on-reload=\"onReload\"></album-grid></div><div class=\"tab\" \nng-if=\"vm.tab.list && !vm.loading\"><div class=\"item item-divider\" translate=\"recent\"></div><photo-list \nusername=\"vm.user.username\" on-reload=\"onReload\"></photo-list></div><div class=\"tab\" ng-if=\"vm.tab.map && !vm.loading\">\n<div class=\"item item-divider\" translate=\"map\"></div><map-photo-user username=\"vm.user.username\" on-reload=\"onReload\">\n</map-photo-user></div></div></ion-content></ion-view>");
$templateCache.put("app/main/profile-photo/profile-photo.html","<ion-view cache-view=\"false\" id=\"account-view\"><ion-nav-bar class=\"bar bar-{{theme}}\"><ion-nav-back-button>\n</ion-nav-back-button></ion-nav-bar><ion-nav-title><span translate=\"photo\"></span></ion-nav-title><ion-content \nscroll-sista=\"header-tabs\" class=\"animated fadeIn\"><photo-list id=\"vm.id\" profile=\"true\" load=\"vm.openProfile\" \nopen-likers=\"vm.openLikers\" on-reload=\"onReload\"></photo-list></ion-content></ion-view>");
$templateCache.put("app/main/share/post-modal.html","<ion-modal-view class=\"modal-post\"><ion-header-bar class=\"bar-{{theme}}\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closePost()\"></button><div class=\"title\" \ntranslate=\"SHARE.TITLE\"></div><button class=\"button button-positive\" ng-click=\"submitPost(form)\"><i \nclass=\"icon ion-arrow-right-b\"></i></button></ion-header-bar><ion-content><div id=\"image\"><img ng-src=\"{{image}}\">\n</div><ul class=\"list\"><li class=\"item\"><textarea ng-model=\"form.title\" \nplaceholder=\"{{ \'SHARE.FORM.LEGEND\' | translate }}\"></textarea></li></ul></ion-content></ion-modal-view>");
$templateCache.put("app/main/share/share-modal.html","<ion-modal-view class=\"modal-share\"><form name=\"rForm\" novalidate><ion-header-bar class=\"bar bar-{{theme}}\"><button \nclass=\"button button-clear button-clear\" ng-click=\"close()\" translate=\"cancel\"></button><div class=\"title\" \ntranslate=\"shareGalleryText\"></div><button class=\"button button-clear\" ng-click=\"submit(rForm, form)\" \ntranslate=\"submit\"></button></ion-header-bar><ion-content><div class=\"list\"><div class=\"item item-thumbnail-left\"><img \nng-src=\"{{image}}\" ng-click=\"editFilter()\"><textarea mentio mentio-trigger-char=\"\'@\'\" mentio-items=\"people\" \nmentio-template-url=\"app/mentio/people-mentions.html\" mentio-search=\"searchPeople(term)\" \nmentio-select=\"getPeopleTextRaw(item)\" mentio-id=\"\'theTextArea\'\" ng-trim=\"false\" type=\"text\" ng-model=\"form.title\" \nplaceholder=\"{{ \'description\'|translate }}\"></textarea></div><div class=\"item item-divider\" translate=\"shareLocation\">\n</div><div class=\"item item-icon-left\" ion-location ng-model=\"form.address\" ng-if=\"!form.address.resume\"><i \nclass=\"icon ion-ios-location\"></i> <span translate=\"addLocale\"></span></div><a \nclass=\"item item-icon-left item-button-right\" ng-if=\"form.address.resume\"><i class=\"icon ion-ios-location\"></i><h2>\n{{form.address.name || form.address.resume}}</h2><p>{{form.address.resume}}</p><button class=\"button button-icon\" \nng-click=\"closeAddress()\"><i class=\"icon ion-ios-close\"></i></button></a><div class=\"item item-divider\" \ntranslate=\"selectAlbumText\"></div><div class=\"item item-thumbnail-left\" gallery-album-modal ng-model=\"form.album\"><img \nng-src=\"{{form.album.imageThumb._url || \'img/albumnone.png\'}}\"><h2 ng-if=\"!form.album.title\" \ntranslate=\"clickSelectAlbum\"></h2><h2 ng-if=\"form.album\" ng-bind=\"form.album.title\"></h2><p ng-if=\"form.album\">\n{{form.album.qtyPhotos}} photos</p></div><div class=\"item item-divider\" translate=\"shareSocial\"></div></div>\n</ion-content></form></ion-modal-view>");
$templateCache.put("app/main/tab/main-tab.html","<ion-view cache-view=\"true\"><ion-nav-bar class=\"bar bar-{{theme}}\"><ion-nav-back-button></ion-nav-back-button>\n</ion-nav-bar><ion-tabs class=\"tabs-light tabs-photogram\"><ion-tab icon-on=\"ion-ios-home\" \nicon-off=\"ion-ios-home-outline\" ui-sref=\"tab.home\"><ion-nav-view name=\"tabHome\"></ion-nav-view></ion-tab><ion-tab \nicon-on=\"ion-ios-world\" icon-off=\"ion-ios-world-outline\" ui-sref=\"tab.search\"><ion-nav-view name=\"tabSearch\">\n</ion-nav-view></ion-tab><ion-tab icon-on=\"ion-ios-camera\" icon-off=\"ion-ios-camera-outline\" ng-click=\"vm.postPhoto()\">\n<ion-nav-view name=\"tabCapture\"></ion-nav-view></ion-tab><ion-tab icon-on=\"ion-ios-heart\" \nicon-off=\"ion-ios-heart-outline\" badge=\"badge\" ui-sref=\"tab.activity\"><ion-nav-view name=\"tabActivity\"></ion-nav-view>\n</ion-tab><ion-tab icon-on=\"ion-ios-person\" icon-off=\"ion-ios-person-outline\" ui-sref=\"tab.account\"><ion-nav-view \nname=\"tabProfile\"></ion-nav-view></ion-tab></ion-tabs></ion-view>");
$templateCache.put("app/main/tab-account/account.html","<ion-view cache-view=\"false\" id=\"account-view\"><ion-nav-title><span>{{ vm.user.attributes.name }}</span>\n</ion-nav-title><ion-nav-buttons side=\"right\"><button settings-modal class=\"button button-icon icon ion-gear-a\">\n</button></ion-nav-buttons><ion-content><div class=\"profile-top\"><div class=\"row\"><div class=\"col-25\"><img \nclass=\"avatar\" user-avatar ng-model=\"currentUser\" ng-src=\"{{ currentUser.photo.url() || \'img/user.png\' }}\"></div><div \nclass=\"col col-statics\"><div class=\"row\"><div class=\"col\"><span ng-if=\"!vm.loading\" class=\"text-center\">\n{{ vm.user.attributes.galleriesTotal || 0}}</span><ion-spinner ng-if=\"vm.loading\"></ion-spinner><h3 \ntranslate=\"postsText\"></h3></div><div class=\"col\" ng-click=\"vm.openFollowers()\"><span ng-if=\"!vm.loading\" \nclass=\"text-center\">{{ vm.user.attributes.followersTotal || 0}}</span><ion-spinner ng-if=\"vm.loading\"></ion-spinner><h3\n translate=\"followersText\"></h3></div><div class=\"col\" ng-click=\"vm.openFollowing()\"><span ng-if=\"!vm.loading\" \nclass=\"text-center\">{{ vm.user.attributes.followingsTotal || 0}}</span><ion-spinner ng-if=\"vm.loading\"></ion-spinner>\n<h3 translate=\"followingText\"></h3></div></div><div class=\"row col-edit\"><div class=\"col\"><button profile-modal-edit \nuser=\"vm.user\" class=\"button\"><div translate=\"editProfile\"></div></button></div></div></div></div><div class=\"padding\">\n<span class=\"user-username\">{{ vm.user.attributes.name }}</span><p class=\"user-status\">{{ vm.user.attributes.status }}\n</p></div></div><div class=\"item bar\"><div class=\"button-bar\"><button class=\"button button-icon icon ion-grid\" \nng-class=\"{\'active\': vm.tab.grid}\" ng-click=\"vm.changeTab(\'grid\')\"></button> <button \nclass=\"button button-icon icon ion-ios-camera-outline\" ng-class=\"{\'active\': vm.tab.album}\" \nng-click=\"vm.changeTab(\'album\')\"></button> <button class=\"button button-icon icon ion-drag\" \nng-class=\"{\'active\': vm.tab.list}\" ng-click=\"vm.changeTab(\'list\')\"></button> <button \nclass=\"button button-icon icon ion-ios-location-outline\" ng-class=\"{\'active\': vm.tab.map}\" \nng-click=\"vm.changeTab(\'map\')\"></button></div></div><div class=\"tab\" ng-if=\"vm.tab.grid && !vm.loading\"><div \nclass=\"item item-divider\" translate=\"recent\"></div><photo-grid username=\"vm.user.attributes.username\" \non-reload=\"onReload\"></photo-grid></div><div class=\"tab\" ng-if=\"vm.tab.album && !vm.loading\"><div \nclass=\"item item-divider\" translate=\"albums\"></div><album-grid username=\"vm.user.attributes.username\" \non-reload=\"onReload\"></album-grid></div><div class=\"tab\" ng-if=\"vm.tab.list && !vm.loading\"><div \nclass=\"item item-divider\" translate=\"recent\"></div><photo-list username=\"vm.user.attributes.username\" \non-reload=\"onReload\"></photo-list></div><div class=\"tab\" ng-if=\"vm.tab.map && !vm.loading\"><div \nclass=\"item item-divider\" translate=\"map\"></div><map-photo-user username=\"vm.user.attributes.username\" \non-reload=\"onReload\"></map-photo-user></div></ion-content></ion-view>");
$templateCache.put("app/main/tab-activity/activity.html","<ion-view class=\"list-activity\"><ion-nav-title><span translate=\"activities\"></span></ion-nav-title><ion-content><div \nclass=\"center padding\" ng-if=\"loading &&!data.length\"><ion-spinner></ion-spinner></div><div class=\"center padding\" \nng-if=\"showErrorView\"><div class=\"error\"><i class=\"icon icon-large ion-ios-cloud-download-outline\"></i><p>\n{{ \"errorText\" | translate }}</p><button class=\"button button-positive\" ng-click=\"onReload()\">\n{{ \"tryAgainText\" | translate }}</button></div></div><div class=\"center padding\" ng-if=\"showEmptyView\"><div \nclass=\"error\"><i class=\"icon icon-large ion-android-alert\"></i><p>{{ \"activityNotFoundText\" | translate }}</p></div>\n</div><ion-refresher pulling-text=\"{{\'loadingText\'| translate}}\" on-refresh=\"onReload()\"></ion-refresher><div \nclass=\"list\"><div class=\"item item-avatar item-animate1\" ng-repeat=\"item in data | orderBy:\'createdAt\':true\"><img \nng-src=\"{{ item.user.photo._url  || \'./img/user.png\'}}\"><h2 ng-click=\"openProfile(item.user.username)\">\n{{ item.user.name}}</h2><div class=\"text\">{{ item.action | translate }}</div><p>{{ item.createdAt | amTimeAgo }}</p>\n<div class=\"img-right\" ng-if=\"item.item.gallery\"><img ng-src=\"{{ item.item.gallery.attributes.imageThumb._url}}\"></div>\n<div class=\"item-button-right\" ng-if=\"!item.item.gallery\"><button class=\"button button-positive button-outline icon\" \nng-class=\"{\'ion-ios-person-outline\': item.user.isFollow, \'ion-ios-personadd-outline\': !item.user.isFollow}\" \nng-click=\"follow(user)\"></button></div></div></div><ion-infinite-scroll on-infinite=\"onLoadMore()\" \nng-if=\"moreDataCanBeLoaded\" spinner distance=\"1%\"></ion-infinite-scroll></ion-content></ion-view>");
$templateCache.put("app/main/tab-home/home.html","<ion-view class=\"view-home\"><ion-nav-buttons side=\"left\"><button \nclass=\"button button-icon icon ion-ios-personadd-outline\" ui-sref=\"tab.homeUserlist\"></button></ion-nav-buttons>\n<ion-nav-title><span class=\"icon2-logo\"></span></ion-nav-title><ion-content><ion-refresher pulling-text=\"Loading\" \non-refresh=\"onReload()\"></ion-refresher><photo-list profile=\"true\" load=\"vm.openProfile\" open-likers=\"vm.openLikers\" \non-reload=\"onReload\"></photo-list></ion-content></ion-view>");
$templateCache.put("app/main/tab-search/search.html","<ion-view><ion-nav-title><span>{{ \'searchText\' | translate }}</span></ion-nav-title><ion-nav-buttons side=\"right\">\n<button class=\"button button-icon ion-ios-location\" ui-sref=\"tab.map\"></button></ion-nav-buttons><ion-header-bar \nclass=\"bar bar-{{theme}} bar-subheader item-input-inset\"><label class=\"item-input-wrapper\"><i \nclass=\"icon ion-ios-search placeholder-icon\"></i> <input type=\"search\" ng-model=\"params.search\" ng-change=\"onSearch()\" \nng-model-options=\"{debounce:1000}\" placeholder=\"{{ \'searchText\' | translate }}\"></label><button \nclass=\"button button-clear\" ng-if=\"search.length\" ng-click=\"clearSearch()\">{{ \"cancelText\" | translate }}</button>\n</ion-header-bar><ion-content class=\"has-subheader\"><ion-refresher pulling-text=\"Loading\" on-refresh=\"onReload()\">\n</ion-refresher><div class=\"center padding\" ng-if=\"showErrorView()\"><div class=\"error\"><i \nclass=\"icon icon-large ion-ios-cloud-download-outline\"></i><p>{{ \"errorText\" | translate }}</p><button \nclass=\"button button-primary\" ng-click=\"onReload()\">{{ \"tryAgainText\" | translate }}</button></div></div><div \nclass=\"center padding\" ng-if=\"showEmptyView()\"><div class=\"error\"><i class=\"icon icon-large ion-android-alert\"></i><p>\n{{ \"galleriesNotFoundText\" | translate }}</p></div></div><div class=\"center padding\" ng-if=\"loading\"><ion-spinner>\n</ion-spinner></div><div class=\"row animated fadeIn\" ng-if=\"$index % 3 === 0\" \nng-repeat=\"image in data | orderBy:\'createdAt\':true\"><div class=\"col col-33 item-animate1\" \nng-if=\"$index < data.length\" ui-sref=\"tab.searchProfile({username: data[$index].user.username})\"><img ng-if=\"profile\" \nprofile-modal user=\"data[$index].user.obj\" ng-src=\"{{ ::data[$index].imageThumb._url}}\" width=\"100%\"> <img \nng-if=\"!profile\" ng-src=\"{{ ::data[$index].imageThumb._url}}\" width=\"100%\"></div><div class=\"col col-33 item-animate1\" \nng-if=\"$index + 1 < data.length\" ui-sref=\"tab.searchProfile({username: data[$index].user.username})\"><img \nng-if=\"profile\" profile-modal user=\"data[$index + 1].user.obj\" ng-src=\"{{ ::data[$index + 1].imageThumb._url}}\" \nwidth=\"100%\"> <img ng-if=\"!profile\" ng-src=\"{{ ::data[$index + 1].imageThumb._url}}\" width=\"100%\"></div><div \nclass=\"col col-33 item-animate1\" ng-if=\"$index + 2 < data.length\" \nui-sref=\"tab.searchProfile({username: data[$index].user.username})\"><img ng-if=\"profile\" profile-modal \nuser=\"data[$index + 2].user.obj\" ng-src=\"{{ ::data[$index + 2].imageThumb._url}}\" width=\"100%\"> <img ng-if=\"!profile\" \nng-src=\"{{ ::data[$index + 2].imageThumb._url}}\" width=\"100%\"></div></div><ion-infinite-scroll \non-infinite=\"onLoadMore()\" ng-if=\"moreDataCanBeLoaded()\" spinner distance=\"1%\"></ion-infinite-scroll></ion-content>\n</ion-view>");
$templateCache.put("app/main/tab-search-map/searchMap.html","<ion-view id=\"view-map\"><ion-nav-title>{{ \'mapTitle\' | translate }}</ion-nav-title><ion-content scroll=\"false\"><div \nid=\"map_canvas\" data-tap-disabled=\"true\"></div></ion-content><ion-footer-bar><div class=\"row\" ng-if=\"loading\"><div \nclass=\"col\"><div class=\"center\"><ion-spinner></ion-spinner></div></div></div><button ng-if=\"!loading\" \nclass=\"button button-positive button-block button-outline\" ng-click=\"onSearchHere()\">{{ \'searchInHere\' | translate }}\n</button></ion-footer-bar></ion-view>");
$templateCache.put("app/main/user-avatar/user-avatar.html","<ion-view id=\"user-layout\" class=\"bg-animate\"><ion-content class=\"padding view-avatar\"><div class=\"row step1\"><div \nclass=\"col\"><img class=\"avatar\" user-avatar ng-model=\"user\" ng-src=\"{{ user._url || \'img/user.png\' }}\"></div></div><div\n class=\"step2\"><form name=\"myForm\" novalidate=\"novalidate\" ng-submit=\"submitAvatar(myForm, form)\"><label \nclass=\"item item-input\"><i class=\"icon icon-envelope placeholder-icon\"></i> <input required=\"required\" type=\"email\" \nname=\"email\" ng-model=\"form.email\" disabled=\"disabled\" placeholder=\"user@example.com\"></label><label \nclass=\"item item-input\"><i class=\"icon ion-at placeholder-icon\"></i> <input required=\"required\" type=\"text\" \nname=\"username\" ng-model=\"form.username\" ng-minlength=\"4\" ng-maxlength=\"12\" ng-model-options=\"{debounce: 1000}\" \nng-pattern=\"/^[a-zA-Z\'. -]+$/\" placeholder=\"{{\'yourLogin\' | translate}}\"></label><div ng-if=\"myForm.username.$dirty\">\n<div ng-messages=\"myForm.email.$error\" class=\"validation-error\"><div ng-message=\"required\" \ntranslate=\"usernameRequired\"></div><div ng-message=\"email\" translate=\"usernameInUse\"></div></div><div \nng-messages=\"myForm.email.$pending\" class=\"validation-pending\"><div ng-message=\"email\" translate=\"checkingUsername\">\n</div></div></div><label class=\"item item-input\"><i class=\"icon icon-user placeholder-icon\"></i> <input required \ntype=\"name\" name=\"name\" ng-model=\"form.name\" placeholder=\"{{\'name\'|translate}}\"></label><label class=\"item item-input\">\n<i class=\"icon ion-pound placeholder-icon\"></i> <input required type=\"status\" name=\"status\" ng-model=\"form.status\" \nplaceholder=\"{{\'status\'|translate}}\"></label><button class=\"button button-block button-outline button-light\" \ntype=\"submit\" translate=\"{{\'submit\' | translate}}\"></button></form></div></ion-content></ion-view>");
$templateCache.put("app/main/user-followers/user-followers.html","<ion-view id=\"user-list\"><ion-nav-title><span translate=\"followersText\"></span></ion-nav-title><ion-header-bar \nclass=\"bar bar-subheader item-input-inset\"><label class=\"item-input-wrapper\"><i \nclass=\"icon ion-ios-search placeholder-icon\"></i> <input type=\"text\" ng-model=\"searchValue\" \nstyle=\"text-transform:lowercase\" placeholder=\"{{ \'searchText\' | translate }}\"></label><button \nclass=\"button button-positive button-clear\" ng-if=\"searchValue.length>1\" ng-click=\"clearSearch()\" translate=\"cancel\">\n</button></ion-header-bar><ion-content class=\"has-subheader\"><div class=\"center padding\" ng-if=\"vm.loading\">\n<ion-spinner></ion-spinner></div><div class=\"list\"><div ng-repeat=\"user in vm.users | filter:searchValue\"><a \nclass=\"item item-avatar item-button-right\"><img ng-src=\"{{ user.photo._url || \'img/user.png\'}}\" \nng-click=\"vm.openProfile(user)\"><h2 ng-click=\"vm.openProfile(user)\">{{user.username}}</h2><p>{{user.status}}</p><button\n class=\"button button-positive\" ng-class=\"{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}\" \nng-click=\"vm.follow(user)\"><div ng-show=\"!user.isFollow\" translate>Follow</div><div ng-show=\"user.isFollow\" translate>\nUnfollow</div></button> </a><span class=\"row\"><span class=\"col\" ng-repeat=\"gallery in user.galleries\"><img \nng-src=\"{{ gallery.imageThumb._url}}\" id=\"{{ ::gallery.id}}\"></span></span></div></div></ion-content></ion-view>");
$templateCache.put("app/main/user-following/user-following.html","<ion-view id=\"user-list\"><ion-nav-title><span translate=\"followingText\"></span></ion-nav-title><ion-header-bar \nclass=\"bar bar-subheader item-input-inset\"><label class=\"item-input-wrapper\"><i \nclass=\"icon ion-ios-search placeholder-icon\"></i> <input type=\"text\" ng-model=\"searchValue\" \nstyle=\"text-transform:lowercase\" placeholder=\"{{ \'searchText\' | translate }}\"></label><button \nclass=\"button button-positive button-clear\" ng-if=\"searchValue.length>1\" ng-click=\"clearSearch()\" translate=\"cancel\">\n</button></ion-header-bar><ion-content class=\"has-subheader\"><div class=\"center padding\" ng-if=\"vm.loading\">\n<ion-spinner></ion-spinner></div><div class=\"list\"><div ng-repeat=\"user in vm.users | filter:searchValue\"><a \nclass=\"item item-avatar item-button-right\"><img ng-src=\"{{ user.photo._url || \'img/user.png\'}}\" \nng-click=\"vm.openProfile(user)\"><h2 ng-click=\"vm.openProfile(user)\">{{user.username}}</h2><p>{{user.status}}</p><button\n class=\"button button-positive\" ng-class=\"{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}\" \nng-click=\"vm.follow(user)\"><div ng-show=\"!user.isFollow\" translate>Follow</div><div ng-show=\"user.isFollow\" translate>\nUnfollow</div></button> </a><span class=\"row\"><span class=\"col\" ng-repeat=\"gallery in user.galleries\"><img \nng-src=\"{{ gallery.imageThumb._url}}\" id=\"{{ ::gallery.id}}\"></span></span></div></div></ion-content></ion-view>");
$templateCache.put("app/main/user-intro/user-intro.html","<ion-view id=\"user-layout\" class=\"view-intro bg-animate\" cache-view=\"false\"><div class=\"bar bar-header\"><ion-language>\n</ion-language></div><ion-content scroll=\"false\"><div class=\"intro-slider\"><ion-slide-box active-slide=\"slideIndex\" \nshow-pager=\"true\" on-slide-changed=\"vm.slideChanged($index)\"><ion-slide ng-repeat=\"item in vm.slides track by $index\">\n<div class=\"content\" ng-if=\"$index == vm.slideIndex\"><span class=\"top\"><h2>{{ item.text | translate }}</h2></span><div \nclass=\"phone {{ vm.device }}\"><img ng-src=\"{{ item.img }}\"></div></div></ion-slide></ion-slide-box></div><button \nclass=\"button button-positive button-fab left\" ng-if=\"vm.slideIndex\" ng-click=\"vm.previous()\"><i \nclass=\"icon ion-ios-arrow-left\"></i></button> <button class=\"button button-positive button-fab right\" \nng-hide=\"vm.slideIndex === vm.slides.length-1\" ng-click=\"vm.next()\"><i class=\"icon ion-ios-arrow-right\"></i></button>\n</ion-content><ion-footer-bar><facebook-login></facebook-login><div class=\"row\"><button \nclass=\"button button-block button-calm\" translate=\"register\" signup-modal></button> <button \nclass=\"button button-block button-positive\" translate=\"signin\" signin-modal></button></div></ion-footer-bar></ion-view>");
$templateCache.put("app/main/user-layout/user-layout.html","<ion-view id=\"user-layout\" class=\"bg-animate\"><ion-content padding=\"false\"><ion-nav-view></ion-nav-view></ion-content>\n</ion-view>");
$templateCache.put("app/main/user-likers/user-likers.html","<ion-view id=\"user-list\"><ion-nav-title><span translate=\"likersText\"></span></ion-nav-title><ion-header-bar \nclass=\"bar bar-subheader item-input-inset\"><label class=\"item-input-wrapper\"><i \nclass=\"icon ion-ios-search placeholder-icon\"></i> <input type=\"text\" ng-model=\"searchValue\" \nstyle=\"text-transform:lowercase\" placeholder=\"{{ \'searchText\' | translate }}\"></label><button \nclass=\"button button-positive button-clear\" ng-if=\"searchValue.length>1\" ng-click=\"clearSearch()\" translate=\"cancel\">\n</button></ion-header-bar><ion-content class=\"has-subheader\"><div class=\"center padding\" ng-if=\"vm.loading\">\n<ion-spinner></ion-spinner></div><div class=\"list\"><div ng-repeat=\"user in vm.users | filter:searchValue\"><a \nclass=\"item item-avatar item-button-right\"><img ng-src=\"{{ user.photo._url || \'img/user.png\'}}\" \nng-click=\"vm.openProfile(user)\"><h2 ng-click=\"vm.openProfile(user)\">{{user.username}}</h2><p>{{user.status}}</p><button\n class=\"button button-positive\" ng-class=\"{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}\" \nng-click=\"vm.follow(user)\"><div ng-show=\"!user.isFollow\" translate>Follow</div><div ng-show=\"user.isFollow\" translate>\nUnfollow</div></button> </a><span class=\"row\"><span class=\"col\" ng-repeat=\"gallery in user.galleries\"><img \nng-src=\"{{ gallery.imageThumb._url}}\" id=\"{{ ::gallery.id}}\"></span></span></div></div></ion-content></ion-view>");
$templateCache.put("app/main/user-list/user-list.html","<ion-view id=\"user-list\" cache-view=\"true\"><ion-nav-title><span translate=\"findPeople\"></span></ion-nav-title>\n<ion-header-bar class=\"bar bar-{{theme}} bar-subheader item-input-inset\"><label class=\"item-input-wrapper\"><i \nclass=\"icon ion-ios-search placeholder-icon\"></i> <input type=\"text\" ng-model=\"searchValue\" \nstyle=\"text-transform:lowercase\" placeholder=\"{{ \'searchText\' | translate }}\"></label><button \nclass=\"button button-positive button-clear\" ng-if=\"searchValue.length>1\" ng-click=\"clearSearch()\" translate=\"cancel\">\n</button></ion-header-bar><ion-content class=\"has-subheader\"><div class=\"center padding\" ng-if=\"showErrorView\"><div \nclass=\"error\"><i class=\"icon icon-large ion-ios-cloud-download-outline\"></i><p>{{ \"errorText\" | translate }}</p><button\n class=\"button button-primary\" ng-click=\"onReload()\">{{ \"tryAgainText\" | translate }}</button></div></div><div \nclass=\"center padding\" ng-if=\"showEmptyView\"><div class=\"error\"><i class=\"icon icon-large ion-android-alert\"></i><p>\n{{ \"galleriesNotFoundText\" | translate }}</p></div></div><ion-refresher pulling-text=\"{{\'loadingText\'| translate}}\" \non-refresh=\"onReload()\"></ion-refresher><div class=\"center padding\" ng-if=\"loading &&!data.length\"><ion-spinner>\n</ion-spinner></div><div class=\"list\"><div ng-repeat=\"user in data | filter:searchValue \"><a \nclass=\"item item-avatar item-button-right\"><img ng-src=\"{{ user.photo._url || \'img/user.png\'}}\" \nng-click=\"openProfile(user)\"><h2 ng-click=\"openProfile(user)\">{{user.username}}</h2><p>{{user.status}}</p><button \nclass=\"button button-positive\" ng-disabled=\"user.loading\" \nng-class=\"{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}\" ng-click=\"follow(user)\"><div \nng-show=\"!user.isFollow\" translate>Follow</div><div ng-show=\"user.isFollow\" translate>Unfollow</div></button> </a><span\n class=\"row\"><span class=\"col\" ng-repeat=\"gallery in user.galleries\"><img ng-src=\"{{ gallery.imageThumb._url}}\" \nid=\"{{ ::gallery.id}}\"></span></span></div></div><ion-infinite-scroll on-infinite=\"onLoadMore()\" \nng-if=\"moreDataCanBeLoaded\" spinner distance=\"1%\"></ion-infinite-scroll></ion-content></ion-view>");
$templateCache.put("app/main/user-merge/merge.html","<ion-view id=\"user-layout\" class=\"bg-animate\" cache-view=\"false\"><ion-content class=\"view-avatar padding\"><div \nclass=\"row step1\"><div class=\"col\"><img class=\"avatar\" user-avatar \nng-src=\"{{ tempUser.attributes.photo._url || \'./img/user.png\' }}\"></div></div><div class=\"step2\"><form name=\"myForm\" \nnovalidate=\"novalidate\" ng-submit=\"submitMerge(myForm, form)\"><label class=\"item item-input\"><i \nclass=\"icon icon-envelope placeholder-icon\"></i> <input required=\"required\" type=\"email\" name=\"email\" \nng-model=\"form.email\" disabled=\"disabled\" placeholder=\"user@example.com\"></label><label class=\"item item-input\"><i \nclass=\"icon icon-user placeholder-icon\"></i> <input required=\"required\" type=\"text\" name=\"username\" \nng-model=\"form.username\" username-validator ng-minlength=\"4\" ng-maxlength=\"12\" ng-model-options=\"{debounce: 1000}\" \nng-pattern=\"/^[a-zA-Z\'. -]+$/\" placeholder=\"{{\'yourLogin\' | translate}}\"></label><div ng-if=\"myForm.username.$dirty\">\n<div ng-messages=\"myForm.email.$error\" class=\"validation-error\"><div ng-message=\"required\" \ntranslate=\"usernameRequired\"></div><div ng-message=\"email\" translate=\"usernameInUse\"></div></div><div \nng-messages=\"myForm.email.$pending\" class=\"validation-pending\"><div ng-message=\"email\" translate=\"checkingUsername\">\n</div></div></div><label class=\"item item-input\"><i class=\"icon icon-lock placeholder-icon\"></i> <input required \ntype=\"password\" name=\"password\" ng-model=\"form.password\" placeholder=\"{{\'password\'|translate}}\"></label><button \nclass=\"button button-block button-outline button-light\" type=\"submit\" translate=\"{{\'submit\' | translate}}\"></button>\n</form></div><div class=\"padding step3\"><button ng-click=\"vm.submit(rForm, vm.form)\" \nclass=\"button button-block button-facebook\"><i class=\"icon ion-social-facebook\"></i> <span translate=\"mergeAccount\">\n</span></button></div></ion-content></ion-view>");
$templateCache.put("app/component/ion-photo/view/filter.modal.html","<ion-modal-view id=\"photo-filter\"><ion-header-bar class=\"bar bar-{{theme}}\"><button \nclass=\"button button-clear button-icon ion-ios-arrow-thin-left\" ng-click=\"closeModalFilter()\"></button><div \nclass=\"title\">{{ \'Filter\' | translate }}</div><button class=\"button button-icon\" ng-click=\"submitFilter()\"><i \nclass=\"icon ion-ios-arrow-thin-right\"></i></button></ion-header-bar><ion-content><div class=\"box-image\"><img \nid=\"image\" src=\"{{form.photo}}\" ng-hide=\"loading\"><ion-spinner ng-show=\"loading\"></ion-spinner></div><img id=\"image3\" \nsrc=\"\" style=\"display: none\"><div ng-show=\"showFilter\" class=\"slider-filters animate1\"><ion-scroll direction=\"x\" \nclass=\"image-filter\"><a ng-repeat=\"filter in imageFilters\" ng-click=\"applyFilter(filter)\"><p>{{ filter.name }}</p><img \nid=\"{{filter.id}}\" class=\"img-filter\" src=\"\"></a></ion-scroll><div class=\"row\"><div class=\"col\"><button \nclass=\"button button-block bold\">Filter</button></div><div class=\"col\"><button class=\"button button-block\" \nng-click=\"actionShowFilter(false)\">Edit</button></div></div></div><div ng-hide=\"showFilter\" class=\"slider-filters\"><div\n ng-show=\"filterEdit\" class=\"slider-filters\"><p class=\"text-center\">{{filter.name}}</p><div \nclass=\"item range range-positive\"><input type=\"range\" min=\"-100\" max=\"100\" ng-model=\"filter.slider.value\" \nng-model-options=\"{debounce:100}\" step=\"0.1\"></div><div class=\"row\"><div class=\"col\"><button \nclass=\"button button-block\" ng-click=\"cancelFilter(filter)\">Cancel</button></div><div class=\"col\"><button \nclass=\"button button-block bold\" ng-click=\"doneFilter()\">Done</button></div></div></div><div ng-show=\"!filterEdit\" \nclass=\"slider-filters\"><ion-scroll direction=\"x\"><a ng-repeat=\"filter in filters\" ng-click=\"selectFilter(filter)\"><p>\n{{ filter.name }}</p><i class=\"icon {{filter.icon}}\"></i> </a><a ng-click=\"reset()\"><p>Reset</p><i \nclass=\"icon ion-android-refresh\"></i></a></ion-scroll><div class=\"row\"><div class=\"col\"><button \nclass=\"button button-block\" ng-click=\"actionShowFilter(true)\">Filter</button></div><div class=\"col\"><button \nclass=\"button button-block bold\">Edit</button></div></div></div></div></ion-content></ion-modal-view>");
$templateCache.put("app/component/ion-photo/view/modal.share.photo.html","<ion-modal-view class=\"modal-share\"><ion-header-bar class=\"bar-dark\"><div class=\"title\">{{ ::\'Share\' | translate }}\n</div><button class=\"button button-positive\" ng-click=\"modal.hide()\"><i class=\"icon ion-arrow-right-b\"></i></button>\n</ion-header-bar><ion-content ng-cloak><div id=\"image\"><img ng-src=\"{{ ::form.photo}}\"><div class=\"title\">\n{{ ::form.title }}</div></div><ul class=\"list\"><li class=\"padding\"><button ng-repeat=\"social in sociais\" \nng-click=\"share(form, social)\" class=\"button button-block button-{{ social }}\"><i class=\"icon ion-social-{{ social }}\">\n</i> {{ ::social | uppercase }}</button></li></ul></ion-content></ion-modal-view>");}]);
}());
