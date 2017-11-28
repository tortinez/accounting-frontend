'use strict';

// Register the 'purchaseTable' page along with its controller an template
angular.
  module('purchaseTable').
  component('purchaseTable', {
    templateUrl: 'app/purchase-table/purchase-table.template.html',
    controller: ['Purchase',
      //get the items of the table and order them
      function PurchaseTableController(Purchase) {
        this.purchases = Purchase.query();
        
        this.query = {
          q: '',
          page: 0,
          size: 50
        };

        this.params = {
          amount: ''
        }

        this.search = function() {
          //this.query.q = "amount>" + this.params.amount;
          return this.purchases = Purchase.getSearch(this.query);
        }
      }
    ]
  });
