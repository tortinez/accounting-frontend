'use strict';

PurchaseStatusTableController.$inject = [
	'$mdDialog',
	'mdPickerColors',
	'Auth',
	'OtherResource'
];

function PurchaseStatusTableController(
	$mdDialog,
	mdPickerColors,
	Auth,
	OtherResource
) {
	var vm = this;
	//get the items of the table
	vm.purchaseStatuss = OtherResource.api('purchase-state').query();
	vm.user = Auth.user;
	//variables
	vm.purchaseStatus = {};
	vm.title = '';
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;
	vm.badgeColor = badgeColor;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(purchaseStatus) {
		vm.purchaseStatus = purchaseStatus;
		vm.title = 'Edit Purchase Status';
		showFormDialog();
	}

	function addItem() {
		vm.purchaseStatus = {};
		vm.title = 'Add Purchase Status';
		showFormDialog();
	}

	function badgeColor(hex) {
		var color = mdPickerColors.getColor(hex);
		return color.name;
	}

	//Dialogs________________________________________________________________
	function showFormDialog(ev) {
		$mdDialog.show({
			controller: FormDialogController,
			template: require('./form-dialog.template.html'),
			controllerAs: 'vm',
			targetEvent: ev,
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: { title: vm.title, itemId: vm.purchaseStatus.id }
		});
	}
	function FormDialogController(
		$mdDialog,
		$mdToast,
		mdPickerColors,
		OtherResource,
		title,
		itemId
	) {
		var vm2 = this;

		vm2.colorArray = [
			//"random" color for new states
			'#c62828',
			'#7b1fa2',
			'#283593',
			'#039be5',
			'#2e7d32',
			'#fdd835',
			'#f57c00',
			'#d84315'
		];

		//functions callable from the html
		vm2.cancel = cancel;
		vm2.editPurchaseStatus = editPurchaseStatus;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.api('purchase-state')
					.get({ id: itemId })
					.$promise.then(function(res) {
						vm2.purchaseStatus = res;
						vm2.color = mdPickerColors.getColor(
							res.color == 'undefined'
								? vm2.colorArray[
										Math.floor(Math.random() * vm2.colorArray.length)
									]
								: res.color
						);
					})
			: (vm2.color = mdPickerColors.getColor(
					vm2.colorArray[Math.floor(Math.random() * vm2.colorArray.length)]
				));

		vm2.title = title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editPurchaseStatus() {
			vm2.purchaseStatus.color = vm2.color.hex;
			return OtherResource.save('purchase-state', vm2.purchaseStatus).then(
				function(value) {
					OtherResource.api('purchase-state')
						.query()
						.$promise.then(function(res) {
							vm.purchaseStatuss = res;
							$mdDialog.hide();
						});
					showToast('Succesfully Saved!');
					console.log('Purchase Status saved: ID=', value.id);
				},
				function(err) {
					$mdDialog.hide();
					showToast('An error occured');
					console.error(
						'The Purchase Status cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(purchaseStatus) {
			OtherResource.remove('purchase-state', purchaseStatus).then(
				function() {
					OtherResource.api('purchase-state')
						.query()
						.$promise.then(function(res) {
							vm.purchaseStatuss = res;
							$mdDialog.hide();
						});
					showToast('Purchase Status Deleted!');
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
				.title('Would you like to delete the purchase status?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(
				function() {
					removeItem(vm2.purchaseStatus).then(
						console.log('Purchase Status Deleted!')
					);
				},
				function() {
					console.log('Delete purchase status cancelled');
				}
			);
		}

		function showErrorDialog(ev) {
			$mdDialog.show(
				$mdDialog
					.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Error deleting the purchase status')
					.textContent(
						'The purchase status you are trying to delete has associated purchases. Please delete these purchases first'
					)
					.ariaLabel('Error Deleting Item')
					.ok('Ok')
					.targetEvent(ev)
			);
		}
	}
}

export default PurchaseStatusTableController;
