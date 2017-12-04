'use strict';

angular.
  module('AccountingFEapp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/purchases', {
          template: '<purchase-table></purchase-table>'
        }).
        when('/purchaseform/:id', {
          template: '<purchase-form></purchase-form>'
        }).
        otherwise('/purchases');
    }
  ]);
