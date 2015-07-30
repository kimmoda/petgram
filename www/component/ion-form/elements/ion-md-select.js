//https://github.com/domiSchenk/ionic-Select-Control
'use strict';
angular
    .module ('ion-form')
    .directive ('ionMdSelect', function () {
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
        template  : '<label class="item item-input item-select item-md-label">' +
        '<input type="text" ng-click="showSelectModal()" style="cursor:inherit;" readonly />' +
        '<span class="input-select"></span>' +
        '</label>',
        controller: function ($scope, $element, $attrs, $ionicModal, $parse, $timeout) {

            // Label
            var label = $element.find ('span');
            label.html ($attrs.ngTitle);

            $scope.modal = {};

            $scope.showSelectModal = function () {
                var val     = $parse ($attrs.ngData);
                $scope.data = val ($scope);
                $scope.modal.show ();
            };


            if ($attrs.autoFocus) {
                $timeout (function () {
                    $scope.showSelectModal ();
                }, 500);
            }
            ;

            $scope.closeSelectModal = function () {
                $scope.modal.hide ();
            };

            $scope.$on ('$destroy', function () {
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
                '<ion-item  ng-click="clickItem(item)" ng-repeat="item in data" ng-bind-html="item[\'' + $attrs.ngItemName + '\']"></ion-item>' +
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
        }

        ,
        compile: function ($element, $attrs) {
            var input = $element.find ('input');
            angular.forEach ({
                'name'       : $attrs.name,
                'placeholder': $attrs.ngPlaceholder,
                'ng-focus'   : $attrs.ngFocus,
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
})
;