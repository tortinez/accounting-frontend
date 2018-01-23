'use strict';

// Register the 'purchaseStatus' page along with its controller an template
angular.
module('purchaseStatusTable').
component('purchaseStatusTable', {
  templateUrl: 'app/purchase-status-table/purchase-status-table.template.html',
  controller: ['$mdDialog', 'PurchaseStatus',
    function PurchaseTableController($mdDialog, PurchaseStatus) {
      var vm = this;
      //get the items of the table
      vm.purchaseStatuss = PurchaseStatus.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (purchaseStatus) {
        PurchaseStatus.cachePurchaseStatus = purchaseStatus;
        vm.showEdit();
      }

      this.addItem = function () {
        PurchaseStatus.cachePurchaseStatus = {};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/purchase-status-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, PurchaseStatus, Auth) {
        //get the data from the service
        $scope.purchaseStatus = PurchaseStatus.cachePurchaseStatus;

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editPurchaseStatus = function () {
          return PurchaseStatus.save($scope.purchaseStatus).then(
              function (value) {
                $mdDialog.hide();
                $scope.showToast('Succesfully Saved!')
                console.log('Purchase status saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The purchase status cannot be modified", err.status, err.statusText)
            });
      };

      $scope.removeItem = function (purchaseStatus) {
        PurchaseStatus.remove(purchaseStatus)
          .then(
            function () {
              $scope.showToast('Purchase status Deleted!')
              console.log('Succesfully removed')
            },
            function (err) {
              if(err.status==500) $scope.showToast('The purchase status could not be deleted since it has associated purchases')
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
            .title('Would you like to delete the purchase Status?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');
  
          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.purchaseStatus).then(
  
              console.log('Purchase Status Deleted!'))
          }, function () {
            console.log('Delete purchase status cancelled');
          });
        };
    };
  }
]
});