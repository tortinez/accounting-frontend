'use strict';

angular.
  module('AccountingFEapp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/invoices', {
          template: '<invoice-table></invoice-table>'
        }).
        otherwise('/invoices');
    }
  ]);
