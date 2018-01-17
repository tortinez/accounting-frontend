'use strict';

// Register the 'purchaseTable' page along with its controller an template
angular.
  module('purchaseTable').
  component('purchaseTable', {
    templateUrl: 'app/purchase-table/purchase-table.template.html',
    controller: ['Purchase', 'Project', 'Auth', '$location', '$mdSidenav',
      //get the items of the table
      function PurchaseTableController(Purchase, Project, Auth, $location, $mdSidenav) {
        var vm = this;
        vm.purchases = Purchase.api.query();

        //init the filtering and pagination variable
        vm.params = {
          amountMax: 10000,
          amountMin: 0,
          dateMax: Purchase.date.max,
          dateMin: Purchase.date.min,
          item:'',
          chProj: null,
          reqProj: null,
          status: null,
          supplier: null,
          type: null,
          page: 0,
          size: 50
        }

        vm.date = Purchase.date;
        vm.autocompleteObj = {
          chProj: null,
          reqProj: null,
          status: null,
          supplier: null,
          type: null,
        }
        vm.hideFilters = true;

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

        //Related to the pagination bar buttons
        vm.prevPage = function() {
          vm.params.page = vm.params.page-1;
          return vm.search();
        }

        vm.nextPage = function() {
          vm.params.page = vm.params.page+1;
          return vm.search();
        }

        //Related to the filters
        //1. autocomplete fields
        vm.autocompleteSearch = function(query, items) {
          return !query ? items : items.filter(function(item) {
                  var lowerCaseItem = angular.lowercase(item.name);
                  var lowercaseQuery = angular.lowercase(query);
                  return lowerCaseItem.indexOf(lowercaseQuery) === 0;
                })
        }
        vm.autocompleteItemChange = function() {
          var item = vm.autocompleteObj;
          vm.params.chProj  = item.chProj ? item.chProj.name : null;
          vm.params.reqProj = item.reqProj ? item.reqProj.name : null;
          vm.params.status   = item.status ? item.status.name : null;
          vm.params.supplier = item.supplier ? item.supplier.name : null;
          vm.params.type     = item.type ? item.type.name : null;;

          return vm.search();
        }
        vm.toggleFilters = function() {
          vm.hideFilters = !vm.hideFilters;
        }
      }
    ]
  });
