import ClientTableController from './client-table.component';

// Define the 'clent-table' module
export default angular
.module('clientTable', [])
.component('clientTable', {
	template: require('./client-table.template.html'),
	controller: ClientTableController,
	controllerAs: 'vm'
});
