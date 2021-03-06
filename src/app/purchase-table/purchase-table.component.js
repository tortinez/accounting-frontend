PurchaseTableController.$inject = [
	'$scope',
	'$location',
	'$mdDialog',
	'mdPickerColors',
	'Purchase',
	'OtherResource',
	'Auth',
	'AutocompleteFields'
];

function PurchaseTableController(
	$scope,
	$location,
	$mdDialog,
	mdPickerColors,
	Purchase,
	OtherResource,
	Auth,
	AutocompleteFields
) {
	var vm = this;
	//retrieve the filtering & pagination params state
	vm.params = Purchase.params;
	//get the items of the table
	Purchase.search(vm.params).then(res => (vm.purchases = res));
	//set the items for the filtering tab
	vm.hideFilters = true;
	vm.date = Purchase.date;
	vm.sizeOpt = [50, 75, 100];
	//retrieve the list of projects, status, type and supplier
	OtherResource.query('project', 'code').then(res => {
		angular.forEach(res, function(item) {
			item.fullname = '(' + item.code + ') ' + item.name;
		});
		vm.projList = res;
	});
	OtherResource.query('supplier', 'name').then(res=>{vm.supplierList = res});
	OtherResource.query('employee', 'fullname').then(res=>{vm.employeeList = res});
	OtherResource.query('purchase-state', 'name').then(res=>{vm.statusList = res});
	OtherResource.query('purchase-type', 'name').then(res=>{vm.typeList = res});
	//functions
	vm.search = search;
	vm.downloadInvoice = downloadInvoice;
	vm.availableInvoice = availableInvoice;
	vm.viewItem = viewItem;
	vm.editItem = editItem;
	vm.prevPage = prevPage;
	vm.nextPage = nextPage;
	vm.autocompleteSearch = autocompleteSearch;
	vm.autocompleteItemChange = autocompleteItemChange;
	vm.toggleFilters = toggleFilters;
	vm.appliedFilters = appliedFilters;
	vm.chipRemoveFilter = chipRemoveFilter;
	vm.badgeColor = badgeColor;

	///////////////////////////////////////////////////////////////////////
	//variables____________________________________________________________

	vm.autocompleteObj = {
		chProj: null,
		reqProj: null,
		status: null,
		supplier: null,
		type: null,
		employee: null
	};

	//functions____________________________________________________________
	function search() {
		return Purchase.search(vm.params).then(res => (vm.purchases = res));
	}

	function downloadInvoice(purchase) {
		return window.open(['./api/purchase/' + purchase.id + '/invoice']);
	}

	function availableInvoice(purchase) {
		return purchase.invoicePath == null;
	}

	function editItem(purchase) {
		Purchase.cachePurchase = purchase;
		return $location.path('/purchaseform/' + purchase.id);
	}

	function viewItem(purchase) {
		vm.detailsPurchase = purchase;
		showDetailsDialog();
	}

	//Related to the pagination bar buttons
	function prevPage() {
		vm.params.page = vm.params.page - 1;
		return vm.search();
	}

	function nextPage() {
		vm.params.page = vm.params.page + 1;
		return vm.search();
	}

	//Related to the filters
	//Autocomplete fields
	function autocompleteSearch(query, items) {
		return AutocompleteFields.search(query, items);
	}

	function autocompleteItemChange() {
		var item = vm.autocompleteObj;
		vm.params.chProj = item.chProj ? item.chProj.id : null;
		vm.params.reqProj = item.reqProj ? item.reqProj.id : null;
		vm.params.status = item.status ? item.status.id : null;
		vm.params.supplier = item.supplier ? item.supplier.id : null;
		vm.params.type = item.type ? item.type.id : null;
		vm.params.employee = item.employee ? item.employee.id : null;

		return vm.search();
	}

	//Save filters on exit
	$scope.$on('$locationChangeStart', function(event) {
		Purchase.params = vm.params;
	});

	//other___
	function toggleFilters() {
		vm.hideFilters = !vm.hideFilters;
	}

	function appliedFilters() {
		var filters = [];

		if (vm.params.amountMax != null || vm.params.amountMin != null)
			filters.push('amount');
		if (vm.params.dateMax != null && vm.params.dateMin != null)
			filters.push('date');
		if (vm.params.item != '') filters.push('concept');
		if (vm.params.code != '') filters.push('code');
		if (vm.params.codeLV != '') filters.push('codeLV');
		if (vm.params.codeRP != '') filters.push('codeRP');
		if (vm.params.codeERP != '') filters.push('codeERP');
		if (vm.params.engagement != '') filters.push('engagement code');
		if (vm.params.billing != '') filters.push('billing code');
		if (vm.params.chProj != null) filters.push('ch. project');
		if (vm.params.reqProj != null) filters.push('req. project');
		if (vm.params.status != null) filters.push('status');
		if (vm.params.supplier != null) filters.push('supplier');
		if (vm.params.type != null) filters.push('type');
		if (vm.params.employee != null) filters.push('req. person');

		return filters;
	}

	function chipRemoveFilter(item) {
		switch (item) {
			case 'amount':
				vm.params.amountMax = null;
				vm.params.amountMin = null;
				break;
			case 'date':
				vm.params.dateMax = null;
				vm.params.dateMin = null;
				break;
			case 'concept':
				vm.params.item = '';
				break;
			case 'code':
				vm.params.code = '';
				break;
			case 'codeRP':
				vm.params.codeRP = '';
				break;
			case 'codeLV':
				vm.params.codeLV = '';
				break;
			case 'codeERP':
				vm.params.codeERP = '';
				break;
			case 'billing code':
				vm.params.billing = '';
				break;
			case 'engagement code':
				vm.params.engagement = '';
				break;
			case 'ch. project':
				vm.params.chProj = null;
				vm.autocompleteObj.chProj = null;
				break;
			case 'req. project':
				vm.params.reqProj = null;
				vm.autocompleteObj.reqProj = null;
				break;
			case 'status':
				vm.params.status = null;
				vm.autocompleteObj.status = null;
				break;
			case 'supplier':
				vm.params.supplier = null;
				vm.autocompleteObj.supplier = null;
				break;
			case 'type':
				vm.params.type = null;
				vm.autocompleteObj.type = null;
				break;
			case 'req. person':
				vm.params.employee = null;
				vm.autocompleteObj.employee = null;
				break;
			default:
				console.log('An error occured when removing a filter');
				break;
		}
		search();
	}

	function badgeColor(hex) {
		var color = mdPickerColors.getColor(hex);
		return color.name;
	}

	//Dialog________________________________________________________________
	function showDetailsDialog(ev) {
		$mdDialog.show({
			controller: DetailsDialogController,
			controllerAs: 'vm',
			template: require('./details-dialog.template.html'),
			targetEvent: ev,
			parent: angular.element(document.body),
			clickOutsideToClose: true,
			locals: { purchase: vm.detailsPurchase }
		});
	}
	DetailsDialogController.$inject = ['$mdDialog', 'purchase'];
	function DetailsDialogController($mdDialog, purchase) {
		var dialogVm = this;
		dialogVm.purchase = purchase;
		dialogVm.close = close;

		//////////////////////////
		function close() {
			$mdDialog.hide();
		}
	}
}

export default PurchaseTableController;
