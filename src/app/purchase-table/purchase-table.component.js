'use strict';

// Register the 'purchaseTable' page along with its controller an template
angular.
  module('purchaseTable').
  component('purchaseTable', {
    templateUrl: 'app/purchase-table/purchase-table.template.html',
    controller: ['Purchase', 'Project', 
      //get the items of the table
      function PurchaseTableController(Purchase, Project) {
        this.purchases = Purchase.api.query();

        //init the params variable
        this.params = {
          amount: '',
          amountTop: 10000,
          amountBot: 0,
          item:'',
          chProj:'All',
          reqProj:'All',
          status:'All',
          supplier:'All',
          type:'All',
          page: 0,
          size: 50
        }

        //retrieve the list of projects, status, type and supplier
        this.projList = Project.api.query();
        
        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        this.search = function() { 
          return this.purchases = Purchase.search(this.params);
        }

        this.removeItem = function(purchase) {
          Purchase.remove(purchase)
          .then(
            function(){
              console.log('Succesfully removed') 
              purchases = Purchase.api.query()},
            function(err){console.error('The item could not be deleted:', err.status, err.statusText)},
          ).then(this.purchases = Purchase.api.query())
        }
      }
    ]
  });
