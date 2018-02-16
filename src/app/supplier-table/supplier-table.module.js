import SupplierTableController from './supplier-table.component';

// Define the 'supplier' module
export default angular
.module('supplierTable', [])
.component('supplierTable', {
	template: require('./supplier-table.template.html'),
	controller: SupplierTableController,
	controllerAs: 'vm'
});
