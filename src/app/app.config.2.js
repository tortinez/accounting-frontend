'use strict';

angular.
  module('AccountingFEapp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/login', {
          template: '<auth-form></auth-form>',
          access: {
            isFree: true
          }
        }).
        when('/purchases', {
          template: '<purchase-table></purchase-table>',
          access: {
            isFree: false
          }
        }).
        when('/purchaseform/:id', {
          template: '<purchase-form></purchase-form>',
          access: {
            isFree: false
          }
        }).
        when('/purchaseform', {
          template: '<purchase-form></purchase-form>',
          access: {
            isFree: false
          }
        }).
        otherwise('/login');
    }
  ]).run(function() {
    this.$on("$locationChangeStart", function(event, next, current) {
      for(var i in $routeProvider)  {
        if(next.indexOf(i) != -1) {
          if($routeProvider.access.isFree && !Auth.isAuthenticated) {
            event.preventDefault();
          }
        }
      }
    });
  });
