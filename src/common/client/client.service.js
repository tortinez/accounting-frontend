'use strict';

angular.
  module('common.client').
  factory('Client', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/client/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheClient : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(client) {
        //convert binded data to id parameters
        client.typeId = client.type.id;

        return client.id ? this.api.update(client).$promise : this.api.save(client).$promise;
      }

      function remove(client) {
        return this.api.remove({id: client.id}).$promise;
      }
    }
  ]);
