'use strict';

angular.
  module('common.status').
  factory('Status', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/status/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),
        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(project) {
        return project.id ? this.api.$update().$promise : this.api.save().$promise;
      }

      function remove(project) {
        return this.api.remove({id: purchase.id}).$promise;
      }
    }
  ]);
