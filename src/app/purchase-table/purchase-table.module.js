'use strict';

import PurchaseTableController from './purchase-table.component';

angular
	.module('purchaseTable', ['common.purchase'])

	// Register the 'purchaseTable' page along with its controller an template
	.component('purchaseTable', {
		template: require('./purchase-table.template.html'),
		controller: PurchaseTableController,
		controllerAs: 'vm'
	});

export default purchaseTable;
