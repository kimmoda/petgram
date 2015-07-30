'use strict';

describe ('Controller: AlimentoCtrl', function () {
    var AlimentoCtrl,
        scope;

    // load the controller's module
    beforeEach (module ('ionic'));
    beforeEach (module ('module.core'));
    beforeEach (module ('module.app'));
    beforeEach (module ('module.alimento'));


    // Initialize the controller and a mock scope
    beforeEach (inject (function ($controller, $rootScope) {
        scope        = $rootScope.$new ();
        AlimentoCtrl = $controller ('AlimentoCtrl', {
            $scope: scope
        });
    }));

    it ('should attach a list of awesomeThings to the scope', function () {
        expect (scope.angular).toBeDefined ();
    });

});