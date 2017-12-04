'use strict';

angular.
  module('common.project').
  factory('Project', ['$resource',
    function ($resource) {
      return {
        api: $resource('http://localhost:1337/localhost:8080/api/project/:id', {id: '@id'}, {
          
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
