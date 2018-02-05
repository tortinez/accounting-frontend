(function() {
	'use strict';

	// Register the 'purchaseStatus' page along with its controller an template
	angular.module('purchaseStatusTable').component('purchaseStatusTable', {
		templateUrl:
			'app/purchase-status-table/purchase-status-table.template.html',
		controller: PurchaseStatusTableController,
		controllerAs: 'vm'
	});

	PurchaseStatusTableController.$inject = [
		'$mdDialog',
		'Auth',
		'OtherResource'
	];

	function PurchaseStatusTableController($mdDialog, Auth, OtherResource) {
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
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(purchaseStatus) {
			vm.purchaseStatus = purchaseStatus;
			vm.title = 'Edit Purchase Status';
			vm.showEdit();
		}

		function addItem() {
			vm.purchaseStatus = {};
			vm.title = 'Add Purchase Status';
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/purchase-status-table/editDialog.template.html',
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
			$scope.editPurchaseStatus = editPurchaseStatus;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			vm.purchaseStatus.id
				? OtherResource.api('purchase-state')
						.get({ id: vm.purchaseStatus.id })
						.$promise.then(function(res) {
							$scope.purchaseStatus = res;
						})
				: ($scope.purchaseStatus = {});

			$scope.title = vm.title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editPurchaseStatus() {
				return OtherResource.save('purchase-state', $scope.purchaseStatus).then(
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
						.hideDelay(3000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the purchase status?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.purchaseStatus).then(
							console.log('Purchase Status Deleted!')
						);
					},
					function() {
						console.log('Delete purchase status cancelled');
					}
				);
			}

			function showError(ev) {
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
})();
