(function() {
	'use strict';

	// Register the 'purchaseForm' page along with its controller an template
	angular.module('purchaseForm').component('purchaseForm', {
		templateUrl: 'app/purchase-form/purchase-form.template.html',
		controller: PurchaseFormController,
		controllerAs: 'vm'
	});

	PurchaseFormController.$inject = [
		'$routeParams',
		'$location',
		'$mdDialog',
		'Purchase',
		'OtherResource',
		'Auth',
		'AutocompleteFields'
	];
	function PurchaseFormController(
		$routeParams,
		$location,
		$mdDialog,
		Purchase,
		OtherResource,
		Auth,
		AutocompleteFields
	) {
		var vm = this;
		vm.purchase = [];
		//get the USER information (role)
		vm.user = Auth.user;
		//retrieve the list of projects, status, type and supplier
		vm.projList = OtherResource.api('project').query();
		vm.supplierList = OtherResource.api('supplier').query();
		vm.employeeList = OtherResource.api('employee').query();
		vm.statusList = OtherResource.api('purchase-state').query();
		vm.typeList = OtherResource.api('purchase-type').query();
		//functions
		vm.editPurchase = editPurchase;
		vm.removeItem = removeItem;
		vm.autocompleteSearch = autocompleteSearch;
		//dialogs
		vm.showConfirm = showConfirm;
		vm.showInvoiceInput = showInvoiceInput;

		////////////////////////////////////////////////////////////////////////
		//variables_____________________________________________________________
		//get data if exist; if not assign an empty object
		$routeParams.id
			? Purchase.api()
					.get({ id: $routeParams.id })
					.$promise.then(function(res) {
						res.date = new Date(res.requestDate);
						vm.purchase = res;
					})
			: (vm.purchase = { comments: '', date: new Date() });

		//functions_____________________________________________________________
		function editPurchase() {
			return Purchase.save(vm.purchase).then(
				function(value) {
					console.log('Purchase saved: ID=', value.id);
					$location.path('/purchases');
				},
				function(err) {
					console.error(
						'The purchase cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(purchase) {
			Purchase.remove(purchase).then(
				function() {
					console.log('Succesfully removed');
					$location.path('/purchases');
				},
				function(err) {
					console.error(
						'The item could not be deleted:',
						err.status,
						err.statusText
					);
				}
			);
		}

		//Related to the autocomplete forms
		function autocompleteSearch(query, items) {
			return AutocompleteFields.search(query, items);
		}

		//Dialogs_____________________________________________________________________
		function showConfirm(ev) {
			var confirm = $mdDialog
				.confirm()
				.title('Would you like to delete the purchase?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(
				function() {
					vm.removeItem(vm.purchase);
				},
				function() {
					console.log('Delete purchase cancelled');
				}
			);
		}

		function showInvoiceInput(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/purchase-form/invoiceDialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
		function DialogController($scope, $mdDialog, Purchase) {
			$scope.cancel = cancel;
			$scope.uploadFile = uploadFile;

			//////////////////////////////////////////////
			function cancel() {
				$mdDialog.cancel();
			}

			function uploadFile() {
				var f = document.getElementById('file').files[0];
				if (f.name.substring(f.name.length - 3) == 'pdf') {
					var r = new FileReader();

					r.onloadend = function(e) {
						var data = e.target.result;
						var blob = new Blob([data], { type: 'application/pdf' });
						return Purchase.invoice()
							.upload({ id: vm.purchase.id }, blob)
							.$promise.then(
								function(res) {
									console.log('File uploaded succesfully');
									$mdDialog.hide();
								},
								function(err) {
									console.error(
										'An error ocurred while uploading: ' + err.status
									);
								}
							);
					};

					r.readAsArrayBuffer(f);
				}
			}
		}
	}
})();
