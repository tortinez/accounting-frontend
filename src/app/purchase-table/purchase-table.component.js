'use strict';

// Register the 'purchaseTable' page along with its controller an template
angular.
  module('purchaseTable').
  component('purchaseTable', {
    templateUrl: 'app/purchase-table/purchase-table.template.html',
    controller: ['Purchase', 'Project', 'Auth', '$location',
      //get the items of the table
      function PurchaseTableController(Purchase, Project, Auth, $location) {
        var vm = this;
        vm.purchases = Purchase.api.query();

        //init the params variable
        vm.params = {
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

        vm.sizeOpt = [50, 75, 100];

        //retrieve the list of projects, status, type and supplier
        vm.projList = Project.api.query();
        
        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        vm.search = function() { 
          return this.purchases = Purchase.search(this.params);
        }

        vm.removeItem = function(purchase) {
          Purchase.remove(purchase)
          .then(
            function(){
              console.log('Succesfully removed') 
              vm.purchases = Purchase.api.query()},
            function(err){console.error('The item could not be deleted:', err.status, err.statusText)},
          )
        }

        vm.downloadInvoice = function(purchase){
          return window.open(['/api/purchase/' + purchase.id + '/invoice'])
        }

        vm.availableInvoice = function(purchase){
          return purchase.invoicePath==null;
        }

        vm.prevPage = function() {
          vm.params.page = vm.params.page-1;
          return vm.search();
        }

        vm.nextPage = function() {
          vm.params.page = vm.params.page+1;
          return vm.search();
        }

      }
    ]
  });
