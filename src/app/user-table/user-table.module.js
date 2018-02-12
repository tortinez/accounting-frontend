(function() {
	'use strict';

	import UserTableController from './user-table.component';

	// Define the 'user' module
	angular
		.module('userTable', ['common.user'])

		// Register the 'user' page along with its controller an template
		.component('userTable', {
			template: require('./user-table.template.html'),
			controller: UserTableController,
			controllerAs: 'vm'
		});

	export default userTable;
})();
