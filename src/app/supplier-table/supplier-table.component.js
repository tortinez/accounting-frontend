SupplierTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

function SupplierTableController($mdDialog, Auth, OtherResource) {
	var vm = this;
	//get the items of the table
	vm.suppliers = OtherResource.query('supplier');
	vm.user = Auth.user;
	//variables
	vm.supplier = {};
	vm.title = '';
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(supplier) {
		vm.supplier = supplier;
		vm.title = 'Edit Supplier';
		showFormDialog();
	}

	function addItem() {
		vm.supplier = { description: '' };
		vm.title = 'Add Supplier';
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
			locals: { title: vm.title, itemId: vm.supplier.id }
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
		vm2.editSupplier = editSupplier;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.get('supplier', itemId).$promise.then(function(res) {
					vm2.supplier = res;
				})
			: (vm2.supplier = {});

		vm2.title = title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editSupplier() {
			return OtherResource.save('supplier', vm2.supplier).then(
				function(value) {
					OtherResource.query('supplier').$promise.then(function(res) {
						vm.suppliers = res;
						$mdDialog.hide();
					});
					showToast('Succesfully Saved!');
					console.log('Supplier saved: ID=', value.id);
				},
				function(err) {
					$mdDialog.hide();
					showToast('An error occured');
					console.error(
						'The supplier cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(supplier) {
			OtherResource.remove('supplier', supplier).then(
				function() {
					OtherResource.query('supplier').$promise.then(function(res) {
						vm.suppliers = res;
					});
					showToast('Supplier Deleted!');
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
				.title('Would you like to delete the supplier?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(
				function() {
					removeItem(vm2.supplier).then(console.log('Supplier Deleted!'));
				},
				function() {
					console.log('Delete supplier cancelled');
				}
			);
		}

		function showErrorDialog(ev) {
			$mdDialog.show(
				$mdDialog
					.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Error deleting the supplier')
					.textContent(
						'The supplier you are trying to delete has associated purchases. Please delete these purchases first'
					)
					.ariaLabel('Error Deleting Item')
					.ok('Ok')
					.targetEvent(ev)
			);
		}
	}
}

export default SupplierTableController;
