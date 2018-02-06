(function() {
	'use strict';

	// Register the 'employee' page along with its controller an template
	angular.module('employeeTable').component('employeeTable', {
		templateUrl: 'app/employee-table/employee-table.template.html',
		controller: EmployeeTableController,
		controllerAs: 'vm'
	});

	EmployeeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function EmployeeTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.employees = OtherResource.api('employee').query();
		vm.user = Auth.user;
		//variables
		vm.title = '';
		vm.employee = {};
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(employee) {
			vm.employee = employee;
			vm.title = 'Edit Person';
			vm.showEdit();
		}

		function addItem() {
			vm.employee = { comments: '' };
			vm.title = 'Add Person';
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/employee-table/editDialog.template.html',
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
			OtherResource
		) {
			//functions callable from the html
			$scope.cancel = cancel;
			$scope.editEmployee = editEmployee;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			vm.employee.id
				? OtherResource.api('employee')
						.get({ id: vm.employee.id })
						.$promise.then(function(res) {
							$scope.employee = res;
						})
				: ($scope.employee = {});

			$scope.title = vm.title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editEmployee() {
				return OtherResource.save('employee', $scope.employee).then(
					function(value) {
						OtherResource.api('employee')
							.query()
							.$promise.then(function(res) {
								vm.employees = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('Employee saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
						showToast('An error occured');
						console.error(
							'The employee cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function removeItem(employee) {
				OtherResource.remove('employee', employee).then(
					function() {
						OtherResource.api('employee')
							.query()
							.$promise.then(function(res) {
								vm.employees = res;
							});
						showToast('Person Deleted!');
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
					.title('Would you like to delete the person?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.employee).then(console.log('Employee Deleted!'));
					},
					function() {
						console.log('Delete employee cancelled');
					}
				);
			}

			function showError(ev) {
				$mdDialog.show(
					$mdDialog
						.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Error deleting the employee')
						.textContent(
							'The perosn you are trying to delete has associated purchases. Please delete these purchases first'
						)
						.ariaLabel('Error Deleting Item')
						.ok('Ok')
						.targetEvent(ev)
				);
			}
		}
	}
})();
