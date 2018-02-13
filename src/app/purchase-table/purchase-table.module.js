'use strict';

import PurchaseTableController from './purchase-table.component';

export default angular
	.module('purchaseTable', ['common.purchase'])
	.component('purchaseTable', {
		template: require('./purchase-table.template.html'),
		controller: PurchaseTableController,
		controllerAs: 'vm'
	});
