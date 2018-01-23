'use strict';

angular.
  module('common.purchaseStatus').
  factory('PurchaseStatus', ['$resource',
    function ($resource) {
      return {
        api: $resource('/api/purchase-state/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            isArray: true,         
          },
          update: { method: 'PUT'},     
        }),

        //Cache data for editing an existing item
        cachePurchaseStatus : {},

        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      //override save and remove $resource methods
      function save(purchaseStatus) {
        return purchaseStatus.id ? this.api.update(purchaseStatus).$promise : this.api.save(purchaseStatus).$promise;
      }

      function remove(purchaseStatus) {
        return this.api.remove({id: purchaseStatus.id}).$promise;
      }
    }
  ]);
