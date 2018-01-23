'use strict';

angular.
  module('common.supplier').
  factory('Supplier', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/supplier/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cacheSupplier : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(supplier) {
        return supplier.id ? this.api.update(supplier).$promise : this.api.save(supplier).$promise;
      }

      function remove(supplier) {
        return this.api.remove({id: supplier.id}).$promise;
      }
    }
  ]);
