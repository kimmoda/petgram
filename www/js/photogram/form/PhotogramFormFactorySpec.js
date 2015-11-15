describe('Service: app.photogram.PhotogramForm', function () {

    // load the service's module
    beforeEach(module('app.photogram'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (PhotogramForm) {
        service = PhotogramForm;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
