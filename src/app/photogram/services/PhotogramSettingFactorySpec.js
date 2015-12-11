describe('Service: app.photogram.PhotogramSetting', function () {

  // load the service's module
  beforeEach(module('app.photogram'));

  // instantiate service
  var service;

  //update the injection
  beforeEach(inject(function (PhotogramSetting) {
    service = PhotogramSetting;
  }));

  /**
   * @description
   * Sample test case to check if the service is injected properly
   * */
  it('should be injected and defined', function () {
    expect(service).toBeDefined();
  });
});
