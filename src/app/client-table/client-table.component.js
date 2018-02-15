'use strict';

ClientTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

function ClientTableController($mdDialog, Auth, OtherResource) {
	var vm = this;
	//get the items of the table
	vm.clients = OtherResource.query('client');
	vm.user = Auth.user;
	//variables
	vm.client = {};
	vm.title = '';
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(client) {
		vm.client = client;
		vm.title = 'Edit Client';
		showFormDialog();
	}

	function addItem() {
		vm.client = {};
		vm.title = 'Add client';
		showFormDialog();
	}

	//Dialogs________________________________________________________________
	function showFormDialog(ev) {
		console.log('opening a dialog');
		$mdDialog.show({
			controller: FormDialogController,
			controllerAs: 'vm',
			template: require('./form-dialog.template.html'),
			targetEvent: ev,
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: { title: vm.title, itemId: vm.client.id }
		});
	}
	function FormDialogController(
		$mdDialog,
		$mdToast,
		AutocompleteFields,
		OtherResource,
		title,
		itemId
	) {
		var vm2 = this;
		//functions callable from the html
		vm2.cancel = cancel;
		vm2.editClient = editClient;
		vm2.autocompleteSearch = autocompleteSearch;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.get('client', itemId).$promise.then(function(res) {
					vm2.client = res;
				})
			: (vm2.client = {});
		vm2.typeList = OtherResource.query('client-type');

		vm2.title = vm.title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editClient() {
			return OtherResource.save('client', vm2.client).then(
				function(value) {
					OtherResource.query('client').$promise.then(function(res) {
						vm.clients = res;
						$mdDialog.hide();
					});
					showToast('Succesfully Saved!');
					console.log('Client saved: ID=', value.id);
				},
				function(err) {
					$mdDialog.hide();
					showToast('An error occured');
					console.error(
						'The client cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(client) {
			OtherResource.remove('client', client).then(
				function() {
					OtherResource.query('client').$promise.then(function(res) {
						vm.clients = res;
					});
					showToast('Client Deleted!');
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

		//Related to the autocomplete form inputs
		function autocompleteSearch(query, items) {
			return AutocompleteFields.search(query, items);
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
				.title('Would you like to delete the client?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(
				function() {
					removeItem(vm2.client).then(console.log('Client Deleted!'));
				},
				function() {
					console.log('Delete client cancelled');
				}
			);
		}

		function showErrorDialog(ev) {
			$mdDialog.show(
				$mdDialog
					.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Error deleting the client')
					.textContent(
						'The client you are trying to delete has associated purchases. Please delete these purchases first'
					)
					.ariaLabel('Error Deleting Item')
					.ok('Ok')
					.targetEvent(ev)
			);
		}
	}
}

export default ClientTableController;
