'use strict';

angular.
  module('common.user').
  factory('User', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/user/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheUSer : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(user) {
        return user.id ? this.api.update(user).$promise : this.api.save(user).$promise;
      }

      function remove(user) {
        return this.api.remove({id: user.id}).$promise;
      }
    }
  ]);
