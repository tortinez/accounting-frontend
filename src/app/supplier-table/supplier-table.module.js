'use strict';

import SupplierTableController from './supplier-table.component';

// Define the 'supplier' module
export default angular
	.module('supplierTable', ['common.other-resource'])
	.component('supplierTable', {
		template: require('./supplier-table.template.html'),
		controller: SupplierTableController,
		controllerAs: 'vm'
	});
