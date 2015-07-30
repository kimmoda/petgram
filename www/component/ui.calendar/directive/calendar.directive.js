'use strict';
angular
    .module ('ui.calendar')
    .directive ('calendar', [
    '$ionicGesture',
    function ($ionicGesture) {

        return {
            restrict   : 'E',
            scope      : {
                date: '=ngModel'
            },
            templateUrl: 'modules/directive.ui.calendar/views/calendar.template.html',
            link       : function (scope, element, attrs) {
                $ionicGesture.on ('swipeleft', scope.swipeLeft, element);
                $ionicGesture.on ('swiperight', scope.swipeRight, element);
                $ionicGesture.on ('swipeup', scope.swipeUp, element);
                $ionicGesture.on ('swipedown', scope.swipeDown, element);
            },
            controller : function ($scope) {

                $scope.days = [];

                $scope.daysInWeek = [
                    'dom',
                    'seg',
                    'ter',
                    'qua',
                    'qui',
                    'sex',
                    'sab'
                ];
                $scope.months     = [
                    'jan',
                    'fev',
                    'mar',
                    'abr',
                    'mai',
                    'jun',
                    'jul',
                    'ago',
                    'set',
                    'out',
                    'nov',
                    'dez'
                ];

                $scope.selectDay = function (day) {
                    $scope.date.setDate (day);
                    $scope.selectedDay        = $scope.date.getDate ();
                    $scope.selectedDateBackup = angular.copy ($scope.date);
                }

                $scope.update = function () {
                    $scope.date.setMonth ($scope.month);
                    $scope.date.setFullYear ($scope.year);
                    $scope.days = [];
                    $scope.startingDays ();

                    $scope.selectedDay = null;
                    if ($scope.selectedDateBackup.getMonth () == $scope.date.getMonth () &&
                        $scope.selectedDateBackup.getFullYear () == $scope.date.getFullYear () &&
                        $scope.selectedDateBackup.getDate () == $scope.date.getDate ()) {
                        $scope.selectedDay = $scope.date.getDate ();
                    }

                    $scope.$apply ();
                }

                $scope.swipeRight = function () {
                    $scope.month--;
                    $scope.update ();
                }

                $scope.swipeUp = function () {
                    $scope.year--;
                    $scope.update ();
                }

                $scope.swipeDown = function () {
                    $scope.year++;
                    $scope.update ();
                }

                $scope.swipeLeft = function () {
                    $scope.month++;
                    $scope.update ();
                }


                $scope.startingDays = function () {
                    $scope.selectedDay = $scope.date.getDate ();
                    $scope.month       = $scope.date.getMonth ();
                    $scope.year        = $scope.date.getFullYear ()

                    $scope.getDaysInMonth ();
                }

                $scope.getDaysInMonth = function () {
                    $scope.date.setDate (1);

                    var daysCont = 28; // nao e bissexto, fev

                    // Set, Abr, Jun, Nov
                    if (/8|3|5|10/.test ($scope.month)) daysCont = 30;

                    // Nao e fev
                    if ($scope.month != 1) daysCont = 31;

                    // Ano bissexto, fev
                    if (( $scope.year % 4 == 0 && $scope.year % 100 != 0 ) || $scope.year % 400 == 0) daysCont = 29;

                    //setando os dias em vazio, para sincronizar dia da semana
                    dayInWeek++;

                    var dayInWeek = $scope.date.getDay ();
                    for (var i = 1; i <= dayInWeek; i++) {
                        $scope.days.push ('');
                    }

                    for (var i = 1; i <= daysCont; i++) {
                        $scope.days.push (i);
                    }

                    var lastDay  = new Date ();
                    lastDay.setDate (daysCont);
                    lastDay.setMonth ($scope.month);
                    lastDay.setFullYear ($scope.year);
                    var dayLimit = lastDay.getDay ();
                    for (var i = 5; i >= dayLimit; i--) {
                        $scope.days.push ('');
                    }

                    $scope.date.setDate ($scope.selectedDay);
                }

                $scope.date               = new Date ();
                $scope.selectedDateBackup = angular.copy ($scope.date);
                $scope.startingDays ();
            }
        }
    }
]);

