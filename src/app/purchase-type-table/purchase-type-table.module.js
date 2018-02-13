'use strict';

import PurchaseTypeTableController from './purchase-type-table.component';

// Define the 'purchase-type' module
export default angular
	.module('purchaseTypeTable', ['common.other-resource'])
	.component('purchaseTypeTable', {
		template: require('./purchase-type-table.template.html'),
		controller: PurchaseTypeTableController,
		controllerAs: 'vm'
	});
