'use strict';

// Register the 'purchaseType' page along with its controller an template
angular.
module('purchaseTypeTable').
component('purchaseTypeTable', {
  templateUrl: 'app/purchase-type-table/purchase-type-table.template.html',
  controller: ['$mdDialog', 'PurchaseType',
    function PurchaseTableController($mdDialog, PurchaseType) {
      var vm = this;
      //get the items of the table
      vm.purchaseTypes = PurchaseType.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (purchaseType) {
        PurchaseType.cachePurchaseType = purchaseType;
        vm.showEdit();
      }

      this.addItem = function () {
        PurchaseType.cachePurchaseType = {};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/purchase-type-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, PurchaseType, Auth) {
        //get the data from the service
        $scope.purchaseType = PurchaseType.cachePurchaseType;

        //get the USER information (role)
        $scope.user = Auth.user;

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
            .title('Would you like to delete the purchase Type?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');
  
          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.purchaseType).then(
  
              console.log('Purchase Type Deleted!'))
          }, function () {
            console.log('Delete purchase type cancelled');
          });
        };

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editPurchaseType = function () {
          return PurchaseType.save($scope.purchaseType).then(
              function (value) {
                $mdDialog.hide();
                $scope.showToast('Succesfully Saved!')
                console.log('Purchase type saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The purchase type cannot be modified", err.status, err.statusText)
            });
      };

      $scope.removeItem = function (purchaseType) {
        PurchaseType.remove(purchaseType)
          .then(
            function () {
              $scope.showToast('Purchase type Deleted!')
              console.log('Succesfully removed')
            },
            function (err) {
              $scope.showToast('The purchase type could not be deleted since it has associated purchases')
              console.error('The item could not be deleted:', err.status, err.statusText)
            }
          )
        $mdDialog.hide();
      };
    };
  }
]
});