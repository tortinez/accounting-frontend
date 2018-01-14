'use strict';

angular.
  module('common.auth').
  factory('Auth', ['$resource',
    function ($resource) {
      var vm = this;
      vm.user = {
            isLogged: false,
            role: null
          }

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

       return{login: login,
              isAuthenticated: isAuthenticated,
              user: vm.user}
    
      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //LOGIN FUNCTION
      function login(credentials){
        return resource(credentials).login().$promise
            .then(getAuthSuccess)
            .catch(getAuthFailed);
      }

      //Check if user was already logged in a previous session
      function isAuthenticated(){
      var credentials={}
       return resource(credentials).get().$promise
          .then(getAuthSuccess)
          .catch(getAuthFailed)
      }
      
      
      //then & catch
      function getAuthSuccess(response){
        vm.user.isLogged = !!response;
        vm.user.role = response.roles[0];
        console.log('Login success');
        return vm.user.isLogged;
      }

      function getAuthFailed(error) {
        console.log('Login failed');
        return false;
      }
    }
  ]);
