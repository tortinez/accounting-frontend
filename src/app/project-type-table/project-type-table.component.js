(function() {
	'use strict';

	// Register the 'projectType' page along with its controller an template
	angular.module('projectTypeTable').component('projectTypeTable', {
		templateUrl: 'app/project-type-table/project-type-table.template.html',
		controller: ProjectTypeTableController,
		controllerAs: 'vm'
	});

	ProjectTypeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function ProjectTypeTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.projectTypes = OtherResource.api('project-type').query();
		vm.user = Auth.user;
		//variables
		vm.projectType = {};
		vm.title = '';
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(projectType) {
			vm.projectType = projectType;
			vm.title = 'Edit Project Type';
			vm.showEdit();
		}

		function addItem() {
			vm.projectType = {};
			vm.title = 'Add Project Type';
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/project-type-table/editDialog.template.html',
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
			$scope.editProjectType = editProjectType;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			$scope.projectType = vm.projectType;

			$scope.title = vm.title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editProjectType() {
				return OtherResource.save('project-type', $scope.projectType).then(
					function(value) {
						OtherResource.api('project-type')
							.query()
							.$promise.then(function(res) {
								vm.projectTypes = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('ProjectType saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
						console.error(
							'The Project Type cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function removeItem(projectType) {
				OtherResource.remove('project-type', projectType).then(
					function() {
						OtherResource.api('project-type')
							.query()
							.$promise.then(function(res) {
								vm.projectTypes = res;
							});
						showToast('Project Type Deleted!');
						console.log('Succesfully removed');
					},
					function(err) {
						if (err.status == 409 || err.statusText == 'Conflict') showError();
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
						.hideDelay(3000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the project type?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.projectType).then(
							console.log('Project Type Deleted!')
						);
					},
					function() {
						console.log('Delete project type cancelled');
					}
				);
			}

			function showError(ev) {
				$mdDialog.show(
					$mdDialog
						.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Error deleting the project type')
						.textContent(
							'The project type you are trying to delete has associated purchases. Please delete these purchases first'
						)
						.ariaLabel('Error Deleting Item')
						.ok('Ok')
						.targetEvent(ev)
				);
			}
		}
	}
})();
