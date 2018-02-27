import moment from 'moment';

PurchaseFormController.$inject = [
	'$routeParams',
	'$location',
	'$mdDialog',
	'$mdToast',
	'moment',
	'Purchase',
	'OtherResource',
	'Auth',
	'AutocompleteFields'
];
function PurchaseFormController(
	$routeParams,
	$location,
	$mdDialog,
	$mdToast,
	moment,
	Purchase,
	OtherResource,
	Auth,
	AutocompleteFields
) {
	var vm = this;
	vm.purchase = [];
	vm.hasInvoice = false;
	//get the USER information (role)
	vm.user = Auth.user;
	//retrieve the list of projects, status, type and supplier
	vm.projList = OtherResource.query('project');
	vm.supplierList = OtherResource.query('supplier');
	vm.employeeList = OtherResource.query('employee');
	vm.statusList = OtherResource.query('purchase-state');
	vm.typeList = OtherResource.query('purchase-type');
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
	var d = null;
	$routeParams.id
		? Purchase.get($routeParams.id).then(res => {
				vm.purchase = res;
				vm.hasInvoice = vm.purchase.invoicePath ? true : false;
			})
		: (vm.purchase = {
				comments: '',
				date: new Date(),
				code: 'MCIA-' + moment(new Date()).format('YYYYMMDD')
			});

	//functions_____________________________________________________________
	function editPurchase() {
		return Purchase.save(vm.purchase).then(
			value => {
				showToast('Purchase succesfully saved!');
				console.log('Purchase saved: ID=', value.id);
				$location.path('/purchases');
			},
			err => {
				showToast('An error occured');
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
			() => {
				showToast('Purchase succesfully removed!');
				console.log('Succesfully removed');
				$location.path('/purchases');
			},
			err => {
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

		$mdDialog
			.show(confirm)
			.then(
				() => vm.removeItem(vm.purchase),
				() => console.log('Delete purchase cancelled')
			);
	}

	function showInvoiceInput(ev) {
		$mdDialog.show({
			controller: DialogController,
			template: require('./invoiceDialog.template.html'),
			targetEvent: ev,
			parent: angular.element(document.body),
			clickOutsideToClose: true,
			locals: { hasInvoice: vm.hasInvoice }
		});
	}
	DialogController.$inject = ['$scope', '$mdDialog', 'Purchase', 'hasInvoice'];
	function DialogController($scope, $mdDialog, Purchase, hasInvoice) {
		$scope.cancel = cancel;
		$scope.uploadFile = uploadFile;
		$scope.deleteFile = deleteFile;
		$scope.hasInvoice = hasInvoice;

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
					return Purchase.uploadInvoice(vm.purchase.id, blob).then(
						res => {
							showToast('File uploaded succesfully');
							console.log('File uploaded succesfully');
							vm.hasInvoice = true;
							console.log(vm.hasInvoice);
							$mdDialog.hide();
						},
						err =>
							console.error('An error ocurred while uploading: ' + err.status)
					);
				};

				r.readAsArrayBuffer(f);
			}
		}

		function deleteFile() {
			return Purchase.deleteInvoice(vm.purchase.id).then(
				() => {
					showToast('Invoice removed');
					console.log('Invoice removed');
					$mdDialog.hide();
				},
				err => console.error('An error ocurred while uploading: ' + err.status)
			);
		}
	}

	//create a toast to perform some actions________________________
	function showToast(msg) {
		$mdToast.show(
			$mdToast
				.simple()
				.textContent(msg)
				.position('top right')
				.hideDelay(2500)
		);
	}
}

export default PurchaseFormController;
