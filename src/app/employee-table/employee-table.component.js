'use strict';

// Register the 'employee' page along with its controller an template
angular.
module('employeeTable').
component('employeeTable', {
  templateUrl: 'app/employee-table/employee-table.template.html',
  controller: ['$mdDialog', 'Employee',
    function EmployeeTableController($mdDialog, Employee) {
      var vm = this;
      //get the items of the table
      vm.employees = Employee.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (employee) {
        Employee.cacheEmployee = employee;
        vm.showEdit();
      }

      this.addItem = function () {
        Employee.cacheEmployee = {comments: ''};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/employee-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, Employee, Auth) {
        //get the data from the service
        $scope.employee = Employee.cacheEmployee;

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editEmployee = function () {
          return Employee.save($scope.employee).then(
            function (value) {
              $mdDialog.hide();
              $scope.showToast('Succesfully Saved!')
              console.log('Employee saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The employee cannot be modified", err.status, err.statusText)
            });
        };

        $scope.removeItem = function (employee) {
          Employee.remove(employee)
            .then(
              function () {
                $scope.showToast('Employee Deleted!')
                console.log('Succesfully removed')
              },
              function (err) {
                if(err.status==500) $scope.showToast('The employee could not be deleted since it has associated purchases')
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
            .title('Would you like to delete the employee?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.employee).then(

              console.log('Employee Deleted!'))
          }, function () {
            console.log('Delete employee cancelled');
          });
        };
      };
    }
  ]
});