'use strict';

// Register the 'supplier' page along with its controller an template
angular.
module('supplierTable').
component('supplierTable', {
  templateUrl: 'app/supplier-table/supplier-table.template.html',
  controller: ['$mdDialog', 'Supplier',
    function SupplierTableController($mdDialog, Supplier) {
      var vm = this;
      //get the items of the table
      vm.suppliers = Supplier.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (supplier) {
        Supplier.cacheSupplier = supplier;
        vm.showEdit();
      }

      this.addItem = function () {
        Supplier.cacheSupplier = {};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/supplier-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, Supplier, Auth) {
        //get the data from the service
        $scope.supplier = Supplier.cacheSupplier;

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editSupplier = function () {
          return Supplier.save($scope.supplier).then(
            function (value) {
              $mdDialog.hide();
              $scope.showToast('Succesfully Saved!')
              console.log('Supplier saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The supplier cannot be modified", err.status, err.statusText)
            });
        };

        $scope.removeItem = function (supplier) {
          Supplier.remove(supplier)
            .then(
              function () {
                $scope.showToast('Supplier Deleted!')
                console.log('Succesfully removed')
              },
              function (err) {
                if (err.status == 500) $scope.showToast('The supplier could not be deleted since it has associated purchases')
                console.error('The item could not be deleted:', err.status, err.statusText)
              }
            )
          $mdDialog.hide();
        };

        //create a dialog and a toast to perform some actions
        $scope.showToast = function (msg) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(msg)
            .position('top right')
            .hideDelay(5000)
          );
        };

        $scope.showConfirm = function (ev) {
          var confirm = $mdDialog.confirm()
            .title('Would you like to delete the supplier?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.supplier).then(

              console.log('Supplier Deleted!'))
          }, function () {
            console.log('Delete supplier cancelled');
          });
        };
      };
    }
  ]
});