'use strict';

// Register the 'purchaseTable' page along with its controller an template
angular.
  module('purchaseTable').
  component('purchaseTable', {
    templateUrl: 'app/purchase-table/purchase-table.template.html',
    controller: ['Purchase',
      //get the items of the table and order them
      function PurchaseTableController(Purchase) {
       /*  this.displayedPurchases = Purchase.findAll(); */
        this.purchases = Purchase.findAll();

        Purchase.removeItem = function removeItem(purchase) {
          var index = this.purchases.indexOf(purchase);
          if (index !== -1) {
            this.purchases.splice(index, 1);
          }
        }
      }
    ]
  });
