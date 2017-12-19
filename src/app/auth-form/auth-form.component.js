'use strict';

// Register the 'authForm' page along with its controller an template
angular.
  module('authForm').
  component('authForm', {
    templateUrl: 'app/auth-form/auth-form.template.html',
    controller: ['$routeParams', '$location', 'Auth',
      function PurchaseFormController($routeParams, $location, Auth) {
        var vm = this;

        vm.credentials={}; //variable to store credentials
        
        

        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        vm.login = function(){
          return Auth.login(vm.credentials).then($location.path("/purchases"))
        }
      }
    ]
  });
