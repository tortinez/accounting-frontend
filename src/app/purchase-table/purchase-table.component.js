PurchaseTableController.$inject = [
	'$scope',
	'$location',
	'mdPickerColors',
	'Purchase',
	'OtherResource',
	'Auth',
	'AutocompleteFields'
];

function PurchaseTableController(
	$scope,
	$location,
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
	OtherResource.query('project').$promise.then(res => {
		angular.forEach(res, function(item) {
			item.fullname = '(' + item.code + ') ' + item.name;
		});
		vm.projList = res;
	});
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
		vm.params.chProj = item.chProj ? item.chProj.fullname : null;
		vm.params.reqProj = item.reqProj ? item.reqProj.fullname : null;
		vm.params.status = item.status ? item.status.name : null;
		vm.params.supplier = item.supplier ? item.supplier.name : null;
		vm.params.type = item.type ? item.type.name : null;
		vm.params.employee = item.employee ? item.employee.fullname : null;

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

	function badgeColor(hex) {
		var color = mdPickerColors.getColor(hex);
		return color.name;
	}
}

export default PurchaseTableController;
