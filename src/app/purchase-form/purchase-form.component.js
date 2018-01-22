'use strict';

// Register the 'purchaseForm' page along with its controller an template
angular.
  module('purchaseForm').
  component('purchaseForm', {
    templateUrl: 'app/purchase-form/purchase-form.template.html',
    controller: ['$routeParams', '$location', '$mdDialog', 'Purchase', 'Project', 'Auth',
      function PurchaseFormController($routeParams, $location, $mdDialog, Purchase, Project, Auth) {
        var vm = this;

        //get data if exist; if not assign an empty object
        this.purchase = ($routeParams.id) ? Purchase.cachePurchase: {comments: '', requestDate : new Date().getTime()};

        //get the USER information (role)
        this.user = Auth.user;
        

        //retrieve the list of projects, status, type and supplier
        this.projList = Project.api.query();

        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        this.editPurchase = function () {
          return Purchase.save(this.purchase).then(
            function(value){
              console.log('Purchase saved: ID=', value.id);
              $location.path("/purchases")},
            function(err) {
              console.error("The purchase cannot be modified",  err.status, err.statusText)});
        };

        vm.removeItem = function(purchase) {
          Purchase.remove(purchase)
          .then(
            function(){
              console.log('Succesfully removed') 
              $location.path("/purchases")},
            function(err){console.error('The item could not be deleted:', err.status, err.statusText)},
          )
        };

        //Dialogs_____________________________________________________________________
        this.showConfirm = function(ev) {
          var confirm = $mdDialog.confirm()
                .title('Would you like to delete the purchase?')
                .textContent('This action cannot be undone.')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
      
          $mdDialog.show(confirm).then(function() {
            vm.removeItem(vm.purchase)
          }, function() {
            console.log('Delete purchase cancelled');
          });
        };

        this.showInvoiceInput = function(ev) {
          $mdDialog.show({
            controller: DialogController,
            templateUrl: 'app/purchase-form/invoiceDialog.template.html',
            targetEvent: ev,
            parent: angular.element(document.body),
            clickOutsideToClose:true
          })
        };
        function DialogController($scope, $mdDialog, Purchase) {
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.uploadFile = function() {
            var f = document.getElementById('file').files[0],
            r = new FileReader();
  
            r.onloadend = function(e) {
              var data = e.target.result;
              var blob = new Blob([data], {type: "application/pdf",});
              return Purchase.invoice.upload({id: vm.purchase.id}, blob);
              
            }
        
            r.readAsArrayBuffer(f);
            $mdDialog.hide();
          };
        };

        //Related to the autocomplete forms___________________________________________
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


      }
    ]
  });
