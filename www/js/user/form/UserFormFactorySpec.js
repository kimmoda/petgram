describe('Service: app.user.UserForm', function () {

    // load the service's module
    beforeEach(module('app.user'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (UserForm) {
        service = UserForm;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
