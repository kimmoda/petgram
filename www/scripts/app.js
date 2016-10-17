(function () {
    'use strict';

    angular.module('starter', [
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
        'angulartics',
        'angulartics.google.analytics',
        'jett.ionic.scroll.sista',
        'ion-affix',
        'ngCordova',
        'ImgCache',
        'ionic.components',
        'angulartics.google.analytics.cordova',
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
            'tmh.dynamicLocale', // angular-dynamic-locale,
            'angularMoment' // https://github.com/urish/angular-moment
        ])
        .config(configLanguage)
        .run(runMoment);


    function runMoment(amMoment, AppConfig) {
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

        amMoment.changeLocale(language);
    }

    function configLanguage($translatePartialLoaderProvider, $translateProvider, AppConfig, tmhDynamicLocaleProvider) {

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.useSanitizeValueStrategy(null);

        // Translate Config
        $translateProvider.useMissingTranslationHandlerLog();
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
           .directive('ionSlideshow', function ($ionicPopup, $ionicPopover, $rootScope, Loading, $translate, User, Gallery, Toast, $ionicModal) {
               return {
                   restrict: 'A',
                   scope   : {
                       ngModel: '=',
                       index  : '=',
                       canEdit: '='
                   },
                   link    : link
               };

               function link($scope, elem, attr) {

                   elem.bind('click', function () {
                       $scope.allImages   = $scope.ngModel;
                       $scope.activeSlide = $scope.index;

                       // Start Index
                       $scope.indexActual = $scope.index;

                       console.log($scope.index);

                       $ionicModal.fromTemplateUrl('app/component/ion-slideshow/image-popover.html', {
                           scope: $scope,
                       }).then(function (modal) {
                           $scope.modal = modal;
                           $scope.modal.show();
                       });

                       $scope.slideChanged = function (index) {
                           $scope.indexActual = index;
                       };

                       // Popover
                       $scope.openPopover  = function ($event) {
                           $ionicPopover.fromTemplateUrl('app/component/ion-slideshow/ion-slideshow.popover.html', {
                               scope: $scope
                           }).then(function (popover) {
                               $scope.slidepopover = popover;
                               $scope.slidepopover.show($event);
                           });
                       };
                       $scope.closePopover = function () {
                           $scope.slidepopover.hide();
                       };


                       $scope.editPhoto = function () {
                           $scope.closePopover();
                       };


                       $scope.deletePhoto = function () {
                           var index   = $scope.indexActual;
                           var gallery = $scope.allImages[index];
                           $scope.closePopover();

                           $ionicPopup
                               .confirm({
                                   title   : $translate.instant('deleteGalleryConfirmText'),
                                   template: $translate.instant('areSure')
                               })
                               .then(function (res) {
                                   if (res) {
                                       Loading.start();
                                       Gallery.get(gallery.id).then(function (gallery) {
                                           if (gallery) {
                                               Gallery.destroy(gallery).then(function () {
                                                   console.log('Photo deleted');
                                                   Toast.alert({
                                                       title: 'Photo',
                                                       text : 'Photo deleted'
                                                   });
                                                   $rootScope.$emit('photogrid:modal:reload', true);
                                                   $scope.closeModal();
                                                   Loading.end();
                                               });
                                           } else {
                                               $scope.onReload();
                                               Loading.end();
                                           }
                                       }).catch(function () {
                                           $scope.onReload();
                                           Loading.end();
                                       })

                                   }
                               });
                       };

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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-53950213-6', { 'cookieDomain': 'none' });
(function () {
    'use strict';

    angular
        .module('starter')
        .run(startParse)
        // Ionic Configuration
        .config(configIonic)
        .run(runIonic)
        // Facebook
        .run(runFacebook)
        .config(configFacebook)
        // ImgCache
        .run(runImgCache)
        .config(configImgCache)
        // AngularJS Perfomance
        .config(configCompile)
    ;


    function configImgCache(ImgCacheProvider) {
        // or more options at once
        ImgCacheProvider.setOptions({
            debug             : false,
            usePersistentCache: true
        });

        // ImgCache library is initialized automatically,
        // but set this option if you are using platform like Ionic -
        // in this case we need init imgcache.js manually after device is ready
        ImgCacheProvider.manualInit = true;
    }

    function runImgCache($ionicPlatform, ImgCache) {
        $ionicPlatform.ready(function () {

            // IMG Cache
            ImgCache.$init();
        });
    }

    function configCompile($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

    function startParse(AppConfig, Parse, $ionicPlatform, ParsePush, $localStorage, $location, $rootScope) {

        // Parse Start
        Parse.init({
            appId : AppConfig.parse.appId,
            server: AppConfig.parse.server,
        });

        // Parse User is Null
        if (!$rootScope.currentUser) {
            $location.path('/');
        }

        // Parse Push Notification
        $ionicPlatform.ready(function () {
            var user = Parse.User.current();
            if (user) {
                ParsePush.init();

            }
        })

        if (!$localStorage.unit) {
            $localStorage.unit = AppConfig.map.unit;
        }

        if (!$localStorage.mapType) {
            $localStorage.mapType = AppConfig.map.type;
        }
    }

    function runIonic($ionicPlatform, $rootScope, amMoment, $translate, $cordovaGlobalization, $cordovaSplashscreen, AppConfig) {

        // Set Theme Color
        $rootScope.theme = AppConfig.theme;

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                window.StatusBar.styleLightContent();
            }


            var lang = $translate.use();
            if (lang) {
                $translate.use(lang);
                amMoment.changeLocale(lang);

            } else {
                if (typeof navigator.globalization !== 'undefined') {
                    $cordovaGlobalization.getPreferredLanguage().then(function (language) {
                        $translate.use((language.value).split('-')[0]);
                        amMoment.changeLocale(language.value);
                    }, null);
                }
            }
            // Remove back button android
            //$ionicPlatform.registerBackButtonAction(function (event) {
            //    event.preventDefault();
            //}, 100);


            // Hide Splash Screen
            if (navigator && navigator.splashscreen) {
                $cordovaSplashscreen.hide();
            }


            //ConnectMonitor.watch();
            //
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
        //$ionicConfigProvider.views.maxCache(1);
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
            var LangVar     = window.navigator.language || window.navigator.userLanguage;
            var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js     = d.createElement(s);
                js.id  = id;
                js.src = 'https://connect.facebook.net/' + userLangVar + '/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

    }

})
();

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
            theme          : 'positive',
            facebookAppId  : '1024016557617380',
            parse          : {
                appId : 'myAppId',
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
            preferredLocale: 'en'
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

            .state('avatar', {
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
                    User.logOut();
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

    function signinModalDirective($ionicModal, Loading, User, $translate, $state, Toast, $ionicPopup, AppConfig, $rootScope) {
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
                        User.signIn(form).then(function (data) {
                            console.log(data);
                            $rootScope.currentUser = data;
                            $state.go($scope.routeLogged, {
                                clear: true
                            });
                            $scope.closeModal();
                            $rootScope.$emit('photolist:reload');
                            Loading.end();
                        }).catch(function (resp) {
                            Toast.alert({
                                title: 'Error',
                                text : $translate.instant('incorrectEmail')
                            });
                            Loading.end();
                        });
                    } else {
                        return false;
                    }
                };


                $scope.forgotPass = function () {

                    // An elaborate, custom popup
                    $scope.data = {};
                    $ionicPopup.show({
                        template: '<input type="email" ng-model="data.email">',
                        title   : $translate.instant('recoveryPass'),
                        subTitle: $translate.instant('fillEmail'),
                        scope   : $scope,
                        buttons : [
                            {text: $translate.instant('cancel')},
                            {
                                text : '<b >' + $translate.instant('submit') + '</b>',
                                type : 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.data.email) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        Loading.start();
                                        User.recoverPassword($scope.data.email).then(function (resp) {
                                            Toast.alert({
                                                title: 'Alert',
                                                text : $translate.instant('recoverySuccess')
                                            });
                                            Loading.end();
                                        });
                                    }
                                }
                            }
                        ]
                    });

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
                                $state.go('avatar', {
                                    clear: true
                                });
                                Loading.end();
                                $rootScope.$emit('photolist:reload');
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

                $rootScope.$on('photogrid:modal:reload', init);

                function init() {
                    $scope.loading = true;
                    Gallery.getAlbum({id: $scope.album}).then(function (data) {
                        console.log(data);
                        $scope.title   = data.album.attributes.title;
                        $scope.data    = data.photos;
                        $scope.loading = false;
                        $scope.$apply();
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
                if(viewValue) {
                console.log(elem, viewValue);
                    return User.validateEmail(viewValue);
                }
            }
        }
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, $state, $q, $translate, AppConfig, Facebook, Dialog, User, $rootScope) {
        return {
            restrict: 'E',
            link    : facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ me.name || \'loginWithFacebook\'| translate}}</span> </button>',
        };

        function facebookLoginLink(scope, elem, attr) {

            scope.facebookStatus = null;

            elem.bind('click', onLoginViaFacebook);


            function onLoginViaFacebook() {

                Facebook.getCurrentUser().then(function (response) {

                    if (response.status === 'connected') {
                        processFacebookLogin(response);
                    } else {
                        Facebook.logIn().then(function (authData) {
                            processFacebookLogin(authData);
                        });
                    }
                });
            }

            function processFacebookLogin(fbAuthData) {

                Loading.start('Conectando com o Facebook')
                var fbData, newUser;

                return Facebook.me().then(function (data) {
                    fbData = data;
                    return User.findByEmail(data.email);
                }).then(function (user) {

                    if (!user.id) {
                        newUser = true;
                        return User.signInViaFacebook(fbAuthData);
                    }

                    var authData = user.get('authData');
                    if (authData) {
                        if (authData.facebook.id === fbData.id) {
                            return User.signInViaFacebook(fbAuthData);
                        }
                    } else {
                        var deferred = $q.defer();
                        deferred.reject('Facebook error');
                        return deferred.promise;
                    }
                }).then(function () {
                    return User.updateWithFacebookData(fbData);
                }).then(function (user) {
                    $rootScope.currentUser = user;
                    $rootScope.$broadcast('onUserLogged');
                    Loading.end();
                    if (newUser) {
                        $state.go('avatar', {clear: true})
                    } else {
                        $state.go(AppConfig.routes.home, {clear: true});
                    }
                    Loading.end();
                }, function (error) {
                    Loading.end();
                    Dialog.alert(error);
                })
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

    function galleryAlbumModalDirective($ionicModal, AppConfig, $q, GalleryAlbum, $rootScope) {
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
                $scope.theme = AppConfig.theme;


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

    function galleryNewAlbumModalDirective($ionicModal, AppConfig, $q, $rootScope, GalleryAlbum) {
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
                $scope.theme = AppConfig.theme;

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
                $scope.loading             = false;
                $scope.moreDataCanBeLoaded = true;
                $scope.showEmptyView       = false;
                $scope.showErrorView       = false;

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

    function photoLikeDirective(Gallery, $timeout) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '=',
                loading: '='
            },
            link    : function (scope, elem) {
                elem.bind('click', function () {
                        if (scope.loading) return;
                        var _model      = scope.ngModel;
                        _model.progress = true;
                        _model.liked    = !_model.liked;
                        scope.loading   = true;

                        Gallery.likeGallery({galleryId: scope.ngModel.id}).then(function (resp) {
                            _model.likes    = resp.likes;
                            _model.progress = false;
                            if (resp.action === 'like') {
                                scope.ngModel.isLiked = true;
                                scope.ngModel.likesTotal += 1;
                            }

                            if (resp.action === 'unlike') {
                                scope.ngModel.isLiked = false;
                                scope.ngModel.likesTotal -= 1;
                            }

                            scope.loading = false;
                            scope.$apply();
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

    function photoListDirective(Gallery, $rootScope, Loading, $ionicPopup, $translate, $state, Share, Toast, FeedbackModal, $ionicActionSheet) {

        return {
            restrict   : 'E',
            scope      : {
                username  : '=',
                profile   : '=',
                load      : '=',
                openLikers: '=',
                onReload  : '=',
                id        : '=',
                type      : '='
            },
            templateUrl: 'app/directive/photoListDirective.html',
            link       : photoListController
        };

        function photoListController($scope, elem, attr) {
            $scope.params = {};

            $rootScope.$on('photolist:reload', function (ev, value) {
                console.log('Reload photolist', value);
                if (value) {
                    $scope.params.privacity = value;
                }
                init()
                loadFeed();
            });

            if ($scope.type) {
                $scope.params.privacity = $scope.type;
            }

            init();

            var currentUser = Parse.User.current();

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

            $scope.share = function (item) {
                var itemShare = {
                    title   : item.title,
                    image   : item.image.url(),
                    userName: item.user.name,
                    url     : 'http://market.ionic.io/starters/photogram-ionic-instagram-clone',
                };
                console.log(item, itemShare);
                Share.open();
            };


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (data) {
                    if (data.length > 0) {
                        $scope.params.page++;
                        data.map(function (item) {
                            if (item.album) {
                                item.canEdit = (currentUser.id === item.album.attributes.user.id) ? true : false;
                            } else {
                                item.canEdit = false;
                            }
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
                $scope.params.page         = 1;
                $scope.data                = [];
                $scope.loading             = false;
                $scope.moreDataCanBeLoaded = true;
                $scope.showEmptyView       = false;
                $scope.showErrorView       = false;

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

                if (Parse.User.current().id === gallery.user.id) {
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
                                            if (gallery) {
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
                                        }).catch(function () {
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

    function settingsModalDirective($ionicModal, $translate, AppConfig, amMoment, $cordovaInAppBrowser, Share, Auth, User, $state) {

        return {
            restrict: 'A',
            template: '',
            link    : function (scope, elem) {

                elem.bind('click', openModal);
                scope.share = Share.share;

                scope.logout = function () {
                    $state.go('logout');
                    scope.closeSettingModal();
                };

                function init() {
                    scope.form      = Auth.getLoggedUser();
                    scope.languages = AppConfig.locales;
                    scope.language  = $translate.use();
                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('app/directive/settings-modal.html', {
                        scope: scope
                    }).then(function (modal) {
                        scope.modalSetting = modal;
                        scope.modalSetting.show();

                    });

                    scope.$on('changeLanguage', function (ev, value) {
                        User.update({lang: value});
                        console.log(value);
                        amMoment.changeLocale(value.code);
                        $translate.use(value.code);
                    });

                    scope.closeSettingModal = function () {
                        scope.modalSetting.hide();
                        scope.modalSetting.remove();
                    };

                    scope.link = function (sref) {
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
(function () {
    'use strict';

    angular.module('starter').directive('validated', validatedDirective);

    function validatedDirective() {
        return {
            restrict: 'AEC',
            require : '^form',
            link    : function (scope, element, attrs, form) {
                var inputs = element.find("*");
                for (var i = 0; i < inputs.length; i++) {
                    (function (input) {
                        var attributes = input.attributes;
                        if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
                            var field = form[attributes.name.value];
                            if (field != void 0) {
                                scope.$watch(function () {
                                    return form.$submitted + "_" + field.$valid;
                                }, function () {
                                    if (form.$submitted != true) return;
                                    var inp = angular.element(input);
                                    if (inp.hasClass('ng-invalid')) {
                                        element.removeClass('has-success');
                                        element.addClass('has-error');
                                    } else {
                                        element.removeClass('has-error').addClass('has-success');
                                    }
                                });
                            }
                        }
                    })(inputs[i]);
                }
            }
        }
    }

})();
(function () {
    'use strict';

    angular.module('starter').directive('onSubmit', validatedSubmitDirective);

    function validatedSubmitDirective($parse, $timeout) {
        return {
            require : '^form',
            restrict: 'A',
            link    : function (scope, element, attrs, form) {
                form.$submitted = false;
                var fn          = $parse(attrs.onSubmit);
                element.on('submit', function (event) {
                    scope.$apply(function () {
                        element.addClass('ng-submitted');
                        form.$submitted = true;
                        if (form.$valid) {
                            if (typeof fn === 'function') {
                                fn(scope, {$event: event});
                            }
                        }
                    });
                });
            }
        }
    }

})();
//! moment.js locale configuration
//! locale : German [de]
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Mikolaj Dadela : https://github.com/mik01aj

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    function processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Minute', 'einer Minute'],
            'h': ['eine Stunde', 'einer Stunde'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var de = moment.defineLocale('de', {
        months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
        monthsParseExact : true,
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd, D. MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay: '[heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sekunden',
            m : processRelativeTime,
            mm : '%d Minuten',
            h : processRelativeTime,
            hh : '%d Stunden',
            d : processRelativeTime,
            dd : processRelativeTime,
            M : processRelativeTime,
            MM : processRelativeTime,
            y : processRelativeTime,
            yy : processRelativeTime
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return de;

}));
//! moment.js locale configuration
//! locale : Persian [fa]
//! author : Ebrahim Byagowi : https://github.com/ebraminio

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var symbolMap = {
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹',
        '0': '۰'
    }, numberMap = {
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9',
        '۰': '0'
    };

    var fa = moment.defineLocale('fa', {
        months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
        monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
        weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
        weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
        weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        meridiemParse: /قبل از ظهر|بعد از ظهر/,
        isPM: function (input) {
            return /بعد از ظهر/.test(input);
        },
        meridiem : function (hour, minute, isLower) {
            if (hour < 12) {
                return 'قبل از ظهر';
            } else {
                return 'بعد از ظهر';
            }
        },
        calendar : {
            sameDay : '[امروز ساعت] LT',
            nextDay : '[فردا ساعت] LT',
            nextWeek : 'dddd [ساعت] LT',
            lastDay : '[دیروز ساعت] LT',
            lastWeek : 'dddd [پیش] [ساعت] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'در %s',
            past : '%s پیش',
            s : 'چندین ثانیه',
            m : 'یک دقیقه',
            mm : '%d دقیقه',
            h : 'یک ساعت',
            hh : '%d ساعت',
            d : 'یک روز',
            dd : '%d روز',
            M : 'یک ماه',
            MM : '%d ماه',
            y : 'یک سال',
            yy : '%d سال'
        },
        preparse: function (string) {
            return string.replace(/[۰-۹]/g, function (match) {
                return numberMap[match];
            }).replace(/،/g, ',');
        },
        postformat: function (string) {
            return string.replace(/\d/g, function (match) {
                return symbolMap[match];
            }).replace(/,/g, '،');
        },
        ordinalParse: /\d{1,2}م/,
        ordinal : '%dم',
        week : {
            dow : 6, // Saturday is the first day of the week.
            doy : 12 // The week that contains Jan 1st is the first week of the year.
        }
    });

    return fa;

}));
//! moment.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var pt_br = moment.defineLocale('pt', {
        months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
        weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
        },
        calendar : {
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
        relativeTime : {
            future : 'em %s',
            past : '%s atrás',
            s : 'poucos segundos',
            m : 'um minuto',
            mm : '%d minutos',
            h : 'uma hora',
            hh : '%d horas',
            d : 'um dia',
            dd : '%d dias',
            M : 'um mês',
            MM : '%d meses',
            y : 'um ano',
            yy : '%d anos'
        },
        ordinalParse: /\d{1,2}º/,
        ordinal : '%dº'
    });

    return pt_br;

}));
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
    angular.module('starter').factory('Auth', function (Parse, $q) {

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
        .factory('DataUtil', DataUtilFactory);

    function DataUtilFactory() {

        return {
            parseData   : parseData,
            parseString : parseString,
            getDate     : getDate,
            formatDate  : formatDate,
            getMonthName: getMonthName,
            getFirstDay : getFirstDay,
            getLastDay  : getLastDay
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
            var meses = [
                'Janeiro',
                'Feveiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro'
            ];
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
    angular.module('starter').factory('GalleryActivity', function (Parse) {

        var fields = [
            'title',
            'gallery',
            'image',
            'imageThumb',
            'fromUser',
            'toUser',
        ];

        var ParseObject = Parse.Object.extend('GalleryActivity', {}, {
            get    : get,
            create : put,
            update : put,
            destroy: destroy,
            feed   : feed,
            all    : all,
        });

        function feed(params) {
            return Parse.Cloud.run('feedActivity', params);
        }

        function all(params) {
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

            query.include(['gallery', 'fromUser', 'toUser']);
            query.limit(params.limit);
            query.skip((params.page * params.limit) - params.limit);
            return query.find();
        }

        // Parse Crud
        function get(galleryId) {
            return new Parse.Query(this).include('profile').get(galleryId);
        }

        function put(item) {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            item.lang = $translate.use();

            if (!item.id) {
                var objPlace = new ParseObject();
                return objPlace.save(item);
            } else {
                return item.save();
            }

        }

        function destroy(item) {
            return item.destroy();
        }

        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
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

        return ParseObject;

    });

})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryAlbum', GalleryFactory);

    function GalleryFactory(Parse) {

        var fields = [
            'title',
            'qtyPhotos',
            'image',
            'imageThumb'
        ];

        var ParseObject = Parse.Object.extend('GalleryAlbum', {}, {
            get    : get,
            create : put,
            update : put,
            destroy: destroy,
            photos : photos,
            list   : list
        });

        function list(params) {
            return Parse.Cloud.run('listAlbum', params);
        }

        function photos(params) {
            return Parse.Cloud.run('photoAlbum', params);
        }

        // Parse Crud
        function get(galleryId) {
            return new Parse.Query(this).include('profile').get(galleryId);
        }

        function put(item) {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            item.lang = $translate.use();

            if (!item.id) {
                var objPlace = new ParseObject();
                return objPlace.save(item);
            } else {
                return item.save();
            }

        }

        function destroy(item) {
            return item.destroy();
        }

        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
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


        return ParseObject;

    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryComment', GalleryComment);

    function GalleryComment(Parse) {

        var fields = [
            'text',
            'user',
        ];

        var ParseObject = Parse.Object.extend('GalleryComment', {}, {
            get    : get,
            create : put,
            update : put,
            destroy: destroy,
            all    : all,
        });


        function all(params) {
            var query = new Parse.Query(this);
            // Order Table
            query.include('user');
            query.ascending('createdAt');
            query.equalTo('gallery', params.gallery);
            query.limit(params.limit);
            query.skip((params.page * params.limit) - params.limit);
            return query.find();
        }

        // Parse Crud
        function get(galleryId) {
            return new Parse.Query(this).include('profile').get(galleryId);
        }

        function put(item) {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            item.lang = $translate.use();

            if (!item.id) {
                var objPlace = new ParseObject();
                return objPlace.save(item);
            } else {
                return item.save();
            }

        }

        function destroy(item) {
            return item.destroy();
        }

        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
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

        return ParseObject;

    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('Gallery', Gallery);

    function Gallery(Parse) {

        var fields = [
            'title',
            'commentsTotal',
            'likesTotal',
            'user',
            'profile',
            'hashtags',
            'words',
            'privacity',
            'address',
            'lang',
            'image',
            'imageThumb',
            'isApproved',
            'expiresAt',
            'icon',
        ];

        var ParseObject = Parse.Object.extend('Gallery', {}, {
            get        : get,
            create     : put,
            update     : put,
            destroy    : destroy,
            all        : all,
            comments   : comments,
            getAlbum   : getAlbum,
            feed       : feed,
            search     : search,
            follow     : follow,
            likeGallery: likeGallery,
        });

        function likeGallery(params) {
            return Parse.Cloud.run('likeGallery', {galleryId: params.galleryId});
        }

        function follow(params) {
            return Parse.Cloud.run('followUser', params);
        }

        function search(params) {
            return Parse.Cloud.run('searchGallery', params);
        }

        function feed(params) {
            return Parse.Cloud.run('feedGallery', params);
        }

        function comments(params) {
            return Parse.Cloud.run('commentGallery', params);
        }

        function getAlbum(params) {
            return Parse.Cloud.run('getAlbum', params);
        }

        function all(params) {
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
            return query.find();
        }

        // Parse Crud
        function get(galleryId) {
            return new Parse.Query(this).include('profile').get(galleryId);
        }

        function put(item) {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            item.lang = $translate.use();

            if (!item.id) {
                var objPlace = new ParseObject();
                return objPlace.save(item);
            } else {
                return item.save();
            }

        }

        function destroy(item) {
            return item.destroy();
        }


        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
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


        return ParseObject;

    }


})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryFeedback', GalleryFeedback);

    function GalleryFeedback(Parse) {

        var fields      = [
            'subject',
            'message',
            'user',
        ];
        var ParseObject = Parse.Object.extend('GalleryFeedback', {}, {
            create: put,

        });

        function put(item) {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            item.lang = $translate.use();

            if (!item.id) {
                var objPlace = new ParseObject();
                return objPlace.save(item);
            } else {
                return item.save();
            }

        }

        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
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

        return ParseObject;

    }

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
    angular.module('starter').factory('ParseFile', ParseFile);

    function ParseFile(Parse, $q) {
        return {
            upload: upload
        };

        function upload(file, ext) {
            var defer    = $q.defer();
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
    }

})();

(function () {
    'use strict';
    angular.module('starter').factory('ParsePush', ParsePushFactory);

    function ParsePushFactory(Parse, $q) {

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
    angular.module('starter').factory('Parse', ParseFactory);

    function ParseFactory($window, $rootScope) {
        var Parse  = $window.Parse;
        Parse.init = init;

        return Parse;

        function init(options) {
            Parse.initialize(options.appId);
            Parse.serverURL        = options.server;
            $rootScope.currentUser = Parse.User.current();
        }

    }

})();
(function () {
    'use strict';
    angular.module('starter').factory('Share', ShareFactory);

    function ShareFactory($cordovaSocialSharing) {

        var TAG = 'ShareService';

        return {
            open: open
        };

        function open(item) {
            if (window.cordova && item) {
                //.share(message, subject, file, link)
                $cordovaSocialSharing.share(item.title, item.userName, item.image, item.url).then(function (result) {
                    console.log(result);
                }, function (err) {
                    console.warn(err);
                });
            } else {
                console.warn('[' + TAG + '] Unsupported platform');
            }
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

    function UserFactory($q, $translate, $window, $cordovaDevice, Parse, ParsePush) {

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

        var ParseObject = Parse.User.extend({}, {
            profile               : profile,
            list                  : list,
            getFollowers          : getFollowers,
            getLikers             : getLikers,
            getFollowing          : getFollowing,
            signIn                : signIn,
            signUp                : signUp,
            signInViaFacebook     : signInViaFacebook,
            updateWithFacebookData: updateWithFacebookData,
            logOut                : logOut,
            findByEmail           : findByEmail,
            getPublicData         : getPublicData,
            recoverPassword       : recoverPassword,
            destroy               : destroy,
            setPhoto              : setPhoto,
            follow                : follow,
            all                   : all,
            validateUsername      : validateUsername,
            validateEmail         : validateEmail,
            update                : update,
            fetch                 : fetch

        });

        function fetch() {
            var defer = $q.defer();
            if (Parse.User.current()) {
                Parse.User.current().fetch().then(defer.resolve, defer.reject);
            } else {
                defer.reject();
            }
            return defer.promise;
        }


        function update(params) {
            var user    = Parse.User.current();
            // User Language
            params.lang = $translate.use();

            angular.forEach(params, function (value, key) {
                user.set(key, value);
            });
            return user.save();
        }

        function setPhoto(parseFile) {
            return Parse.User.current().set({'photo': parseFile}).save();
        }

        function recoverPassword(email) {
            return Parse.User.requestPasswordReset(email);
        }

        function getPublicData(user) {
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
        }


        function logOut() {
            //return Parse.User.logOut();
            console.log(Parse.applicationId);
            delete $window.localStorage['Parse/' + Parse.applicationId + '/currentUser'];
            delete $window.localStorage['Parse/' + Parse.applicationId + '/installationId'];
        }

        function updateWithFacebookData(data) {
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
        }

        function signInViaFacebook(authData) {

            var facebookAuthData = {
                id             : authData.authResponse.userID,
                access_token   : authData.authResponse.accessToken,
                expiration_date: (new Date().getTime() + 1000).toString()
            };
            return Parse.FacebookUtils.logIn(facebookAuthData);
        }

        function signUp(data) {
            return new Parse.User()
                .set({'name': data.name})
                .set({'username': data.username})
                .set({'email': data.email})
                .set({'password': data.password})
                .set({'roleName': 'User'})
                .signUp(null);

        }

        function signIn(obj) {
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
        }

        function destroy(data) {
            return Parse.Cloud.run('destroyUser', data);
        }

        function validateEmail(input) {
            return Parse.Cloud.run('validateEmail', {email: input});
        }

        function validateUsername(input) {
            return Parse.Cloud.run('validateUsername', {username: input});
        }

        function all(params) {
            return Parse.Cloud.run('getUsers', params);
        }

        function follow(userId) {
            return Parse.Cloud.run('followUser', {userId: userId});
        }

        function findByEmail(email) {
            return Parse.Cloud.run('findUserByEmail', {email: email});
        }

        function profile(username) {
            return Parse.Cloud.run('profile', {username: username})
        }

        function list(params) {
            return Parse.Cloud.run('listUsers', params)
        }

        function getFollowers(username) {
            return Parse.Cloud.run('getFollowers', {username: username})
        }

        function getLikers(galleryId) {
            return Parse.Cloud.run('getLikers', {galleryId: galleryId})
        }

        function getFollowing(username) {
            return Parse.Cloud.run('getFollowing', {username: username})
        }


        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
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

        return ParseObject;

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
            restrict   : 'E',
            link       : modalLanguageLink,
            templateUrl: path + '/ion-language.html'
        };

        function modalLanguageLink(scope, elem, attr) {


            scope.languages = AppConfig.locales;
            scope.language  = scope.languages.filter(function (item) {
                return item.code === $translate.use()
            })[0];

            elem.bind('click', openModal);

            function openModal() {

                scope.closeModal = function () {
                    scope.modal.hide();
                };

                scope.searchValue = '';

                scope.selectLanguage = function (language) {
                    console.log(language);
                    $translate.use(language.code);
                    scope.language = language;
                    scope.$emit('changeLanguage', language);
                    Loading.start();
                    scope.closeModal();
                    $timeout(function () {
                        Loading.end();
                    }, 1000);
                };

                $ionicModal
                    .fromTemplateUrl(path + '/modal-language.html', {
                        scope          : scope,
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
                    '<ion-header-bar class="bar bar-positive item-input-inset">' +
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

    function GalleryCommentController($scope, $stateParams, $document, $q, $ionicScrollDelegate, $ionicHistory, $rootScope, $ionicPopup, User, Dialog, $timeout, Gallery, GalleryComment) {

        $scope.currentUser = Parse.User.current();
        $scope.loading     = true;

        function init() {
            $scope.nocomments = false;
            Gallery.get($stateParams.galleryId).then(function (gallery) {
                console.log(gallery);
                getComments();
                $scope.gallery = gallery;
                $scope.form    = {
                    gallery: gallery,
                    text   : ''
                };
            });
        }

        $scope.backButton = function () {
            $ionicHistory.goBack();
        };
        init();

        function commentFoccus() {
            var elem = document.getElementById('textComment');
            elem.click();
            elem.focus();
            if (window.cordova) {
                cordova.plugins.Keyboard.show();
            }
        }

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
            Dialog.confirm({
                title: ('Deletar comentário'),
                text : ('Tem certeza?')
            }).then(function (resp) {
                if (resp) {
                    GalleryComment.get(item.id).then(function (comment) {
                        GalleryComment.destroy(comment).then(function (resp) {
                            $rootScope.$emit('photolist:comment:remove', comment);
                            getComments();
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
                    title   : ('Editar Comentário'),
                    //subTitle: 'Please use normal things',
                    scope   : $scope,
                    buttons : [
                        {
                            text: ('Cancelar')
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
                        }
                    ]
                })
                .then(function (resp) {
                    console.log(resp);
                    if (resp) {
                        GalleryComment.get(obj.id).then(function (comment) {
                            comment.text = resp.text;
                            comment.save();
                            $scope.loading = true;
                            $timeout(function () {
                                getComments();
                            }, 1000);
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

                $scope.$digest();
                commentFoccus();
            });
        }

        $scope.submitComment = function (rForm, form) {
            if (rForm.$valid) {
                var dataForm   = angular.copy(form);
                $scope.loading = true;
                GalleryComment.create(dataForm).then(function (resp) {
                    $rootScope.$emit('photolist:comment:add', resp);
                    getComments();
                    $scope.form.text = '';
                });
            }
        }


    }

})();

(function () {
    'use strict';

    angular.module('app.main').controller('LoadingCtrl', LoadingController);

    function LoadingController($scope, Parse, $ionicPlatform, $cordovaSplashscreen, AppConfig, $state) {
        var user = Parse.User.current();

        if (user) {
            if (user) {
                $state.go(AppConfig.routes.home, {
                    clear: true
                });
            } else {
                $state.go('avatar', {
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

    angular.module('app.main').controller('ProfileCtrl', ProfileController);

    function ProfileController($scope, User, $state, $stateParams) {
        var vm = this;

        vm.loading = true;
        User.profile($stateParams.username).then(function (data) {
            console.log(data);
            console.log(Parse.User.current());
            vm.isMe    = Parse.User.current().id === data.id ? true : false;
            vm.user    = data;
            vm.loading = false;
            $scope.$digest();
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

    angular.module('app.main').controller('ProfilePhotoCtrl', ProfileController);

    function ProfileController($stateParams) {
        var vm       = this;

        vm.id = $stateParams.id;
    }


})();

(function () {
    'use strict';
    angular.module('starter').factory('GalleryShare', GalleryShareFactory);

    function GalleryShareFactory($q, $rootScope, User, $ionicModal) {
        var tempImage;
        return {
            show: show
        };

        function show(image) {
            var defer  = $q.defer();
            var $scope = $rootScope.$new();

            $scope.image = image;
            $scope.form  = {
                title        : '',
                facebookShare: true,
                privacity    : 'public'
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

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, $ionicHistory, ParsePush, GalleryShare, $scope, $rootScope, PhotoService, $ionicPlatform, Gallery, ParseFile, Loading) {
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
            PhotoService.open().then(GalleryShare.show).then(function (form) {
                Loading.start();
                console.log(form);
                ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                    form.image = imageUploaded;
                    Gallery.create(form).then(function (item) {
                        $rootScope.$emit('photolist:reload');
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

    function ActivityController($scope, User, $rootScope, $state, GalleryActivity) {
        init();

        $scope.openProfile = function (username) {
            $state.go('tab.activityProfile', {username: username})
        };

        $scope.follow = function (user) {

            console.log(user.id, user.obj.id);
            user.loading = true;

            User.follow(user.obj.id).then(function (resp) {
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
        };

        loadFeed();

        $rootScope.$emit('activity:clear', true);

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;
            GalleryActivity.feed($scope.params).then(function (data) {
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
            $scope.params.limit        = 50;
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

    function HomeController($state, $rootScope, $ionicHistory) {
        var vm = this;

        vm.type = 'public';

        vm.onFeed = function (type) {
            vm.type = type;
            $rootScope.$emit('photolist:reload', type);
        };


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

        $scope.params = {};
        init();

        $scope.onSearch = function () {
            var text             = $filter('lowercase')($scope.searchValue);
            $scope.params.search = text;
            $scope.data          = [];
            $scope.onReload();
        };

        $scope.clearSearch = function () {
            $scope.params      = {};
            $scope.searchValue = '';
            $scope.data        = [];
            $scope.onReload();
        };

        loadFeed();

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;
            Gallery.search($scope.params).then(function (data) {
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
            $scope.params.page         = 1;
            $scope.data                = [];
            $scope.loading             = false;
            $scope.moreDataCanBeLoaded = true;
            $scope.showEmptyView       = false;
            $scope.showErrorView       = false;

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
        $scope.map;
        $scope.myLocation = {};

        var position   = {
            latitude : -18.8800397,
            longitude: -47.05878999999999
        };
        var mapOptions = {
            center   : setPosition(position),
            zoom     : 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        function init() {
            $scope.galleries = [];
            removeGallerys();
            removeMarkers();

            $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

            //Wait until the map is loaded
            google.maps.event.addListener($scope.map, 'idle', function () {
                $scope.onSearchHere();
            });
        }

        $scope.$on('$ionicView.enter', function (scopes, states) {
            if (!$scope.map) {
                init();
                myPosition();
            }
        });

        $scope.loadMyLocation = function () {
            $scope.params.location = $scope.myLocation;
            // Set center locale
            $scope.map.setCenter($scope.params.location);
            console.log($scope.map, $scope.params.location);
        };


        function myPosition() {
            Geolocation.getCurrentPosition().then(function (position) {

                console.log(position);

                $scope.myLocation = setPosition({
                    latitude : position.coords.latitude,
                    longitude: position.coords.longitude
                });

                $scope.params.location = $scope.myLocation;

                var marker = {
                    position: $scope.myLocation,
                    title   : 'I am here',
                    id      : 0
                }

                addMarker(marker);

                // Set center locale
                $scope.map.setCenter($scope.params.location);
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
                if (item.username) {
                    $state.go('tab.mapProfile', {username: item.username})
                }

            });

            markers.push(marker);


            //new MarkerClusterer($scope.map, markers, {
            //    imagePath: '../img/m'
            //});
            //
            //latlngbounds.extend(item.position);
            //$scope.map.fitBounds(latlngbounds);
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

                    if (!_.some(markers, {id: marker.id})) {
                        addMarker(marker);
                    }
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
                $scope.$apply();
            }, function () {
                Toast.show('errorText');
            });
        }

        function removeGallerys() {
            $scope.galleries = [];
        }

        function removeMarkers() {
            _.each(markers, function (item, index) {
                if (index > 0) {
                    item.setMap(null);
                }
            })
            markers = [];
        };

        $scope.onSearchHere = function () {
            if ($scope.loading) return;
            $scope.params.location.latitude  = $scope.map.getCenter().lat();
            $scope.params.location.longitude = $scope.map.getCenter().lng();

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

    function UserAvatarController(User, Parse, $translate, $scope, Loading, Auth, AppConfig, $rootScope, $state, Toast) {

        init();


        function init() {
            var user    = Parse.User.current();
            $scope.form = {
                name    : user.name,
                email   : user.email,
                status  : user.status,
                gender  : user.gender,
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
            $scope.$digest();
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
            $scope.$digest();
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
        $scope.params = {};
        init();
        loadFeed();

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;

            $scope.onSearch = function () {
                $scope.params.search = $scope.searchValue;
                $scope.onReload();
            };

            $scope.clearSearch = function () {
                $scope.params      = {};
                $scope.searchValue = '';
                $scope.onReload();
            };

            User.list($scope.params).then(function (data) {
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
        };

        function init() {
            $scope.params.page         = 1;
            $scope.data                = [];
            $scope.loading             = false;
            $scope.moreDataCanBeLoaded = true;
            $scope.showEmptyView       = false;
            $scope.showErrorView       = false;

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
        };

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

            if (setting.jrCrop ) {
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

angular.module('ionic').run(['$templateCache', function($templateCache) {$templateCache.put('app/directive/SigninModalDirective.html','<ion-modal-view><ion-header-bar class="bar-positive"><h1 class="title" translate="signin"></h1><a \nng-click="closeModal()" class="button button-icon icon ion-ios-close-empty"></a></ion-header-bar><ion-content \nscroll="false"><div class="step2"><form name="myForm" novalidate="novalidate" on-submit="submitLogin(myForm, form)">\n<label class="item item-input validated"><i class="icon icon-user placeholder-icon"></i> <input required="required" \ntype="text" name="username" ng-model="form.username" ng-minlength="4" ng-maxlength="12" autocomplete="false" \nng-model-options="{debounce: 1000}" placeholder="{{\'yourLogin\' | translate}}"></label><div class="errors" \nng-if="myForm.username.$dirty"><div ng-messages="myForm.username.$error" class="validation-error"><div \nng-message="required" translate="usernameRequired"></div><div ng-message="email" translate="usernameInUse"></div></div>\n<div ng-messages="myForm.username.$pending" class="validation-pending"><div ng-message="email" \ntranslate="checkingUsername"></div></div></div><label class="item item-input validated"><i \nclass="icon icon-lock placeholder-icon"></i> <input required type="password" name="password" autocomplete="false" \nng-model="form.password" placeholder="{{\'password\'|translate}}"></label><div class="errors" \nng-if="myForm.username.$dirty"><div ng-messages="myForm.username.$error" class="validation-error"><div \nng-message="required" translate="required"></div></div></div><div class="padding"><button \nclass="button button-block button-positive" type="submit" translate="{{\'submit\' | translate}}"></button> <a \nclass="button button-block button-clear button-positive" ng-click="forgotPass()" \ntranslate="{{\'forgotPass\' | translate}}"></a> <span class="term">{{\'termAccept\' | translate}} <a \nhref="https://photogramapp.com">{{\'terms\' | translate}}</a></span></div></form></div></ion-content></ion-modal-view>');
$templateCache.put('app/directive/SignupModalDirective.html','<ion-modal-view><ion-header-bar class="bar-positive"><h1 class="title" translate="register"></h1><a \nng-click="closeModal()" class="button button-icon icon ion-ios-close-empty"></a></ion-header-bar><form name="myForm" \non-submit="submitRegister(myForm, form)" novalidate="novalidate"><ion-content scroll="false"><div class="step2"><label \nclass="item item-input validated"><i class="icon icon-envelope placeholder-icon"></i> <input required="required" \ntype="email" name="email" ng-model="form.email" autocomplete="false" email-validator \nng-model-options="{debounce: 1000}" placeholder="user@example.com"> <i class="icon ion-alert-circled error"></i>\n</label><div class="errors" ng-if="myForm.email.$dirty"><div ng-messages="myForm.email.$error" \nclass="validation-error"><div ng-message="required" translate="emailRequired"></div><div ng-message="email" \ntranslate="emailInUse"></div></div><div ng-messages="myForm.email.$pending" class="validation-pending"><div \nng-message="email" translate="checkingEmail"></div></div></div><label class="item item-input validated"><i \nclass="icon icon-user placeholder-icon"></i> <input required="required" type="text" name="username" \nng-model="form.username" username-validator ng-minlength="4" ng-maxlength="12" autocomplete="false" \nng-model-options="{debounce: 1000}" placeholder="{{\'yourLogin\' | translate}}"> <i class="icon ion-alert-circled error">\n</i></label><div class="errors" ng-if="myForm.username.$dirty"><div ng-messages="myForm.email.$error" \nclass="validation-error"><div ng-message="required" translate="usernameRequired"></div><div ng-message="email" \ntranslate="usernameInUse"></div></div><div ng-messages="myForm.email.$pending" class="validation-pending"><div \nng-message="email" translate="checkingUsername"></div></div></div><label class="item item-input validated"><i \nclass="icon icon-lock placeholder-icon"></i> <input required type="password" name="password" ng-model="form.password" \nplaceholder="{{\'password\'|translate}}"> <i class="icon ion-alert-circled error"></i></label><div class="padding">\n<button class="button button-block button-positive" type="submit" translate="{{\'submit\' | translate}}"></button> <span \nclass="term">{{\'termAccept\' | translate}} <a href="https://photogramapp.com">{{\'terms\' | translate}}</a></span></div>\n</div></ion-content></form></ion-modal-view>');
$templateCache.put('app/directive/albumGridDirective.html','<div class="center padding" ng-if="showErrorView"><div class="error"><i \nclass="icon icon-large ion-ios-cloud-download-outline"></i><p>{{ "errorText" | translate }}</p><button \nclass="button button-primary" ng-click="onReload()">{{ "tryAgainText" | translate }}</button></div></div><div \nclass="center padding" ng-if="showEmptyView"><div class="error"><i class="icon icon-large ion-android-alert"></i><p>\n{{ "galleriesNotFoundText" | translate }}</p></div></div><div class="center padding" ng-if="loading &&!data.length">\n<ion-spinner></ion-spinner></div><div class="row" ng-if="$index % 2 === 0" \nng-repeat="image in data | orderBy:\'createdAt\':true"><div class="col col-50 newAlbum" \nng-if="$index < data.length && data[$index].create" gallery-new-album-modal ng-model="ngModel"><div class="desc"><i \nclass="icon ion-ios-plus-empty"></i><h2 translate="createAlbum"></h2></div></div><div class="col col-50" \nng-if="$index < data.length && !data[$index].create" album-photo-grid album="data[$index].id" edit="canEdit"><img \nimg-cache ic-src="{{ ::data[$index ].imageThumb._url || \'img/albumnone.png\'}}" ic-default="img/user.png" width="100%">\n<div class="desc"><h2>{{::data[$index].title}}</h2><p>{{::data[$index].qtyPhotos}} photos</p></div></div><div \nclass="col col-50" ng-if="$index + 1 < data.length" album-photo-grid album="data[$index+1].id" edit="canEdit"><img \nimg-cache ic-src="{{ ::data[$index + 1].imageThumb._url || \'img/albumnone.png\'}}" ic-default="img/user.png" \nwidth="100%"><div class="desc"><h2>{{::data[$index+1].title}}</h2><p>{{::data[$index+1].qtyPhotos}} photos</p></div>\n</div></div><ion-infinite-scroll on-infinite="onLoadMore()" ng-if="moreDataCanBeLoaded" spinner distance="1%">\n</ion-infinite-scroll>');
$templateCache.put('app/directive/albumPhotoGridDirective.html','<ion-modal-view cache-view="false"><ion-header-bar class="bar bar-{{theme}}"><a ng-click="closeAlbumPhotoGridModal()" \nclass="button button-icon icon ion-ios-close-empty"></a><h1 class="title" ng-bind="title"></h1><a \nclass="button button-icon icon ion-android-more-vertical" ng-if="canEdit" ng-click="openPopover($event)"></a>\n</ion-header-bar><ion-content class="padding"><div class="center padding" ng-if="loading"><ion-spinner></ion-spinner>\n</div><div class="row" ng-repeat="image in data | orderBy:\'createdAt\':true" ng-if="!loading && $index % 3 === 0"><div \nclass="col col-33" ng-if="$index < data.length"><img ng-if="profile" profile-modal user="data[$index].user.obj" \nic-src="{{ ::data[$index].imageThumb.url()}}" img-cache ic-default="img/user.png" width="100%"> <img ng-if="!profile" \nion-slideshow can-edit="canEdit" ng-model="data" index="$index" img-cache \nic-src="{{ ::data[$index].imageThumb.url()}}" width="100%"></div><div class="col col-33" \nng-if="$index + 1 < data.length"><img ng-if="profile" profile-modal user="data[$index + 1].user.obj" img-cache \nic-default="img/user.png" ic-src="{{ ::data[$index + 1].imageThumb.url()}}" width="100%"> <img ng-if="!profile" \nion-slideshow can-edit="canEdit" ng-model="data" index="$index+1" img-cache \nic-src="{{ ::data[$index + 1].imageThumb.url()}}" width="100%"></div><div class="col col-33" \nng-if="$index + 2 < data.length"><img ng-if="profile" profile-modal user="data[$index + 2].user.obj" img-cache \nic-default="img/user.png" ic-src="{{ ::data[$index + 2].imageThumb.url()}}" width="100%"> <img ng-if="!profile" \nion-slideshow can-edit="canEdit" ng-model="data" index="$index+2" img-cache ic-default="img/user.png" \nic-src="{{ ::data[$index + 2].imageThumb.url()}}" width="100%"></div></div></ion-content></ion-modal-view>');
$templateCache.put('app/directive/albumPhotoGridPopover.html','<ion-popover-view><ion-content><div class="list"><a class="item item-icon-left" ng-click="uploadPhoto()"><i \nclass="icon ion-ios-camera-outline"></i> <span translate="addPhoto"></span> </a><a class="item item-icon-left" \nng-click="editAlbum()"><i class="icon ion-ios-compose-outline"></i> <span translate="editAlbum"></span> </a><a \nclass="item item-icon-left" ng-click="deleteAlbum()"><i class="icon ion-ios-trash-outline"></i> <span \ntranslate="deleteAlbum"></span></a></div></ion-content></ion-popover-view>');
$templateCache.put('app/directive/distanceModal.html','<ion-modal-view><ion-header-bar class="bar bar-{{theme}}"><div class="buttons"><button \nclass="button button-clear button-icon ion-ios-close-empty" ng-click="closeDistanceModal()"></button></div><div \nclass="title">{{ "chooseDistanceText" | translate }}</div></ion-header-bar><ion-content><ion-list><ion-item \nclass="item item-icon-right" ng-repeat="distance in distances" ng-click="onDistanceSelected(distance.val)" bindonce><h2\n bo-bind="distance.text"></h2><i class="icon ion-checkmark" ng-show="params.distance === distance.val"></i></ion-item>\n</ion-list></ion-content></ion-modal-view>');
$templateCache.put('app/directive/follow.modal.html','<ion-modal-view class="modal-profile photogram-profile"><ion-header-bar class="bar-positive"><button \nclass="button button-clear button-icon ion-ios-arrow-thin-left" ng-click="closeModal()"></button><div class="title">\nFollow Users</div></ion-header-bar><ion-content><div class="list"><div class="item item-avatar item-button-right" \nng-repeat="item in data"><img ng-src="{{ ::item.src }}"><h2>{{ ::item.name }}</h2><p>{{ ::item.status }}</p><button \nclass="button" ng-click="item.follow = !item.follow" ng-class="item.follow ? \'button-positive\' : \'button-stable\'"><i \nclass="icon" ng-class="item.follow? \'ion-thumbsup\' : \'ion-plus\'"></i></button></div></div></ion-content>\n</ion-modal-view>');
$templateCache.put('app/directive/galleryAlbumModalDirective.html','<ion-modal-view><ion-header-bar class="bar bar-{{theme}}"><a ng-click="closeModal()" class="button button-clear" \ntranslate="cancel"></a><h1 class="title" translate="selectAlbumText"></h1></ion-header-bar><ion-content><div \nclass="list"><div class="item item-thumbnail-left" gallery-new-album-modal ng-model="ngModel"><img \nsrc="img/albumnew.png"><h2>Create Album</h2></div><div class="item item-thumbnail-left" \nng-repeat="item in data | filter:searchValue" ng-click="selectAlbum(item)"><img img-cache ic-default="img/user.png" \nic-src="{{item.imageThumb._url || \'img/albumnone.png\'}}"><h2 ng-bind="item.title"></h2><p>{{item.qtyPhotos}} photos</p>\n</div></div><ion-infinite-scroll on-infinite="onLoadMore()" ng-if="moreDataCanBeLoaded" spinner></ion-infinite-scroll>\n</ion-content></ion-modal-view>');
$templateCache.put('app/directive/galleryNewAlbumModalDirective.html','<ion-modal-view><form name="rForm" novalidate><ion-header-bar class="bar bar-{{theme}}"><button \nng-click="closeModal()" class="button button-clear" translate="cancel"></button><h1 class="title" \ntranslate="createAlbum" ng-if="!form.id"></h1><h1 class="title" translate="editAlbum" ng-if="form.id"></h1><button \nng-click="createAlbum(rForm, form)" class="button button-clear" translate="submit"></button></ion-header-bar>\n<ion-content><div class="list"><label class="item item-input"><input type="text" name="title" \nplaceholder="{{\'albumName\' | translate}}" ng-model="form.title" required></label><label class="item item-input">\n<textarea name="description" placeholder="{{\'albumDesc\' | translate}}" ng-model="form.description"></textarea></label>\n</div></ion-content></form></ion-modal-view>');
$templateCache.put('app/directive/likeDirective.html','<ion-modal-view class="modal-comment"><ion-header-bar class="bar-dark"><button \nclass="button button-clear button-icon ion-ios-arrow-thin-left" ng-click="closeModal()"></button><div class="title">\n{{ ::\'Likes\' | translate }} ({{ ::likes.length }})</div></ion-header-bar><ion-content><div class="list step1"><div \nng-repeat="item in likes" class="item item-avatar item-button-right"><img ng-src="{{ ::item.user.img }}"><h2>\n{{ ::item.user.name }}</h2><div>{{ ::item.text }}</div><p>{{ ::item.created | amTimeAgo }}</p><button \nclass="button button-positive button-outline"><i class="icon ion-ios-plus-empty"></i> {{ ::\'Follow\' }}</button></div>\n</div></ion-content></ion-modal-view>');
$templateCache.put('app/directive/mapPhotoUserDirective.html','<div id="map_canvas" data-tap-disabled="true"></div>');
$templateCache.put('app/directive/photoGridDirective.html','<div class="center padding" ng-if="showErrorView"><div class="error"><i \nclass="icon icon-large ion-ios-cloud-download-outline"></i><p>{{ "errorText" | translate }}</p><button \nclass="button button-primary" ng-click="onReload()">{{ "tryAgainText" | translate }}</button></div></div><div \nclass="center padding" ng-if="showEmptyView"><div class="error"><i class="icon icon-large ion-android-alert"></i><p>\n{{ "galleriesNotFoundText" | translate }}</p></div></div><div class="center padding" ng-if="loading &&!data.length">\n<ion-spinner></ion-spinner></div><div class="row" ng-if="$index % 3 === 0" \nng-repeat="image in data | orderBy:\'createdAt\':true"><div class="col col-33" ng-if="$index < data.length"><img \nng-if="profile" profile-modal user="data[$index].user.obj" width="100%" img-cache \nic-src="{{::data[$index].imageThumb.url() || \'img/user.png\'}}" ic-default="img/user.png"> <img ng-if="!profile" \nion-slideshow ng-model="data" index="$index" img-cache ic-src="{{::data[$index].imageThumb.url() || \'img/user.png\'}}" \nic-default="img/user.png" width="100%"></div><div class="col col-33" ng-if="$index + 1 < data.length"><img \nng-if="profile" profile-modal user="data[$index + 1].user.obj" img-cache \nic-src="{{::data[$index + 1].imageThumb.url() || \'img/user.png\'}}" ic-default="img/user.png" width="100%"> <img \nng-if="!profile" ion-slideshow ng-model="data" index="$index+1" img-cache \nic-src="{{::data[$index + 1].imageThumb.url() || \'img/user.png\'}}" ic-default="img/user.png" width="100%"></div><div \nclass="col col-33" ng-if="$index + 2 < data.length"><img ng-if="profile" profile-modal \nuser="data[$index + 2].user.obj" img-cache ic-src="{{::data[$index + 2].imageThumb.url() || \'img/user.png\'}}" \nic-default="img/user.png" width="100%"> <img ng-if="!profile" ion-slideshow ng-model="data" index="$index+2" img-cache \nic-src="{{::data[$index + 2].imageThumb.url() || \'img/user.png\'}}" ic-default="img/user.png" width="100%"></div></div>\n<ion-infinite-scroll on-infinite="onLoadMore()" ng-if="moreDataCanBeLoaded" spinner distance="1%">\n</ion-infinite-scroll>');
$templateCache.put('app/directive/photoListDirective.html','<div class="center padding" ng-if="showErrorView"><div class="error"><i \nclass="icon icon-large ion-ios-cloud-download-outline"></i><p>{{ "errorText" | translate }}</p><button \nclass="button button-primary" ng-click="onReload">{{ "tryAgainText" | translate }}</button></div></div><div \nclass="center padding" ng-if="showEmptyView"><div class="error"><i class="icon icon-large ion-android-alert"></i><p>\n{{ "galleriesNotFoundText" | translate }}</p></div></div><div class="center padding" ng-if="loading &&!data.length">\n<ion-spinner></ion-spinner></div><div class="list card" ng-repeat="gallery in data | orderBy:\'createdAt\':true"><div \nclass="item item-avatar" ng-click="load(gallery.user.get(\'username\'))" ion-affix \ndata-affix-within-parent-with-class="card"><img img-cache \nic-src="{{::gallery.user.get(\'photo\').url() || \'img/user.png\'}}" ic-default="img/user.png"><h2>\n{{ ::gallery.user.get(\'name\')}}</h2><p>{{ ::gallery.user.get(\'status\')}}</p><span>{{ gallery.createdAt | amTimeAgo}}\n</span></div><div class="item item-body" on-double-tap="like(gallery.id)" ng-model="gallery"><div \nclass="icon ion-ios-heart heart" ng-class="gallery.isLiked ? \'happy\' : \'broken\' "></div><i class="icon" ng-if="like">\n</i> <img id="{{ ::gallery.id}}" img-cache ic-src="{{gallery.image.url()}}" ic-default="img/user.png"></div><div \nclass="item item-buttons"><div class="row"><div class="col col-30"><ion-spinner ng-show="gallery.progress">\n</ion-spinner><button photo-like loading="gallery.progress" ng-model="gallery" ng-if="!gallery.progress" \nng-class="gallery.isLiked ? \'ion-ios-heart\' : \'ion-ios-heart-outline\' " class="button-clear button-icon button-heart">\n</button> <button ng-click="openComment(gallery.id)" ng-model="gallery" \nclass="button-clear button-icon ion-ios-chatbubble-outline"></button></div><div class="col album-name text-center" \nalbum-photo-grid album="gallery.album.id" edit="gallery.canEdit"><div ng-bind="gallery.album.attributes.title"></div>\n</div><div class="col text-right"><button ng-click="action(gallery)" photogram="{{ :: gallery.id }}" \nclass="button-clear button-icon ion-navicon"></button></div></div></div><div class="padding"><span class="likes" \nng-click="openLikers(gallery.id)"><i class="icon ion-ios-heart"></i> <span ng-if="!gallery.progress">\n{{ gallery.likesTotal }}</span> <span translate="likesText"></span></span><div class="list-comments"><div \nclass="comment-item"><span profile-modal username="gallery.user.get(\'username\')" class="username">\n{{ :: gallery.user.get(\'name\') }}</span> <span class="comment" ng-bind-html="gallery.title | hashtag "></span></div>\n<div class="comment-item" ng-repeat="item in gallery.comments |limitTo:3 | orderBy:\'createdAt\':true"><span \nclass="username" profile-modal username="gallery.user.get(\'username\')">{{ :: item.user.name }}</span> <span \nclass="comment" ng-bind-html="item.text | hashtag"></span></div><a class="comment-item" \nng-click="openComment(gallery.id)" ng-if="gallery.commentsTotal>3" translate="seeAllCommentText"></a></div><button \nclass="button button-block button-clear button-comment" ng-click="openComment(gallery.id)"><span \ntranslate="addComment"></span></button></div></div><ion-infinite-scroll on-infinite="onLoadMore()" \nng-if="moreDataCanBeLoaded" spinner></ion-infinite-scroll>');
$templateCache.put('app/directive/profile-edit-modal.html','<ion-modal-view class="profile-edit"><ion-header-bar class="bar bar-{{theme}}"><button class="button button-clear" \nng-click="closeModal()" translate="cancel"></button><div class="title">{{ ::\'editProfile\' | translate }}</div>\n</ion-header-bar><ion-content class="view-avatar"><div class="step2"><form name="rForm" \nng-submit="submitUpdateProfile(rForm, form)" novalidate><img class="avatar" user-avatar ng-model="currentUser" \nng-src="{{ currentUser.photo.url() || \'img/user.png\' }}"><label class="item item-input"><i \nclass="icon ion-clipboard placeholder-icon"></i> <input required="required" type="text" name="name" \nng-model="form.name" placeholder="{{\'name\' | translate}}"></label><label class="item item-input"><i \nclass="icon ion-at placeholder-icon"></i> <input required="required" type="text" name="username" \nng-model="form.username" ng-minlength="4" ng-maxlength="12" ng-pattern="/^[a-zA-Z\'. -]+$/" \nplaceholder="{{\'username\' | translate}}"></label><label class="item item-input"><i \nclass="icon ion-earth placeholder-icon"></i> <input type="url" name="website" ng-model="form.website" \nplaceholder="{{\'site\' | translate}}"></label><label class="item item-input"><i \nclass="icon ion-information-circled placeholder-icon"></i> <input required="required" type="text" name="status" \nng-model="form.status" placeholder="{{\'status\' | translate}}"></label><ion-item class="item-divider" \ntranslate="privateInformation"></ion-item><label class="item item-input"><i \nclass="icon icon-envelope placeholder-icon"></i> <input type="email" name="email" ng-model="form.email" \ndisabled="disabled" ng-model-options="{debounce: 1000}" placeholder="user@example.com"></label><label \nclass="item item-input"><i class="icon ion-iphone placeholder-icon"></i> <input required="required" type="tel" \nname="phone" ng-model="form.phone" placeholder="{{\'phone\' | translate }}"></label><div class="padding"><button \ntype="submit" class="button button-block button-positive" translate="submit"></button></div></form></div></ion-content>\n</ion-modal-view>');
$templateCache.put('app/directive/profile-modal.html','<ion-modal-view id="account-view"><ion-header-bar class="bar bar-{{theme}}"><button \nclass="button button-clear button-icon ion-ios-arrow-thin-left" ng-click="closeModal()"></button><div class="title">\n{{ user.name }}</div></ion-header-bar><ion-content overflow-scroll="true"><div class="profile-top"><div class="row">\n<div class="col-25"><img class="avatar" ng-src="{{ user.photo._url || \'img/user.png\'}}"></div><div \nclass="col col-statics"><div class="row"><div class="row"><div class="col"><span class="text-center">\n{{ ::user.galleriesTotal || 0}}</span><h3 translate="postsText"></h3></div><div class="col"><span class="text-center">\n{{ user.followersTotal || 0}}</span><h3 translate="followersText"></h3></div><div class="col"><span \nclass="text-center">{{ ::user.followingsTotal || 0}}</span><h3 translate="followingText"></h3></div></div></div><div \nclass="row col-edit"><div class="col"><photogram-loading loading="loadingFollow"></photogram-loading><button \nng-class="{\'button-unfollow\': user.isFollow, \'button-follow\': !user.isFollow}" ng-click="follow()" class="button"><span\n ng-show="!user.isFollow" translate>Follow</span> <span ng-show="user.isFollow" translate>Following</span></button>\n</div></div></div></div><div class="padding"><span class="user-username">{{ user.name }}</span><p class="user-status">\n{{ user.status }}</p></div></div><div class="item bar"><div class="button-bar"><button \nclass="button button-icon icon ion-grid" ng-class="{active: tab.grid}" ng-click="changeTab(\'grid\')"></button> <button \nclass="button button-icon icon ion-drag" ng-class="{active: tab.list}" ng-click="changeTab(\'list\')"></button> <button \nclass="button button-icon icon ion-ios-location"></button></div></div><div class="item item-divider" \ntranslate="recent"></div><div class="tab" ng-if="tab.list"></div><div class="tab" ng-if="tab.grid"></div></ion-content>\n</ion-modal-view>');
$templateCache.put('app/directive/search-directive.html','<label class="item item-input"><i class="icon ion-search placeholder-icon"></i> <input type="search" ng-model="input" \nplaceholder="{{\'SEARCH.FORM.INPUT\' | translate }}"> <button class="button button-icon" ng-if="input.length" \nng-click="clearSearch()"><i class="icon ion-close"></i></button></label>');
$templateCache.put('app/directive/settings-modal.html','<ion-modal-view class="modal-profile"><ion-header-bar class="bar bar-{{theme}}"><button class="button button-clear" \nng-click="closeSettingModal()" translate="cancel"></button><div class="title" translate="settingTitle"></div>\n</ion-header-bar><ion-content class="animated fadeIn"><div class="list"><ion-language language="language">\n</ion-language><ion-toggle class="toggle-positive" ng-model="form.push"><h3><small translate="notificationText">\n</small></h3><p ng-if="form.push" translate="on"></p><p ng-if="!form.push" translate="off"></p></ion-toggle><ion-item \nclass="item-icon-right" href="http://photogramapp.com"><h3><small translate="terms"></small></h3><i \nclass="icon ion-ios-arrow-right"></i></ion-item></div><div class="padding"><button ng-click="logout()" \nclass="button button-block button-positive" translate="logout"></button></div></ion-content></ion-modal-view>');
$templateCache.put('app/mentio/people-mentions.html','<ul class="list-group user-search"><li mentio-menu-item="person" ng-repeat="person in items" class="list-group-item">\n<img ng-src="{{person.imageUrl}}" class="user-photo"><div class="description"><span class="text-primary" \nng-bind-html="person.username | mentioHighlight:typedTerm:\'menu-highlighted\' | unsafe"></span> <em class="text-muted" \nng-bind="person.status | words:5"></em></div></li></ul>');
$templateCache.put('app/mentio/photo-mentions.html','<ul class="list-group product-search demo-scrollable-menu"><li mentio-menu-item="product" ng-repeat="product in items" \nclass="list-group-item clearfix"><div class="row"><div class="col-xs-2 text-center"><img ng-src="{{product.imageUrl}}" \nclass="product-photo"></div><div class="col-xs-10"><h4 class="list-group-item-heading">{{product.title | words:5}}</h4>\n<p class="list-group-item-text">{{product.description | words:7}}</p></div></div></li></ul>');
$templateCache.put('app/component/ion-language/ion-language.html','<button class="button button-block button-clear button-{{theme}} button-language">{{language.translation | translate}} \n<i class="icon ion-android-arrow-dropdown"></i></button>');
$templateCache.put('app/component/ion-language/modal-language.html','<ion-modal-view><ion-header-bar class="bar bar-positive"><h1 class="title" translate="selectLanguageText"></h1><button \nclass="button button-clear" ng-click="closeModal()" translate="cancel"></button></ion-header-bar><div \nclass="bar bar-subheader item-input-inset bar-positive"><label class="item-input-wrapper"><i \nclass="icon ion-ios-search placeholder-icon"></i> <input type="search" placeholder="{{\'searchText\' | translate}}" \nng-model="searchValue"></label><button type="button" class="button button-clear" ng-show="searchValue.length" \nng-click="searchValue=\'\'" translate>Clear</button></div><ion-content class="has-subheader"><ion-list><ion-item \nclass="item" ng-click="selectLanguage(item)" ng-repeat="item in languages | filter:searchValue" \nng-bind-html="item.translation | translate"></ion-item></ion-list></ion-content></ion-modal-view>');
$templateCache.put('app/component/ion-slideshow/image-popover.html','<ion-modal-view id="ion-slideshow"><ion-header-bar class="bar bar-dark"><a ng-click="closeModal()" \nclass="button button-icon icon ion-ios-close-empty"></a><div class="title"></div><a \nclass="button button-icon icon ion-android-more-vertical" ng-if="canEdit" ng-click="openPopover($event)"></a>\n</ion-header-bar><ion-content><ion-slide-box on-slide-changed="slideChanged(index)" show-pager="true" \nactive-slide="activeSlide"><ion-slide ng-repeat="item in allImages"><img img-cache ic-default="img/user.png" \nic-src="{{item.image._url}}" class="fullscreen-image"><h1 ng-if="item.title">{{item.title}}</h1></ion-slide>\n</ion-slide-box></ion-content></ion-modal-view>');
$templateCache.put('app/component/ion-slideshow/ion-slideshow.popover.html','<ion-popover-view><ion-content><div class="list"><a class="item item-icon-left" ng-click="deletePhoto()"><i \nclass="icon ion-ios-trash-outline"></i> <span translate="delete"></span></a></div></ion-content></ion-popover-view>');
$templateCache.put('app/component/ion-slideshow/video-popover.html','<div class="modal transparent fullscreen-player" ng-click="closeModal()"><video ng-src="{{clipSrc}}" class="centerme" \ncontrols="controls" autoplay></video></div>');
$templateCache.put('app/main/account-friend-list/account-friend-list.html','<ion-view><ion-content></ion-content></ion-view>');
$templateCache.put('app/main/feedback/feedback-modal.html','<ion-modal-view class="modal-profile"><ion-header-bar class="bar bar-{{theme}}"><button \nclass="button button-clear button-icon ion-ios-arrow-thin-left" ng-click="closeModal()"></button><div class="title" \ntranslate="feedback"></div></ion-header-bar><ion-content><form name="myForm" novalidate="novalidate" \nng-submit="submitFeedback(myForm, form)"><label class="item item-input"><i class="icon icon-envelope placeholder-icon">\n</i> <input required="required" type="text" name="title" ng-model="form.title" \nplaceholder="{{\'feedback\' | translate}}"></label><label class="item item-input item-select"><i \nclass="icon ion-ios-information-outline placeholder-icon"></i><div class="input-label" translate>subject</div><select \nng-model="form.subject"><option selected="selected" translate>complaint</option><option translate>bug</option><option \ntranslate>suggestion</option></select></label><label class="item item-input"><i \nclass="icon ion-ios-compose-outline placeholder-icon"></i><textarea ng-model="form.message" \nplaceholder="{{\'message\' | translate}}"></textarea></label><div class="padding"><button \nclass="button button-block button-positive" type="submit" translate="{{\'submit\' | translate}}"></button></div></form>\n</ion-content></ion-modal-view>');
$templateCache.put('app/main/gallery-comment/gallery-comment.html','<ion-view id="view-comment" cache-view="false"><ion-nav-bar class="bar bar-{{theme}}"><ion-nav-buttons side="left">\n<button class="button button-icon button-clear ion-ios-arrow-left" ng-click="$ionicGoBack()"></button>\n</ion-nav-buttons><ion-nav-title><div class="title"><span translate="commentPhotoText"></span></div></ion-nav-title>\n</ion-nav-bar><ion-content><div class="padding center" ng-if="loading"><ion-spinner></ion-spinner></div><ion-list \nclass="list" ng-if="!loading" can-swipe="true"><div class="item item-avatar"><img img-cache ic-default="img/user.png" \nic-src="{{ ::gallery.imageThumb.url()|| \'./img/user.png\'}}"><p></p><h2>{{ ::gallery.profile.get(\'username\') }}</h2><div\n class="text">{{ ::gallery.title }}</div><p></p><div class="row"><p>{{ ::gallery.createdAt | amTimeAgo }}</p></div>\n</div><ion-item ng-repeat="item in comments | orderBy:\'createdAt\':false" class="item item-avatar"><img img-cache \nic-default="img/user.png" ic-src="{{ ::item.user.photo._url || \'./img/user.png\'}}"><p></p><h2>\n{{ ::item.user.username }}</h2><div class="text">{{ ::item.text }}</div><p></p><div class="row"><p>\n{{ ::item.createdAt | amTimeAgo }}</p></div><div ng-if="item.canEdit"><ion-option-button class="button-info" \nng-click="editComment(item, $index)" translate="edit">Edit</ion-option-button><ion-option-button \nclass="button-assertive" ng-click="deleteComment(item, $index)" translate="remove">Remove</ion-option-button></div>\n</ion-item></ion-list><div class="center-ico" ng-if="nocomments"><i class="icon ion-ios-chatbubble-outline"></i><h1 \ntranslate="noComments"></h1></div></ion-content><form name="rForm" ng-submit="submitComment(rForm, form)" novalidate>\n<ion-footer-bar ng-hide="loading" class="bar-stable item-input-inset message-footer" keyboard-attach><label \nclass="item-input-wrapper" ng-class="{\'item-invalid\': rForm.message.$invalid && !rForm.message.$pristine}"><textarea \nname="message" mentio mentio-trigger-char="\'@\'" mentio-items="people" \nmentio-template-url="app/mentio/people-mentions.html" mentio-search="searchPeople(term)" \nmentio-select="getPeopleTextRaw(item)" mentio-id="\'theTextArea\'" ng-trim="false" ng-model="form.text" id="textComment" \nplaceholder="{{\'commentInHere\' | translate}}" required minlength="1" maxlength="1500">\n                </textarea>\n</label><div class="footer-btn-wrap"><button class="button button-positive button-outline" type="submit" \nng-disabled="!form.text || form.text === \'\'" translate="submit"></button></div></ion-footer-bar></form></ion-view>');
$templateCache.put('app/main/loading/loading.html','<ion-view id="user-layout" class="bg-animate"><ion-content></ion-content></ion-view>');
$templateCache.put('app/main/profile/profile.html','<ion-view cache-view="false" id="account-view"><ion-nav-bar class="bar bar-{{theme}}"><ion-nav-back-button>\n</ion-nav-back-button></ion-nav-bar><ion-nav-title><span>{{ vm.user.name }}</span></ion-nav-title><ion-content \nscroll-sista="header-tabs" class="animated fadeIn"><ion-refresher pulling-text="Loading" on-refresh="onReload()">\n</ion-refresher><div class="profile-top"><div class="row"><div class="col-25"><img class="avatar" user-avatar \nng-model="vm.user" img-cache ic-default="img/user.png" ic-src="{{ vm.user.photo._url || \'img/user.png\' }}"></div><div \nclass="col col-statics"><div class="row"><div class="col"><span class="text-center">{{ vm.user.galleriesTotal || 0}}\n</span><h3 translate="postsText"></h3></div><div class="col" ng-click="vm.openFollowers()"><span class="text-center">\n{{ vm.user.followersTotal || 0}}</span><h3 translate="followersText"></h3></div><div class="col" \nng-click="vm.openFollowing()"><span class="text-center">{{ vm.user.followingsTotal || 0}}</span><h3 \ntranslate="followingText"></h3></div></div><div class="row col-edit"><div class="col center" ng-if="vm.loading">\n<ion-spinner></ion-spinner></div><div class="col" ng-if="vm.isMe && !vm.loading"><button profile-modal-edit \nuser="vm.user" class="button"><div translate="editProfile"></div></button></div><div class="col" \nng-if="!vm.isMe && !vm.loading"><button \nng-class="{\'button-unfollow\': vm.user.isFollow, \'button-follow\': !vm.user.isFollow}" ng-click="vm.follow()" \nclass="button"><span ng-show="!vm.user.isFollow" translate>follow</span> <span ng-show="vm.user.isFollow" translate>\nunfollow</span></button></div></div></div></div><div class="padding"><span class="user-username">{{ vm.user.name }}\n</span><p class="user-status">{{ vm.user.status }}</p></div></div><div class="item bar"><div class="button-bar"><button\n class="button button-icon icon ion-grid" ng-class="{\'active\': vm.tab.grid}" ng-click="vm.changeTab(\'grid\')"></button> \n<button class="button button-icon icon ion-ios-camera-outline" ng-class="{\'active\': vm.tab.album}" \nng-click="vm.changeTab(\'album\')"></button> <button class="button button-icon icon ion-drag" \nng-class="{\'active\': vm.tab.list}" ng-click="vm.changeTab(\'list\')"></button> <button \nclass="button button-icon icon ion-ios-location-outline" ng-class="{\'active\': vm.tab.map}" \nng-click="vm.changeTab(\'map\')"></button></div></div><div ng-if="!vm.loading"><div class="tab" \nng-if="vm.tab.grid && !vm.loading"><div class="item item-divider" translate="recent"></div><photo-grid \nusername="vm.user.username" on-reload="onReload"></photo-grid></div><div class="tab" \nng-if="vm.tab.album && !vm.loading"><div class="item item-divider" translate="albums"></div><album-grid \nusername="vm.user.username" on-reload="onReload"></album-grid></div><div class="tab" \nng-if="vm.tab.list && !vm.loading"><div class="item item-divider" translate="recent"></div><photo-list \nusername="vm.user.username" on-reload="onReload"></photo-list></div><div class="tab" ng-if="vm.tab.map && !vm.loading">\n<div class="item item-divider" translate="map"></div><map-photo-user username="vm.user.username" on-reload="onReload">\n</map-photo-user></div></div></ion-content></ion-view>');
$templateCache.put('app/main/profile-photo/profile-photo.html','<ion-view cache-view="false" id="account-view"><ion-nav-bar class="bar bar-{{theme}}"><ion-nav-back-button>\n</ion-nav-back-button></ion-nav-bar><ion-nav-title><span translate="photo"></span></ion-nav-title><ion-content \nscroll-sista="header-tabs" class="animated fadeIn"><photo-list id="vm.id" profile="true" load="vm.openProfile" \nopen-likers="vm.openLikers" on-reload="onReload"></photo-list></ion-content></ion-view>');
$templateCache.put('app/main/share/share-modal.html','<ion-modal-view class="modal-share"><form name="rForm" novalidate><ion-header-bar class="bar bar-{{theme}}"><button \nclass="button button-clear button-clear" ng-click="close()" translate="cancel"></button><div class="title" \ntranslate="shareGalleryText"></div><button class="button button-clear" ng-click="submit(rForm, form)" \ntranslate="submit"></button></ion-header-bar><ion-content><div class="list"><div class="item item-thumbnail-left"><img \nng-src="{{image}}" ng-click="editFilter()"><textarea mentio mentio-trigger-char="\'@\'" mentio-items="people" \nmentio-template-url="app/mentio/people-mentions.html" mentio-search="searchPeople(term)" \nmentio-select="getPeopleTextRaw(item)" mentio-id="\'theTextArea\'" ng-trim="false" type="text" ng-model="form.title" \nplaceholder="{{ \'description\'|translate }}"></textarea></div><label class="item item-input item-select"><div \nclass="input-label" translate="privacity"></div><select><option value="public" translate="public"></option><option \nvalue="follow" translate="followers"></option><option value="me" translate="me"></option></select></label><div \nclass="item item-divider" translate="shareLocation"></div><div class="item item-icon-left" ion-location \nng-model="form.address" ng-if="!form.address.resume"><i class="icon ion-ios-location"></i> <span translate="addLocale">\n</span></div><a class="item item-icon-left item-button-right" ng-if="form.address.resume"><i \nclass="icon ion-ios-location"></i><h2>{{form.address.name || form.address.resume}}</h2><p>{{form.address.resume}}</p>\n<button class="button button-icon" ng-click="closeAddress()"><i class="icon ion-ios-close"></i></button></a><div \nclass="item item-divider" translate="selectAlbumText"></div><div class="item item-thumbnail-left" gallery-album-modal \nng-model="form.album"><img ng-src="{{form.album.imageThumb._url || \'img/albumnone.png\'}}"><h2 \nng-if="!form.album.title" translate="clickSelectAlbum"></h2><h2 ng-if="form.album" ng-bind="form.album.title"></h2><p \nng-if="form.album">{{form.album.qtyPhotos}} photos</p></div></div></ion-content></form></ion-modal-view>');
$templateCache.put('app/main/tab/main-tab.html','<ion-view cache-view="true"><ion-nav-bar class="bar bar-{{theme}}"><ion-nav-back-button></ion-nav-back-button>\n</ion-nav-bar><ion-tabs class="tabs-light tabs-photogram"><ion-tab icon-on="ion-ios-home" \nicon-off="ion-ios-home-outline" ui-sref="tab.home"><ion-nav-view name="tabHome"></ion-nav-view></ion-tab><ion-tab \nicon-on="ion-ios-world" icon-off="ion-ios-world-outline" ui-sref="tab.search"><ion-nav-view name="tabSearch">\n</ion-nav-view></ion-tab><ion-tab class="middle" icon-on="ion-ios-camera" icon-off="ion-ios-camera-outline" \nng-click="vm.postPhoto()"><ion-nav-view name="tabCapture"></ion-nav-view></ion-tab><ion-tab icon-on="ion-ios-heart" \nicon-off="ion-ios-heart-outline" badge="badge" ui-sref="tab.activity"><ion-nav-view name="tabActivity"></ion-nav-view>\n</ion-tab><ion-tab icon-on="ion-ios-person" icon-off="ion-ios-person-outline" ui-sref="tab.account"><ion-nav-view \nname="tabProfile"></ion-nav-view></ion-tab></ion-tabs></ion-view>');
$templateCache.put('app/main/tab-account/account.html','<ion-view cache-view="false" id="account-view"><ion-nav-title><span>{{ vm.user.attributes.name }}</span>\n</ion-nav-title><ion-nav-buttons side="right"><button settings-modal class="button button-icon icon ion-gear-a">\n</button></ion-nav-buttons><ion-content><div class="profile-top"><div class="row"><div class="col-25"><img \nclass="avatar" user-avatar ng-model="currentUser" img-cache ic-default="img/user.png" \nic-src="{{ currentUser.photo.url() || \'img/user.png\' }}"></div><div class="col col-statics"><div class="row"><div \nclass="col"><span ng-if="!vm.loading" class="text-center">{{ vm.user.attributes.galleriesTotal || 0}}</span>\n<ion-spinner ng-if="vm.loading"></ion-spinner><h3 translate="postsText"></h3></div><div class="col" \nng-click="vm.openFollowers()"><span ng-if="!vm.loading" class="text-center">{{ vm.user.attributes.followersTotal || 0}}\n</span><ion-spinner ng-if="vm.loading"></ion-spinner><h3 translate="followersText"></h3></div><div class="col" \nng-click="vm.openFollowing()"><span ng-if="!vm.loading" class="text-center">\n{{ vm.user.attributes.followingsTotal || 0}}</span><ion-spinner ng-if="vm.loading"></ion-spinner><h3 \ntranslate="followingText"></h3></div></div><div class="row col-edit"><div class="col"><button profile-modal-edit \nuser="vm.user" class="button"><div translate="editProfile"></div></button></div></div></div></div><div class="padding">\n<span class="user-username">{{ vm.user.attributes.name }}</span><p class="user-status">{{ vm.user.attributes.status }}\n</p></div></div><div class="item bar"><div class="button-bar"><button class="button button-icon icon ion-grid" \nng-class="{\'active\': vm.tab.grid}" ng-click="vm.changeTab(\'grid\')"></button> <button \nclass="button button-icon icon ion-ios-camera-outline" ng-class="{\'active\': vm.tab.album}" \nng-click="vm.changeTab(\'album\')"></button> <button class="button button-icon icon ion-drag" \nng-class="{\'active\': vm.tab.list}" ng-click="vm.changeTab(\'list\')"></button> <button \nclass="button button-icon icon ion-ios-location-outline" ng-class="{\'active\': vm.tab.map}" \nng-click="vm.changeTab(\'map\')"></button></div></div><div class="tab" ng-if="vm.tab.grid && !vm.loading"><div \nclass="item item-divider" translate="recent"></div><photo-grid username="vm.user.attributes.username" \non-reload="onReload"></photo-grid></div><div class="tab" ng-if="vm.tab.album && !vm.loading"><div \nclass="item item-divider" translate="albums"></div><album-grid username="vm.user.attributes.username" \non-reload="onReload"></album-grid></div><div class="tab" ng-if="vm.tab.list && !vm.loading"><div \nclass="item item-divider" translate="recent"></div><photo-list username="vm.user.attributes.username" \non-reload="onReload"></photo-list></div><div class="tab" ng-if="vm.tab.map && !vm.loading"><div \nclass="item item-divider" translate="map"></div><map-photo-user username="vm.user.attributes.username" \non-reload="onReload"></map-photo-user></div></ion-content></ion-view>');
$templateCache.put('app/main/tab-activity/activity.html','<ion-view class="list-activity"><ion-nav-title><span translate="activities"></span></ion-nav-title><ion-content><div \nclass="center padding" ng-if="loading &&!data.length"><ion-spinner></ion-spinner></div><div class="center padding" \nng-if="showErrorView"><div class="error"><i class="icon icon-large ion-ios-cloud-download-outline"></i><p>\n{{ "errorText" | translate }}</p><button class="button button-positive" ng-click="onReload()">\n{{ "tryAgainText" | translate }}</button></div></div><div class="center padding" ng-if="showEmptyView"><div \nclass="error"><i class="icon icon-large ion-android-alert"></i><p>{{ "activityNotFoundText" | translate }}</p></div>\n</div><ion-refresher pulling-text="{{\'loadingText\'| translate}}" on-refresh="onReload()"></ion-refresher><div \nclass="list"><div class="item item-avatar item-animate1" ng-repeat="item in data | orderBy:\'createdAt\':true"><img \nimg-cache ic-default="img/user.png" ic-src="{{ item.user.photo._url  || \'./img/user.png\'}}"><h2 \nng-click="openProfile(item.user.username)">{{ item.user.username}}</h2><div class="text">{{ item.action | translate }}\n</div><p>{{ item.createdAt | amTimeAgo }}</p><div class="img-right" ng-if="item.item.gallery"><img img-cache \nic-default="img/user.png" ic-src="{{ item.item.gallery.attributes.imageThumb._url}}"></div><div \nclass="item-button-right" ng-if="!item.item.gallery"><button class="button button-positive" \nng-disabled="item.user.loading" \nng-class="{\'button-unfollow\': item.user.isFollow, \'button-outline\': !item.user.isFollow}" ng-click="follow(item.user)">\n<div ng-show="!item.user.isFollow" translate>follow</div><div ng-show="item.user.isFollow" translate>unfollow</div>\n</button></div></div></div><ion-infinite-scroll on-infinite="onLoadMore()" ng-if="moreDataCanBeLoaded" spinner \ndistance="1%"></ion-infinite-scroll></ion-content></ion-view>');
$templateCache.put('app/main/tab-home/home.html','<ion-view id="view-home"><ion-nav-buttons side="left"><button \nclass="button button-icon icon ion-ios-personadd-outline" ui-sref="tab.homeUserlist"></button></ion-nav-buttons>\n<ion-nav-title><span class="icon2-logo"></span></ion-nav-title><div class="bar bar-subheader bar-positive"><div \nclass="button-bar"><button class="button button-block button-positive icon-left ion-android-globe" \nng-click="vm.onFeed(\'public\')" ng-class="{\'active\': vm.type ===\'public\'}" translate="public"></button> <button \nclass="button button-block button-positive icon-left ion-ios-people" ng-click="vm.onFeed(\'follow\')" \nng-class="{\'active\': vm.type ===\'follow\'}" translate="followers"></button> <button \nclass="button button-block button-positive icon-left ion-ios-locked" ng-click="vm.onFeed(\'me\')" \nng-class="{\'active\': vm.type ===\'me\'}" translate="me"></button></div></div><ion-content class="has-header">\n<ion-refresher pulling-text="Loading" on-refresh="onReload()"></ion-refresher><photo-list profile="true" \ntype="vm.type" load="vm.openProfile" open-likers="vm.openLikers" on-reload="onReload"></photo-list></ion-content>\n</ion-view>');
$templateCache.put('app/main/tab-search/search.html','<ion-view><ion-nav-title><span>{{ \'searchText\' | translate }}</span></ion-nav-title><ion-nav-buttons side="right">\n<button class="button button-icon ion-ios-location" ui-sref="tab.map"></button></ion-nav-buttons><ion-header-bar \nclass="bar bar-{{theme}} bar-subheader item-input-inset"><label class="item-input-wrapper"><i \nclass="icon ion-ios-search placeholder-icon"></i> <input type="text" ng-model="searchValue" ng-change="onSearch()" \nng-model-options="{debounce:1000}" style="text-transform:lowercase" placeholder="{{ \'searchText\' | translate }}">\n</label><button class="button button-clear" ng-if="searchValue.length>1" ng-click="clearSearch()" translate="cancel">\n</button></ion-header-bar><ion-content class="has-subheader"><ion-refresher pulling-text="Loading" \non-refresh="onReload()"></ion-refresher><div class="center padding" ng-if="showErrorView"><div class="error"><i \nclass="icon icon-large ion-ios-cloud-download-outline"></i><p>{{ "errorText" | translate }}</p><button \nclass="button button-primary" ng-click="onReload">{{ "tryAgainText" | translate }}</button></div></div><div \nclass="center padding" ng-if="showEmptyView"><div class="error"><i class="icon icon-large ion-android-alert"></i><p>\n{{ "galleriesNotFoundText" | translate }}</p></div></div><div class="center padding" ng-if="loading"><ion-spinner>\n</ion-spinner></div><div class="row" ng-if="$index % 3 === 0" ng-repeat="image in data | orderBy:\'createdAt\':true"><div\n class="col col-33" ui-sref="tab.searchProfile({username: data[$index].user.username})"><img profile-modal \nuser="data[$index].user.obj" img-cache ic-default="img/user.png" ic-src="{{ data[$index].imageThumb._url}}" \nwidth="100%"></div><div class="col col-33" ng-if="$index + 1" \nui-sref="tab.searchProfile({username: data[$index].user.username})"><img profile-modal \nuser="data[$index + 1].user.obj" img-cache ic-default="img/user.png" ic-src="{{ data[$index + 1].imageThumb._url}}" \nwidth="100%"></div><div class="col col-33" ng-if="$index + 2" \nui-sref="tab.searchProfile({username: data[$index].user.username})"><img profile-modal \nuser="data[$index + 2].user.obj" img-cache ic-default="img/user.png" ic-src="{{ data[$index + 2].imageThumb._url}}" \nwidth="100%"></div></div><ion-infinite-scroll on-infinite="onLoadMore()" ng-if="moreDataCanBeLoaded" spinner \ndistance="1%"></ion-infinite-scroll></ion-content></ion-view>');
$templateCache.put('app/main/tab-search-map/searchMap.html','<ion-view id="view-map"><ion-nav-title>{{ \'mapTitle\' | translate }}</ion-nav-title><ion-content scroll="false"><div \nid="map_canvas" data-tap-disabled="true"></div></ion-content><ion-footer-bar><div class="row" ng-if="loading"><div \nclass="col"><div class="center"><ion-spinner></ion-spinner></div></div></div><button ng-if="!loading" \nclass="button button-positive button-block button-outline" ng-click="onSearchHere()">{{ \'searchInHere\' | translate }}\n</button></ion-footer-bar></ion-view>');
$templateCache.put('app/main/user-avatar/user-avatar.html','<ion-view><ion-header-bar class="bar-positive"><h1 class="title" translate="Profile"></h1></ion-header-bar>\n<ion-content><div class="row step1"><div class="col"><img class="avatar" user-avatar ng-model="user" \nng-src="{{ currentUser.photo.url() || \'img/user.png\' }}"></div></div><div class="step2"><form name="myForm" \nnovalidate="novalidate" on-submit="submitAvatar(myForm, form)"><label class="item item-input validated"><i \nclass="icon icon-envelope placeholder-icon"></i> <input required="required" type="email" name="email" \nng-model="form.email" placeholder="user@example.com"></label><label class="item item-input validated"><i \nclass="icon ion-at placeholder-icon"></i> <input required="required" type="text" name="username" \nng-model="form.username" ng-minlength="4" ng-maxlength="12" ng-model-options="{debounce: 1000}" \nplaceholder="{{\'yourLogin\' | translate}}"></label><div ng-if="myForm.username.$dirty"><div \nng-messages="myForm.email.$error" class="validation-error"><div ng-message="required" translate="usernameRequired">\n</div><div ng-message="email" translate="usernameInUse"></div></div><div ng-messages="myForm.email.$pending" \nclass="validation-pending"><div ng-message="email" translate="checkingUsername"></div></div></div><label \nclass="item item-input validated"><i class="icon icon-user placeholder-icon"></i> <input required type="text" \nname="name" ng-model="form.name" placeholder="{{\'name\'|translate}}"></label><label class="item item-input validated"><i\n class="icon ion-pound placeholder-icon"></i> <input required type="text" name="status" ng-model="form.status" \nplaceholder="{{\'status\'|translate}}"></label><div class="padding"><button class="button button-block button-positive" \ntype="submit" translate="{{\'submit\' | translate}}"></button></div></form></div></ion-content></ion-view>');
$templateCache.put('app/main/user-followers/user-followers.html','<ion-view id="user-list"><ion-nav-title><span translate="followersText"></span></ion-nav-title><ion-header-bar \nclass="bar bar-{{theme}} bar-subheader item-input-inset"><label class="item-input-wrapper"><i \nclass="icon ion-ios-search placeholder-icon"></i> <input type="text" ng-model="searchValue" \nstyle="text-transform:lowercase" placeholder="{{ \'searchText\' | translate }}"></label><button \nclass="button button-positive button-clear" ng-if="searchValue.length>1" ng-click="clearSearch()" translate="cancel">\n</button></ion-header-bar><ion-content class="has-subheader"><div class="center padding" ng-if="vm.loading">\n<ion-spinner></ion-spinner></div><div class="list"><div ng-repeat="user in vm.users | filter:searchValue"><a \nclass="item item-avatar item-button-right"><img img-cache ic-default="img/user.png" \nic-src="{{ user.photo._url || \'img/user.png\'}}" ng-click="vm.openProfile(user)"><h2 ng-click="vm.openProfile(user)">\n{{user.username}}</h2><p>{{user.status}}</p><button class="button button-positive" \nng-class="{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}" ng-click="vm.follow(user)"><div \nng-show="!user.isFollow" translate>follow</div><div ng-show="user.isFollow" translate>unfollow</div></button> </a><span\n class="row"><span class="col" ng-repeat="gallery in user.galleries"><img img-cache ic-default="img/user.png" \nic-src="{{ gallery.imageThumb._url}}" id="{{ ::gallery.id}}"></span></span></div></div></ion-content></ion-view>');
$templateCache.put('app/main/user-following/user-following.html','<ion-view id="user-list"><ion-nav-title><span translate="followingText"></span></ion-nav-title><ion-header-bar \nclass="bar bar-{{theme}} bar-subheader item-input-inset"><label class="item-input-wrapper"><i \nclass="icon ion-ios-search placeholder-icon"></i> <input type="text" ng-model="searchValue" \nstyle="text-transform:lowercase" placeholder="{{ \'searchText\' | translate }}"></label><button \nclass="button button-positive button-clear" ng-if="searchValue.length>1" ng-click="clearSearch()" translate="cancel">\n</button></ion-header-bar><ion-content class="has-subheader"><div class="center padding" ng-if="vm.loading">\n<ion-spinner></ion-spinner></div><div class="list"><div ng-repeat="user in vm.users | filter:searchValue"><a \nclass="item item-avatar item-button-right"><img img-cache ic-default="img/user.png" \nic-src="{{ user.photo._url || \'img/user.png\'}}" ng-click="vm.openProfile(user)"><h2 ng-click="vm.openProfile(user)">\n{{user.username}}</h2><p>{{user.status}}</p><button class="button button-positive" \nng-class="{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}" ng-click="vm.follow(user)"><div \nng-show="!user.isFollow" translate>follow</div><div ng-show="user.isFollow" translate>unfollow</div></button> </a><span\n class="row"><span class="col" ng-repeat="gallery in user.galleries"><img img-cache ic-default="img/user.png" \nic-src="{{ gallery.imageThumb._url}}" id="{{ ::gallery.id}}"></span></span></div></div></ion-content></ion-view>');
$templateCache.put('app/main/user-intro/user-intro.html','<ion-view id="user-layout" class="view-intro bg-animate" cache-view="false"><div class="bar bar-header"><ion-language>\n</ion-language></div><ion-content scroll="false"><div class="intro-slider"><ion-slide-box active-slide="slideIndex" \nshow-pager="true" on-slide-changed="vm.slideChanged($index)"><ion-slide ng-repeat="item in vm.slides track by $index">\n<div class="content" ng-if="$index == vm.slideIndex"><span class="top"><h2>{{ item.text | translate }}</h2></span><div \nclass="phone {{ vm.device }}"><img ng-src="{{ item.img }}"></div></div></ion-slide></ion-slide-box></div><button \nclass="button button-positive button-fab left" ng-if="vm.slideIndex" ng-click="vm.previous()"><i \nclass="icon ion-ios-arrow-left"></i></button> <button class="button button-positive button-fab right" \nng-hide="vm.slideIndex === vm.slides.length-1" ng-click="vm.next()"><i class="icon ion-ios-arrow-right"></i></button>\n</ion-content><ion-footer-bar><facebook-login></facebook-login><div class="row"><button \nclass="button button-block button-calm" translate="register" signup-modal></button> <button \nclass="button button-block button-positive" translate="signin" signin-modal></button></div></ion-footer-bar></ion-view>');
$templateCache.put('app/main/user-layout/user-layout.html','<ion-view id="user-layout" class="bg-animate"><ion-content padding="false"><ion-nav-view></ion-nav-view></ion-content>\n</ion-view>');
$templateCache.put('app/main/user-likers/user-likers.html','<ion-view id="user-list"><ion-nav-title><span translate="likersText"></span></ion-nav-title><ion-header-bar \nclass="bar bar-subheader item-input-inset"><label class="item-input-wrapper"><i \nclass="icon ion-ios-search placeholder-icon"></i> <input type="text" ng-model="searchValue" \nstyle="text-transform:lowercase" placeholder="{{ \'searchText\' | translate }}"></label><button \nclass="button button-positive button-clear" ng-if="searchValue.length>1" ng-click="clearSearch()" translate="cancel">\n</button></ion-header-bar><ion-content class="has-subheader"><div class="center padding" ng-if="vm.loading">\n<ion-spinner></ion-spinner></div><div class="list"><div ng-repeat="user in vm.users | filter:searchValue"><a \nclass="item item-avatar item-button-right"><img img-cache ic-default="img/user.png" \nng-src="{{ user.photo._url || \'img/user.png\'}}" ng-click="vm.openProfile(user)"><h2 ng-click="vm.openProfile(user)">\n{{user.username}}</h2><p>{{user.status}}</p><button class="button button-positive" \nng-class="{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}" ng-click="vm.follow(user)"><div \nng-show="!user.isFollow" translate>Follow</div><div ng-show="user.isFollow" translate>Unfollow</div></button> </a><span\n class="row"><span class="col" ng-repeat="gallery in user.galleries"><img img-cache ic-default="img/user.png" \nng-src="{{ gallery.imageThumb._url}}" id="{{ ::gallery.id}}"></span></span></div></div></ion-content></ion-view>');
$templateCache.put('app/main/user-list/user-list.html','<ion-view id="user-list"><ion-nav-title><span translate="findPeople"></span></ion-nav-title><ion-header-bar \nclass="bar bar-{{theme}} bar-subheader item-input-inset"><label class="item-input-wrapper"><i \nclass="icon ion-ios-search placeholder-icon"></i> <input type="text" ng-model="searchValue" ng-change="onSearch()" \nng-model-options="{debounce:1000}" style="text-transform:lowercase" placeholder="{{ \'searchText\' | translate }}">\n</label><button class="button button-clear" ng-if="searchValue.length>1" ng-click="clearSearch()" translate="cancel">\n</button></ion-header-bar><ion-content class="has-subheader"><div class="center padding" ng-if="showErrorView"><div \nclass="error"><i class="icon icon-large ion-ios-cloud-download-outline"></i><p>{{ "errorText" | translate }}</p><button\n class="button button-primary" ng-click="onReload()">{{ "tryAgainText" | translate }}</button></div></div><div \nclass="center padding" ng-if="showEmptyView"><div class="error"><i class="icon icon-large ion-android-alert"></i><p>\n{{ "galleriesNotFoundText" | translate }}</p></div></div><ion-refresher pulling-text="{{\'loadingText\'| translate}}" \non-refresh="onReload()"></ion-refresher><div class="center padding" ng-if="loading &&!data.length"><ion-spinner>\n</ion-spinner></div><div class="list"><div ng-repeat="user in data "><a class="item item-avatar item-button-right"><img\n img-cache ic-default="img/user.png" ic-src="{{ user.photo._url || \'img/user.png\'}}" ng-click="openProfile(user)"><h2 \nng-click="openProfile(user)">{{user.username}}</h2><p>{{user.status}}</p><button class="button button-positive" \nng-disabled="user.loading" ng-class="{\'button-unfollow\': user.isFollow, \'button-outline\': !user.isFollow}" \nng-click="follow(user)"><div ng-show="!user.isFollow" translate>follow</div><div ng-show="user.isFollow" translate>\nunfollow</div></button> </a><span class="row"><span class="col" ng-repeat="gallery in user.galleries"><img img-cache \nic-default="img/user.png" ic-src="{{ gallery.imageThumb._url}}" id="{{ ::gallery.id}}"></span></span></div></div>\n<ion-infinite-scroll on-infinite="onLoadMore()" ng-if="moreDataCanBeLoaded" spinner distance="1%">\n</ion-infinite-scroll></ion-content></ion-view>');
$templateCache.put('app/main/user-merge/merge.html','<ion-view id="user-layout" class="bg-animate" cache-view="false"><ion-content class="view-avatar padding"><div \nclass="row step1"><div class="col"><img class="avatar" user-avatar \nng-src="{{ tempUser.attributes.photo._url || \'./img/user.png\' }}"></div></div><div class="step2"><form name="myForm" \nnovalidate="novalidate" ng-submit="submitMerge(myForm, form)"><label class="item item-input"><i \nclass="icon icon-envelope placeholder-icon"></i> <input required="required" type="email" name="email" \nng-model="form.email" disabled="disabled" placeholder="user@example.com"></label><label class="item item-input"><i \nclass="icon icon-user placeholder-icon"></i> <input required="required" type="text" name="username" \nng-model="form.username" username-validator ng-minlength="4" ng-maxlength="12" ng-model-options="{debounce: 1000}" \nng-pattern="/^[a-zA-Z\'. -]+$/" placeholder="{{\'yourLogin\' | translate}}"></label><div ng-if="myForm.username.$dirty">\n<div ng-messages="myForm.email.$error" class="validation-error"><div ng-message="required" \ntranslate="usernameRequired"></div><div ng-message="email" translate="usernameInUse"></div></div><div \nng-messages="myForm.email.$pending" class="validation-pending"><div ng-message="email" translate="checkingUsername">\n</div></div></div><label class="item item-input"><i class="icon icon-lock placeholder-icon"></i> <input required \ntype="password" name="password" ng-model="form.password" placeholder="{{\'password\'|translate}}"></label><button \nclass="button button-block button-outline button-light" type="submit" translate="{{\'submit\' | translate}}"></button>\n</form></div><div class="padding step3"><button ng-click="vm.submit(rForm, vm.form)" \nclass="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <span translate="mergeAccount">\n</span></button></div></ion-content></ion-view>');
$templateCache.put('app/component/ion-photo/view/filter.modal.html','<ion-modal-view id="photo-filter"><ion-header-bar class="bar bar-{{theme}}"><button \nclass="button button-clear button-icon ion-ios-arrow-thin-left" ng-click="closeModalFilter()"></button><div \nclass="title">{{ \'Filter\' | translate }}</div><button class="button button-icon" ng-click="submitFilter()"><i \nclass="icon ion-ios-arrow-thin-right"></i></button></ion-header-bar><ion-content><div class="box-image"><img \nid="image" src="{{form.photo}}" ng-hide="loading"><ion-spinner ng-show="loading"></ion-spinner></div><img id="image3" \nsrc="" style="display: none"><div ng-show="showFilter" class="slider-filters animate1"><ion-scroll direction="x" \nclass="image-filter"><a ng-repeat="filter in imageFilters" ng-click="applyFilter(filter)"><p>{{ filter.name }}</p><img \nid="{{filter.id}}" class="img-filter" src=""></a></ion-scroll><div class="row"><div class="col"><button \nclass="button button-block bold">Filter</button></div><div class="col"><button class="button button-block" \nng-click="actionShowFilter(false)">Edit</button></div></div></div><div ng-hide="showFilter" class="slider-filters"><div\n ng-show="filterEdit" class="slider-filters"><p class="text-center">{{filter.name}}</p><div \nclass="item range range-positive"><input type="range" min="-100" max="100" ng-model="filter.slider.value" \nng-model-options="{debounce:100}" step="0.1"></div><div class="row"><div class="col"><button \nclass="button button-block" ng-click="cancelFilter(filter)">Cancel</button></div><div class="col"><button \nclass="button button-block bold" ng-click="doneFilter()">Done</button></div></div></div><div ng-show="!filterEdit" \nclass="slider-filters"><ion-scroll direction="x"><a ng-repeat="filter in filters" ng-click="selectFilter(filter)"><p>\n{{ filter.name }}</p><i class="icon {{filter.icon}}"></i> </a><a ng-click="reset()"><p>Reset</p><i \nclass="icon ion-android-refresh"></i></a></ion-scroll><div class="row"><div class="col"><button \nclass="button button-block" ng-click="actionShowFilter(true)">Filter</button></div><div class="col"><button \nclass="button button-block bold">Edit</button></div></div></div></div></ion-content></ion-modal-view>');
$templateCache.put('app/component/ion-photo/view/modal.share.photo.html','<ion-modal-view class="modal-share"><ion-header-bar class="bar-dark"><div class="title">{{ ::\'Share\' | translate }}\n</div><button class="button button-positive" ng-click="modal.hide()"><i class="icon ion-arrow-right-b"></i></button>\n</ion-header-bar><ion-content ng-cloak><div id="image"><img ng-src="{{ ::form.photo}}"><div class="title">\n{{ ::form.title }}</div></div><ul class="list"><li class="padding"><button ng-repeat="social in sociais" \nng-click="share(form, social)" class="button button-block button-{{ social }}"><i class="icon ion-social-{{ social }}">\n</i> {{ ::social | uppercase }}</button></li></ul></ion-content></ion-modal-view>');}]);
}());
