'use strict';

// Register the 'purchaseTable' page along with its controller an template
angular.
  module('purchaseTable').
  component('purchaseTable', {
    templateUrl: 'app/purchase-table/purchase-table.template.html',
    controller: ['Purchase',
      function PurchaseTableController(Purchase) {
        this.purchases = Purchase.query();
        this.orderProp = 'date';
      }
    ]
  });
