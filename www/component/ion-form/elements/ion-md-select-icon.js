//https://github.com/domiSchenk/ionic-Select-Control
'use strict';
angular
    .module ('ion-form')
    .directive ('ionMdSelectIcon', function () {
    return {
        restrict  : 'E',
        require   : [
            'ngModel',
            'ngData',
            'ngSelectedId',
            'ngSelectedValue',
            '?ngTitle',
            '?color',
            'ngiItemName',
            'ngItemId'
        ],
        template  : '<input id="showed" type="text" ng-click="showSelectModal()" style="cursor:inherit;" readonly />' + '<span id="hidden" type="text" style="display: none;"></span>',
        controller: function ($scope, $element, $attrs, $ionicModal, $parse) {
            $scope.modal = {};


            $scope.showSelectModal = function () {
                var val     = $parse ($attrs.ngData);
                $scope.data = val ($scope);

                $scope.modal.show ();
            };

            $scope.closeSelectModal = function () {
                $scope.modal.hide ();
            };

            $scope.$on ('$destroy', function (id) {
                $scope.modal.remove ();
            });

            $scope.modal = $ionicModal.fromTemplate ('<ion-modal-view id="select">' +
                '<ion-header-bar class="bar bar-' +
                $attrs.color +
                '" align-title="center">' +
                '<h1 class="title">' +
                $attrs.ngTitle +
                '</h1>' +
                ' <a ng-click="closeSelectModal()" class="button button-icon icon ion-ios7-close-empty"></a>' +
                '</ion-header-bar>' +
                '<ion-content>' +
                '<ion-list>' +
                '<ion-item class="item item-icon-left"  ng-click="clickItem(item)" ng-repeat="item in data">' +

                '<i class="icon ' + item.ngItemIcon + '"></i>' +

                '</ion-item>' +
                    //'<ion-item  ng-click="clickItem(item)" ng-repeat="item in data" ng-bind-html="item[\'' + $attrs.ngItemName + '\']"></ion-item>' +
                '</ion-list>' +
                ' </ion-content>' +
                '</ion-modal-view>', {
                scope: $scope
            });

            $scope.clickItem = function (item) {
                var index = $parse ($attrs.ngSelectedId);
                index.assign ($scope.$parent, item[$attrs.ngItemId]);

                var value = $parse ($attrs.ngSelectedValue);
                value.assign ($scope.$parent, item[$attrs.ngItemName]);

                $scope.closeSelectModal ();
            };
        },
        compile   : function ($element, $attrs) {
            var input = $element.find ('input');
            angular.forEach ({
                'name'       : $attrs.name,
                'placeholder': $attrs.ngPlaceholder,
                'ng-model'   : $attrs.ngSelectedValue
            }, function (value, name) {
                if (angular.isDefined (value)) {
                    input.attr (name, value);
                }
            });

            var span = $element.find ('span');
            if (angular.isDefined ($attrs.ngSelectedId)) {
                span.attr ('ng-model', $attrs.ngSelectedId);
            }
        }
    };
});