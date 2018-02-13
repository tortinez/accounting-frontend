'use strict';

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
	vm.purchases = Purchase.api().query();
	//set the items for the filtering tab
	vm.hideFilters = true;
	vm.date = Purchase.date;
	vm.sizeOpt = [50, 75, 100];
	//retrieve the list of projects, status, type and supplier
	vm.projList = OtherResource.api('project').query();
	vm.supplierList = OtherResource.api('supplier').query();
	vm.employeeList = OtherResource.api('employee').query();
	vm.statusList = OtherResource.api('purchase-state').query();
	vm.typeList = OtherResource.api('purchase-type').query();
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
	vm.badgeColor = badgeColor;

	///////////////////////////////////////////////////////////////////////
	//variables____________________________________________________________
	vm.params = {
		amountMax: 10000,
		amountMin: 0,
		dateMax: Purchase.date.max,
		dateMin: Purchase.date.min,
		item: '',
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

	function badgeColor(hex) {
		var color = mdPickerColors.getColor(hex);
		return color.name;
	}
}

export default PurchaseTableController;
