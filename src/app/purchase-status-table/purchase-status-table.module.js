'use strict';

import PurchaseStatusTableController from './purchase-status-table.component';

// Define the 'purchase-status' module
export default angular
	.module('purchaseStatusTable', ['common.other-resource'])
	.component('purchaseStatusTable', {
		template: require('./purchase-status-table.template.html'),
		controller: PurchaseStatusTableController,
		controllerAs: 'vm'
	});
