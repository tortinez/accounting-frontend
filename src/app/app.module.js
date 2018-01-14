'use strict';

// Define the 'AccountingFEapp' module
angular.module('AccountingFEapp', [
  'ngAnimate',
  'ngMaterial',
  'md.data.table',
  'ngRoute',
  'common',
  'purchaseTable',
  'purchaseForm',
  'authForm',
]).
controller('mainCtrl', function($scope, Auth) {
  console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  
  // execute on init
  var init = function () {
    Auth.isAuthenticated().then(function(){
      $scope.user = Auth.user;
      console.log($scope.user.isLogged);
      //if (Auth.user.isLogged) $location.path("/purchases")
    });
  };
  init();
});
