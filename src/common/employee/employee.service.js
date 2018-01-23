'use strict';

angular.
  module('common.employee').
  factory('Employee', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/employee/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheEmployee : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(employee) {
        return employee.id ? this.api.update(employee).$promise : this.api.save(employee).$promise;
      }

      function remove(employee) {
        return this.api.remove({id: employee.id}).$promise;
      }
    }
  ]);
