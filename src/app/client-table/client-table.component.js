'use strict';

// Register the 'client' page along with its controller an template
angular.
module('clientTable').
component('clientTable', {
  templateUrl: 'app/client-table/client-table.template.html',
  controller: ['$mdDialog', 'Client',
    function ClientTableController($mdDialog, Client) {
      var vm = this;
      //get the items of the table
      vm.clients = Client.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (client) {
        Client.cacheClient = client;
        vm.showEdit();
      }

      this.addItem = function () {
        Client.cacheClient = {};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/client-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, Client, ClientType, Auth) {
        //get the data from the service
        $scope.client = Client.cacheClient;
        $scope.clientTypeList = ClientType.api.query();

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editClient = function () {
          return Client.save($scope.client).then(
            function (value) {
              $mdDialog.hide();
              $scope.showToast('Succesfully Saved!')
              console.log('Client saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The client cannot be modified", err.status, err.statusText)
            });
        };

        $scope.removeItem = function (client) {
          Client.remove(client)
            .then(
              function () {
                $scope.showToast('Client Deleted!')
                console.log('Succesfully removed')
              },
              function (err) {
                if(err.status==500) $scope.showToast('The client could not be deleted since it has associated purchases')
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
            .title('Would you like to delete the client?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.client).then(

              console.log('Client Deleted!'))
          }, function () {
            console.log('Delete client cancelled');
          });
        };

        //Related to the autocomplete form inputs___________________________________
        $scope.autocompleteSearch = function (query, items) {
          return !query ? items : items.filter(function (item) {
            var lowerCaseItem = angular.lowercase(item.name);
            var lowercaseQuery = angular.lowercase(query);
            return lowerCaseItem.indexOf(lowercaseQuery) === 0;
          })
        }
      };
    }
  ]
});