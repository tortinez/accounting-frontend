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
controller('mainCtrl', function($scope, $location, Auth) {
  
  // execute on init
  var init = function () {
    Auth.isAuthenticated().then(function(){
      $scope.user = Auth.user;
      if ($scope.user.isLogged) $location.path("/purchases")
    });
  };
  init();
});
