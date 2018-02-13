'use strict';

import PurchaseFormController from './purchase-form.component';

// Define the 'purchaseForm' module
export default angular
	.module('purchaseForm', [])
	.component('purchaseForm', {
		template: require('./purchase-form.template.html'),
		controller: PurchaseFormController,
		controllerAs: 'vm'
	});
