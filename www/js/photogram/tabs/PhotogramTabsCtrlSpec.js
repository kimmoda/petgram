describe('Controller: app.photogram.PhotogramTabs', function () {

    // load the controller's module
    beforeEach(module('app.photogram'));

    var ctrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('PhotogramTabs', {
            $scope: scope
        });
    }));

    it('should be defined', function () {
        expect(ctrl).toBeDefined();
    });
});
