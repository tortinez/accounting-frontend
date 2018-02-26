EmployeeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

function EmployeeTableController($mdDialog, Auth, OtherResource) {
	var vm = this;
	//get the items of the table
	vm.employees = OtherResource.query('employee');
	vm.user = Auth.user;
	//variables
	vm.title = '';
	vm.employee = {};
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(employee) {
		vm.employee = employee;
		vm.title = 'Edit Person';
		showFormDialog();
	}

	function addItem() {
		vm.employee = {};
		vm.title = 'Add Person';
		showFormDialog();
	}

	//Dialogs________________________________________________________________
	function showFormDialog(ev) {
		$mdDialog.show({
			controller: FormDialogController,
			controllerAs: 'vm',
			template: require('./form-dialog.template.html'),
			targetEvent: ev,
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: { title: vm.title, itemId: vm.employee.id }
		});
	}
	FormDialogController.$inject = ['$mdDialog', '$mdToast', 'OtherResource', 'title', 'itemId'];
	function FormDialogController(
		$mdDialog,
		$mdToast,
		OtherResource,
		title,
		itemId
	) {
		var vm2 = this;
		//functions callable from the html
		vm2.cancel = cancel;
		vm2.editEmployee = editEmployee;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.get('employee', itemId).$promise.then(
					res => (vm2.employee = res)
				)
			: (vm2.employee = { comments: '' });

		vm2.title = title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editEmployee() {
			return OtherResource.save('employee', vm2.employee).then(
				() => {
					OtherResource.query('employee').$promise.then(res => {
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
				() => {
					OtherResource.query('employee').$promise.then(
						res => (vm.employees = res)
					);
					showToast('Person Deleted!');
					console.log('Succesfully removed');
				},
				err => {
					if (err.status == 409) showErrorDialog();
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

		function showConfirmDialog(ev) {
			var confirm = $mdDialog
				.confirm()
				.title('Would you like to delete the person?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog
				.show(confirm)
				.then(
					() => removeItem(vm2.employee).then(console.log('Employee Deleted!')),
					() => console.log('Delete employee cancelled')
				);
		}

		function showErrorDialog(ev) {
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

export default EmployeeTableController;
