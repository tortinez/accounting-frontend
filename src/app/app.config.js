'use strict';

angular.
  module('AccountingFEapp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/login', {
          template: '<auth-form></auth-form>',
          secure: false
        }).
        when('/purchases', {
          template: '<purchase-table></purchase-table>',
          secure: true
        }).
        when('/purchaseform/:id', {
          template: '<purchase-form></purchase-form>',
          secure: true
        }).
        when('/purchaseform', {
          template: '<purchase-form></purchase-form>',
          secure: true
        }).
        otherwise('/login');
    }
  ]).run(['$rootScope', '$location', 'Auth',
          function($rootScope, $location, Auth) {
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
              if(next && next.$$route && next.$$route.secure) {
                if(!Auth.user.isLogged) {
                  console.log('User not Authenticated!')
                  $rootScope.$evalAsync(function () {
                    $location.path("/login")
                  });
                  event.preventDefault();
                }
              }
            });
          }]);
