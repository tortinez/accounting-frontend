'use strict';

ClientTypeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

function ClientTypeTableController($mdDialog, Auth, OtherResource) {
	var vm = this;
	//get the items of the table
	vm.clientTypes = OtherResource.query('client-type');
	vm.user = Auth.user;
	//variables
	vm.clientType = {};
	vm.title = '';
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(clientType) {
		vm.clientType = clientType;
		vm.title = 'Edit Client Type';
		showFormDialog();
	}

	function addItem() {
		vm.clientType = {};
		vm.title = 'Add Client Type';
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
			locals: { title: vm.title, itemId: vm.clientType.id }
		});
	}
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
		vm2.editClientType = editClientType;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.get('client-type', itemId).$promise.then(
					res => (vm2.clientType = res)
				)
			: (vm2.clientType = {});

		vm2.title = title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editClientType() {
			return OtherResource.save('client-type', vm2.clientType).then(
				function(value) {
					OtherResource.query('client-type').$promise.then(function(res) {
						vm.clientTypes = res;
						$mdDialog.hide();
					});
					showToast('Succesfully Saved!');
					console.log('ClientType saved: ID=', value.id);
				},
				function(err) {
					$mdDialog.hide();
					showToast('An error occured');
					console.error(
						'The Client Type cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(clientType) {
			OtherResource.remove('client-type', clientType).then(
				function() {
					OtherResource.query('client-type').$promise.then(function(res) {
						vm.clientTypes = res;
					});
					showToast('Client Type Deleted!');
					console.log('Succesfully removed');
				},
				function(err) {
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
					.hideDelay(2500)
			);
		}

		function showConfirmDialog(ev) {
			var confirm = $mdDialog
				.confirm()
				.title('Would you like to delete the client type?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(
				function() {
					removeItem(vm2.clientType).then(console.log('Client Type Deleted!'));
				},
				function() {
					console.log('Delete client type cancelled');
				}
			);
		}

		function showErrorDialog(ev) {
			$mdDialog.show(
				$mdDialog
					.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Error deleting the client type')
					.textContent(
						'The client type you are trying to delete has associated purchases. Please delete these purchases first'
					)
					.ariaLabel('Error Deleting Item')
					.ok('Ok')
					.targetEvent(ev)
			);
		}
	}
}

export default ClientTypeTableController;
