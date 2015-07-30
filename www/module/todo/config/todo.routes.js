'use strict';
angular
    .module ('module.todo')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.todo', {
        url  : '/todo',
        views: {
            menuContent: {
                controller : 'TodoCtrl as Todo',
                templateUrl: 'module/todo/view/todo.home.html'
            }
        }
    })
    ;
});