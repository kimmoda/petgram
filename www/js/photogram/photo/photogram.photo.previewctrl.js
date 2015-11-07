(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramPreviewCtrl', PhotogramPreviewCtrl);


    function PhotogramPreviewCtrl(photo) {
        var vm  = this;
        vm.data = photo;
        console.log(photo);
    }


})(window, window.angular);
