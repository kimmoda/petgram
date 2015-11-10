describe('Service: app.photogram.User', function () {

    // load the service's module
    beforeEach(module('app.photogram'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (User) {
        service = User;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
