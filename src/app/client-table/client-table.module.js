(function() {
	'use strict';

	import ClientTableController from './client-table.component';

	// Define the 'clent-table' module
	angular
		.module('clientTable', ['common.other-resource'])

		// Register the 'client' page along with its controller an template
		.component('clientTable', {
			templateUrl: require('./client-table.template.html'),
			controller: ClientTableController,
			controllerAs: 'vm'
		});

	export default clientTable;
})();
