'use strict';

angular.
  module('common.purchaseType').
  factory('PurchaseType', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/purchase-type/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cachePurchaseType : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(purchaseType) {
        return purchaseType.id ? this.api.update(purchaseType).$promise : this.api.save(purchaseType).$promise;
      }

      function remove(purchaseType) {
        return this.api.remove({id: purchaseType.id}).$promise;
      }
    }
  ]);
