(function() {
	'use strict';

	import SupplierTableController from './supplier-table.component';

	// Define the 'supplier' module
	angular
		.module('supplierTable', ['common.other-resource'])

		// Register the 'supplier' page along with its controller an template
		.component('supplierTable', {
			template: require('./supplier-table.template.html'),
			controller: SupplierTableController,
			controllerAs: 'vm'
		});

	export default supplierTable;
})();
