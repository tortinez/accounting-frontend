'use strict';

angular.
  module('common.clientType').
  factory('ClientType', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/client-type/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheClientType : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(clientType) {
        return clientType.id ? this.api.update(clientType).$promise : this.api.save(clientType).$promise;
      }

      function remove(clientType) {
        return this.api.remove({id: clientType.id}).$promise;
      }
    }
  ]);
