'use strict';
angular
    .module ('module.gallery')
    .factory ('GallerySetting', function (Parse, Notify, $window, $http, $q) {

    function init () {
        Notify.showLoading ();

        new Parse
            .Query ('GallerySetting')
            .find ()
            .then (function (resp) {
            angular.forEach (resp, function (item) {
                var obj                       = {
                    key  : item.attributes.key,
                    value: item.attributes.value
                }
                $window.localStorage[obj.key] = obj.value;
            });

            Notify.hideLoading ();
        });

    }

    function get (key) {
        return $window.localStorage[key];
    }

    return {
        init: init,
        get : get
    }

});