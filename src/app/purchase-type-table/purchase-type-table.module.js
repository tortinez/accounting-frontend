'use strict';

import PurchaseTypeTableController from './purchase-type-table.component';

// Define the 'purchase-type' module
angular
	.module('purchaseTypeTable', ['common.other-resource'])

	// Register the 'purchaseType' page along with its controller an template
	.component('purchaseTypeTable', {
		template: require('./purchase-type-table.template.html'),
		controller: PurchaseTypeTableController,
		controllerAs: 'vm'
	});

export default purchaseTypeTable;
