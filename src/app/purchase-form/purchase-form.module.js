'use strict';

import PurchaseFormController from './purchase-form.component';

// Define the 'purchaseForm' module
angular.module('purchaseForm', ['common.purchase']);

// Register the 'purchaseForm' page along with its controller an template
angular.module('purchaseForm').component('purchaseForm', {
	template: require('./purchase-form.template.html'),
	controller: PurchaseFormController,
	controllerAs: 'vm'
});

export default purchaseForm;
