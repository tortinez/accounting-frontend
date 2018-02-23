PurchaseTableController.$inject = [
	'$location',
	'mdPickerColors',
	'Purchase',
	'OtherResource',
	'Auth',
	'AutocompleteFields'
];

function PurchaseTableController(
	$location,
	mdPickerColors,
	Purchase,
	OtherResource,
	Auth,
	AutocompleteFields
) {
	var vm = this;
	//get the items of the table
	vm.purchases = Purchase.query();
	//set the items for the filtering tab
	vm.hideFilters = true;
	vm.date = Purchase.date;
	vm.sizeOpt = [50, 75, 100];
	//retrieve the list of projects, status, type and supplier
	vm.projList = OtherResource.query('project');
	vm.supplierList = OtherResource.query('supplier');
	vm.employeeList = OtherResource.query('employee');
	vm.statusList = OtherResource.query('purchase-state');
	vm.typeList = OtherResource.query('purchase-type');
	//functions
	vm.search = search;
	vm.downloadInvoice = downloadInvoice;
	vm.availableInvoice = availableInvoice;
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
	vm.params = {
		amountMax: null,
		amountMin: null,
		dateMax: Purchase.date.max,
		dateMin: Purchase.date.min,
		item: '',
		code: '',
		codeRP: '',
		codeLV: '',
		chProj: null,
		reqProj: null,
		status: null,
		supplier: null,
		type: null,
		employee: null,
		page: 0,
		size: 50
	};

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
		return (vm.purchases = Purchase.search(vm.params));
	}

	function downloadInvoice(purchase) {
		return window.open(['/api/purchase/' + purchase.id + '/invoice']);
	}

	function availableInvoice(purchase) {
		return purchase.invoicePath == null;
	}

	function editItem(purchase) {
		Purchase.cachePurchase = purchase;
		return $location.path('/purchaseform/' + purchase.id);
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
		vm.params.chProj = item.chProj ? item.chProj.name : null;
		vm.params.reqProj = item.reqProj ? item.reqProj.name : null;
		vm.params.status = item.status ? item.status.name : null;
		vm.params.supplier = item.supplier ? item.supplier.name : null;
		vm.params.type = item.type ? item.type.name : null;
		vm.params.employee = item.employee ? item.employee.fullname : null;

		return vm.search();
	}

	//other___
	function toggleFilters() {
		vm.hideFilters = !vm.hideFilters;
	}

	function appliedFilters() {
		var filters = [];

		if (vm.params.amountMax != null || vm.params.amountMin != null)
			filters.push('amount');
		if (vm.params.dateMax != null || vm.params.dateMin != null)
			filters.push('date');
		if (vm.params.item != '') filters.push('concept');
		if (vm.params.code != '') filters.push('code');
		if (vm.params.codeLV != '') filters.push('codeLV');
		if (vm.params.codeRP != '') filters.push('codeRP');
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
				vm.autocompleteObj.status=null;
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
}

export default PurchaseTableController;
