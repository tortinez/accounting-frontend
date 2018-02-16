import ClientTypeTableController from './client-type-table.component';

// Define the 'client-type' module
export default angular
	.module('clientTypeTable', [])
	.component('clientTypeTable', {
		template: require('./client-type-table.template.html'),
		controller: ClientTypeTableController,
		controllerAs: 'vm'
	});
