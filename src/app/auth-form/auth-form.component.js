'use strict';

// Register the 'authForm' page along with its controller an template
angular.
  module('authForm').
  component('authForm', {
    templateUrl: 'app/auth-form/auth-form.template.html',
    controller: ['$routeParams', '$location', 'Auth',
      function AuthFormController($routeParams, $location, Auth) {
        var vm = this;

        vm.credentials={}; //variable to store credentials
        

        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        vm.login = function(){
          return Auth.login(vm.credentials)
            .then(function (status) {
              if (!status) {
                vm.LoginStatus='The username or password entered is incorrect';
              }
              if (status){
                $location.path("/purchases")
              }
            })
        };
      }
    ]
  });
