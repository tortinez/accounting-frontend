(function() {
	'use strict';

	import PurchaseStatusTableController from './purchase-status-table.component';

	// Define the 'purchase-status' module
	angular
		.module('purchaseStatusTable', ['common.other-resource'])

		// Register the 'purchaseStatus' page along with its controller an template
		.component('purchaseStatusTable', {
			template: require('./purchase-status-table.template.html'),
			controller: PurchaseStatusTableController,
			controllerAs: 'vm'
		});

	export default purchaseStatusTable;
})();
