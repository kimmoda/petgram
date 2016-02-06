describe('Service: app.photogram.ParseFileFactory', function () {

    // load the service's module
    beforeEach(module('app.photogram'));

    // instantiate service
    var service;

    //update the injection
    beforeEach(inject(function (_ParseFileFactory_) {
        service = _ParseFileFactory_;
    }));

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(service).toBeDefined();
    });
});
