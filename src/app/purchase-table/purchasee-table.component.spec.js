'use strict';

describe('invoiceTable', function() {

  // Load the module that contains the 'invoiceTable' component before each test
  beforeEach(module('invoiceTable'));

  // Test the controller
  describe('invoiceTableController', function() {
    var $httpBackend, ctrl;

    beforeEach(inject(function($componentController, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:1337/localhost:8080/api/purchase')
                  .respond([{item: 'Nexus S'}, {item: 'Motorola DROID'}]);

      ctrl = $componentController('invoiceTable');
    }));

    it('should create a `phones` property with 2 phones fetched with `$http`', function() {
      jasmine.addCustomEqualityTester(angular.equals);

      expect(ctrl.phones).toEqual([]);

      $httpBackend.flush();
      expect(ctrl.phones).toEqual([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });

    it('should set the default Order Property to date', function() {
      expect(ctrl.orderProp).toBe('date');
    });

  });

});
