describe('Service: app.photogram.PhotogramShare', function () {

  // load the service's module
  beforeEach(module('app.photogram'));

  // instantiate service
  var service;

  //update the injection
  beforeEach(inject(function (PhotogramShare) {
    service = PhotogramShare;
  }));

  /**
   * @description
   * Sample test case to check if the service is injected properly
   * */
  it('should be injected and defined', function () {
    expect(service).toBeDefined();
  });
});
