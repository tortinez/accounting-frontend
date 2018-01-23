'use strict';

// Register the 'projectType' page along with its controller an template
angular.
module('projectTypeTable').
component('projectTypeTable', {
  templateUrl: 'app/project-type-table/project-type-table.template.html',
  controller: ['$mdDialog', 'ProjectType',
    function ProjectTableController($mdDialog, ProjectType) {
      var vm = this;
      //get the items of the table
      vm.projectTypes = ProjectType.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (projectType) {
        ProjectType.cacheProjectType = projectType;
        vm.showEdit();
      }

      this.addItem = function () {
        ProjectType.cacheProjectType = {};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/project-type-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, ProjectType, Auth) {
        //get the data from the service
        $scope.projectType = ProjectType.cacheProjectType;

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editProjectType = function () {
          return ProjectType.save($scope.projectType).then(
            function (value) {
              $mdDialog.hide();
              $scope.showToast('Succesfully Saved!')
              console.log('Project type saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The project type cannot be modified", err.status, err.statusText)
            });
        };

        $scope.removeItem = function (projectType) {
          ProjectType.remove(projectType)
            .then(
              function () {
                $scope.showToast('Project Deleted!')
                console.log('Succesfully removed')
              },
              function (err) {
                if(err.status==500) $scope.showToast('The project type could not be deleted since it has associated purchases')
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
            .title('Would you like to delete the project Type?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.projectType).then(

              console.log('Project type Deleted!'))
          }, function () {
            console.log('Delete project type cancelled');
          });
        };
      };
    }
  ]
});