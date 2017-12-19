'use strict';

angular.
  module('common.auth').
  factory('Auth', ['$resource',
    function ($resource) {
      var vm = this;
      vm.authenticated = false;

      function resource(credentials) {
        return $resource('/api/user/self', {} , {
          //create login method
          login: {
            method: 'GET',
            headers: {'Authorization': 'Basic ' + btoa(credentials.user + ':' + credentials.password), 'withCredentials' : true},
          }
        })
       }

       function auth(credentials) {
         return resource(credentials).login().$promise
       }

       return{ login: login}
    
      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //LOGIN FUNCTION
      function login(credentials){
        return auth(credentials)
            .then(getAuthSuccess)
            .catch(getAuthFailed);

            function getAuthSuccess(response){
              vm.authenticated = !!response;
              console.log('Login success');
              return vm.authenticated;
            }

            function getAuthFailed(error) {
              console.log('Login failed');
              return false;
            }
          
      }
    }
  ]);
