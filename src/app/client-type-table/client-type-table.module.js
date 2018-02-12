(function() {
	'use strict';

	import ClientTypeTableController from './client-type-table.component';

	// Define the 'client-type' module
	angular
		.module('clientTypeTable', ['common.other-resource'])

		// Register the 'clientType' page along with its controller an template
		.component('clientTypeTable', {
			template: require('./client-type-table.template.html'),
			controller: ClientTypeTableController,
			controllerAs: 'vm'
		});

	export default ClientTypeTable;
})();
