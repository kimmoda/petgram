describe('Controller: app.user.UserSignupCtrl', function () {

  // load the controller's module
  beforeEach(module('app.user'));

  var ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('UserSignupCtrl', {
      $scope: scope
    });
  }));

  it('should be defined', function () {
    expect(ctrl).toBeDefined();
  });
});
