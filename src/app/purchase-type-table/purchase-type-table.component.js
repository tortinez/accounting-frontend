PurchaseTypeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

function PurchaseTypeTableController($mdDialog, Auth, OtherResource) {
	var vm = this;
	//get the items of the table
	vm.purchaseTypes = OtherResource.query('purchase-type');
	vm.user = Auth.user;
	//variables
	vm.purchaseType = {};
	vm.title = '';
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(purchaseType) {
		vm.purchaseType = purchaseType;
		vm.title = 'Edit Purchase Type';
		showFormDialog();
	}

	function addItem() {
		vm.purchaseType = {};
		vm.title = 'Add Purchase Type';
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
			locals: { title: vm.title, itemId: vm.purchaseType.id }
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
		vm2.editPurchaseType = editPurchaseType;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.get('purchase-type', itemId).$promise.then(
					res => (vm2.purchaseType = res)
				)
			: (vm2.purchaseType = {});

		vm2.title = title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editPurchaseType() {
			return OtherResource.save('purchase-type', vm2.purchaseType).then(
				() => {
					OtherResource.query('purchase-type').$promise.then(res => {
						vm.purchaseTypes = res;
						$mdDialog.hide();
					});
					showToast('Succesfully Saved!');
					console.log('PurchaseType saved: ID=', value.id);
				},
				err => {
					$mdDialog.hide();
					showToast('An error occured');
					console.error(
						'The Purchase Type cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(purchaseType) {
			OtherResource.remove('purchase-type', purchaseType).then(
				() => {
					OtherResource.query('purchase-type').$promise.then(
						res => (vm.purchaseTypes = res)
					);
					showToast('Purchase Type Deleted!');
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
					.hideDelay(2500)
			);
		}

		function showConfirmDialog(ev) {
			var confirm = $mdDialog
				.confirm()
				.title('Would you like to delete the purchase type?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog
				.show(confirm)
				.then(
					() =>
						removeItem(vm2.purchaseType).then(
							console.log('Purchase Type Deleted!')
						),
					() => console.log('Delete purchase type cancelled')
				);
		}

		function showErrorDialog(ev) {
			$mdDialog.show(
				$mdDialog
					.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Error deleting the purchase type')
					.textContent(
						'The purchase type you are trying to delete has associated purchases. Please delete these purchases first'
					)
					.ariaLabel('Error Deleting Item')
					.ok('Ok')
					.targetEvent(ev)
			);
		}
	}
}

export default PurchaseTypeTableController;
