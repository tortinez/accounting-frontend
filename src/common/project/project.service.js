'use strict';

angular.
  module('common.project').
  factory('Project', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/project/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheProject : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(project) {
        //convert binded data to id parameters
        project.managerId = project.manager.id;
        project.clientId = project.client.id;
        project.typeId = project.type.id;

        return project.id ? this.api.update(project).$promise : this.api.save(project).$promise;
      }

      function remove(project) {
        return this.api.remove({id: project.id}).$promise;
      }
    }
  ]);
