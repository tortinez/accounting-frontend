'use strict';

// Register the 'project' page along with its controller an template
angular.
module('projectTable').
component('projectTable', {
  templateUrl: 'app/project-table/project-table.template.html',
  controller: ['$mdDialog', 'Project',
    function ProjectTableController($mdDialog, Project) {
      var vm = this;
      //get the items of the table
      vm.projects = Project.api.query();

      ///////////////////////////////////////////////////////////////////////
      //functions_____________________________________________________________
      this.editItem = function (project) {
        Project.cacheProject = project;
        vm.showEdit();
      }

      this.addItem = function () {
        Project.cacheProject = {description: ''};
        vm.showEdit();
      }

      //Dialogs_____________________________________________________________________
      this.showEdit = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/project-table/editDialog.template.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose: false
        })
      };

      function DialogController($scope, $mdDialog, $mdToast, Project, Auth, Client, Employee, ProjectType) {
        //get the data from the service
        $scope.project = Project.cacheProject;
        $scope.clientList = Client.api.query();
        $scope.employeeList = Employee.api.query();
        $scope.typeList = ProjectType.api.query();

        //get the USER information (role)
        $scope.user = Auth.user;

        //actual functions of the form
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.editProject = function () {
          return Project.save($scope.project).then(
            function (value) {
              $mdDialog.hide();
              $scope.showToast('Succesfully Saved!')
              console.log('Project saved: ID=', value.id);
            },
            function (err) {
              $mdDialog.hide();
              console.error("The project cannot be modified", err.status, err.statusText)
            });
        };

        $scope.removeItem = function (project) {
          Project.remove(project)
            .then(
              function () {
                $scope.showToast('Project Deleted!')
                console.log('Succesfully removed')
              },
              function (err) {
                if(err.status==500) $scope.showToast('The project could not be deleted since it has associated purchases')
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
            .title('Would you like to delete the project?')
            .textContent('This action cannot be undone.')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');

          $mdDialog.show(confirm).then(function () {
            $scope.removeItem($scope.project).then(

              console.log('Project Deleted!'))
          }, function () {
            console.log('Delete project cancelled');
          });
        };

        //Related to the autocomplete form inputs___________________________________
        $scope.autocompleteSearch = function (query, items) {
          return !query ? items : items.filter(function (item) {
            var lowerCaseItem = (item.name) ? angular.lowercase(item.name) : angular.lowercase(item.fullname);
            var lowercaseQuery = angular.lowercase(query);
            return lowerCaseItem.indexOf(lowercaseQuery) === 0;
          })
        }
      };
    }
  ]
});