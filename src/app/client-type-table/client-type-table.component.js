'use strict';

// Register the 'clientType' page along with its controller an template
angular.
module('clientTypeTable').
component('clientTypeTable', {
  templateUrl: 'app/client-type-table/client-type-table.template.html',
  controller: ['$mdDialog', 'ClientType',
    function ClientTableController($mdDialog, ClientType) {
      var vm = this;
      //get the items of the table
      vm.clientTypes = ClientType.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (clientType) {
        ClientType.cacheClientType = clientType;
        vm.showEdit();
      }

      this.addItem = function () {
        ClientType.cacheClientType = {};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/client-type-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, ClientType, Auth) {
        //get the data from the service
        $scope.clientType = ClientType.cacheClientType;

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editClientType = function () {
          return ClientType.save($scope.clientType).then(
            function (value) {
              $mdDialog.hide();
              $scope.showToast('Succesfully Saved!')
              console.log('Client Type saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The client type cannot be modified", err.status, err.statusText)
            });
        };

        $scope.removeItem = function (clientType) {
          ClientType.remove(clientType)
            .then(
              function () {
                $scope.showToast('Client Type Deleted!')
                console.log('Succesfully removed')
              },
              function (err) {
                if(err.status==500) $scope.showToast('The client type could not be deleted since it has associated purchases')
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
            .title('Would you like to delete the client Type?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.clientType).then(

              console.log('Client Type Deleted!'))
          }, function () {
            console.log('Delete client type cancelled');
          });
        };
      };
    }
  ]
});