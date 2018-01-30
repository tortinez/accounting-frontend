(function() {
	'use strict';

	// Register the 'supplier' page along with its controller an template
	angular.module('supplierTable').component('supplierTable', {
		templateUrl: 'app/supplier-table/supplier-table.template.html',
		controller: SupplierTableController,
		controllerAs: 'vm'
	});

	SupplierTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function SupplierTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.suppliers = OtherResource.api('supplier').query();
		vm.user = Auth.user;
		//variables
		vm.supplier = {};
		vm.title = '';
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(supplier) {
			vm.supplier = supplier;
			vm.title = 'Edit Supplier';
			vm.showEdit();
		}

		function addItem() {
			vm.supplier = { description: '' };
			vm.title = 'Add Supplier';
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/supplier-table/editDialog.template.html',
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
			$scope.editSupplier = editSupplier;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			$scope.supplier = vm.supplier;

			$scope.title = vm.title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editSupplier() {
				return OtherResource.save('supplier', $scope.supplier).then(
					function(value) {
						OtherResource.api('supplier')
							.query()
							.$promise.then(function(res) {
								vm.suppliers = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('Supplier saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
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
						OtherResource.api('supplier')
							.query()
							.$promise.then(function(res) {
								vm.suppliers = res;
							});
						showToast('Supplier Deleted!');
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
						.hideDelay(5000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the supplier?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.supplier).then(console.log('Supplier Deleted!'));
					},
					function() {
						console.log('Delete supplier cancelled');
					}
				);
			}

			function showError(ev) {
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
})();
