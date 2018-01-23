'use strict';

angular.
  module('common.projectType').
  factory('ProjectType', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/project-type/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheProjectType : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(projectType) {
        return projectType.id ? this.api.update(projectType).$promise : this.api.save(projectType).$promise;
      }

      function remove(projectType) {
        return this.api.remove({id: projectType.id}).$promise;
      }
    }
  ]);
