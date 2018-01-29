(function() {
	'use strict';

	// Register the 'project' page along with its controller an template
	angular.module('projectTable').component('projectTable', {
		templateUrl: 'app/project-table/project-table.template.html',
		controller: ProjectTableController,
		controllerAs: 'vm'
	});

	ProjectTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function ProjectTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.projects = OtherResource.api('project').query();
		vm.project = [];
		vm.user = Auth.user;
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(project) {
			vm.project = project;
			vm.showEdit();
		}

		function addItem() {
			vm.project = { description: '' };
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/project-table/editDialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: false
			});
		}
		function DialogController(
			$scope,
			$routeParams,
			$mdDialog,
			$mdToast,
			AutocompleteFields,
			OtherResource
		) {
			//functions callable from the html
			$scope.cancel = cancel;
			$scope.editProject = editProject;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			$scope.project = vm.project;
			$scope.clientList = OtherResource.api('client').query();
			$scope.employeeList = OtherResource.api('employee').query();
			$scope.typeList = OtherResource.api('project-type').query();

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editProject() {
				return OtherResource.save('project', $scope.project).then(
					function(value) {
						$mdDialog.hide();
						showToast('Succesfully Saved!');
						console.log('Project saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
						console.error(
							'The project cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function removeItem(project) {
				OtherResource.remove('project', project).then(
					function() {
						$scope.showToast('Project Deleted!');
						console.log('Succesfully removed');
					},
					function(err) {
						if (err.status == 409)
							showToast(
								'The project could not be deleted since it has associated purchases'
							);
						console.error(
							'The item could not be deleted:',
							err.status,
							err.statusText
						);
					}
				);
				$mdDialog.hide();
			}

			//Related to the autocomplete form inputs
			$scope.autocompleteSearch = function(query, items) {
				return AutocompleteFields.search(query, items);
			};

			//create a dialog and a toast to perform some actions________________________
			function showToast(msg) {
				$mdToast.show(
					$mdToast
						.simple()
						.textContent(msg)
						.position('top right')
						.hideDelay(5000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the project?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.project).then(console.log('Project Deleted!'));
					},
					function() {
						console.log('Delete project cancelled');
					}
				);
			}
		}
	}
})();
