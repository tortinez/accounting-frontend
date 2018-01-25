(function() {
	'use strict';

	// Register the 'purchaseTable' page along with its controller an template
	angular.module('purchaseTable').component('purchaseTable', {
		templateUrl: 'app/purchase-table/purchase-table.template.html',
		controller: PurchaseTableController,
		controllerAs: 'vm'
	});

	PurchaseTableController.$inject = [
		'$location',
		'Purchase',
		'Project',
		'Auth',
		'Supplier',
		'Employee',
		'PurchaseStatus',
		'PurchaseType',
		'AutocompleteFields'
	];

	function PurchaseTableController(
		$location,
		Purchase,
		Project,
		Auth,
		Supplier,
		Employee,
		PurchaseStatus,
		PurchaseType,
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
		vm.projList = Project.api.query();
		vm.supplierList = Supplier.api.query();
		vm.employeeList = Employee.api.query();
		vm.statusList = PurchaseStatus.api.query();
		vm.typeList = PurchaseType.api.query();

		///////////////////////////////////////////////////////////////////////
		//variables____________________________________________________________
		vm.params = {
			amountMax: 10000,
			amountMin: 0,
			dateMax: Purchase.date.max,
			dateMin: Purchase.date.min,
			item: '',
			chProj: null,
			reqProj: null,
			status: null,
			supplier: null,
			type: null,
			page: 0,
			size: 50
		};

		vm.autocompleteObj = {
			chProj: null,
			reqProj: null,
			status: null,
			supplier: null,
			type: null
		};

		//functions____________________________________________________________

		vm.search = function() {
			return (vm.purchases = Purchase.search(vm.params));
		};

		vm.downloadInvoice = function(purchase) {
			return window.open(['/api/purchase/' + purchase.id + '/invoice']);
		};

		vm.availableInvoice = function(purchase) {
			return purchase.invoicePath == null;
		};

		vm.editItem = function(purchase) {
			Purchase.cachePurchase = purchase;
			return $location.path('/purchaseform/' + purchase.id);
		};

		//Related to the pagination bar buttons
		vm.prevPage = function() {
			vm.params.page = vm.params.page - 1;
			return vm.search();
		};

		vm.nextPage = function() {
			vm.params.page = vm.params.page + 1;
			return vm.search();
		};

		//Related to the filters
		//Autocomplete fields
		vm.autocompleteSearch = function(query, items) {
			return AutocompleteFields.search(query, items);
		};

		vm.autocompleteItemChange = function() {
			var item = vm.autocompleteObj;
			vm.params.chProj = item.chProj ? item.chProj.name : null;
			vm.params.reqProj = item.reqProj ? item.reqProj.name : null;
			vm.params.status = item.status ? item.status.name : null;
			vm.params.supplier = item.supplier ? item.supplier.name : null;
			vm.params.type = item.type ? item.type.name : null;

			return vm.search();
		};
		vm.toggleFilters = function() {
			vm.hideFilters = !vm.hideFilters;
		};
	}
})();
