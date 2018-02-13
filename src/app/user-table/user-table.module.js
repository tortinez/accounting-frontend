'use strict';

import UserTableController from './user-table.component';

// Define the 'user' module
export default angular
	.module('userTable', [])
	.component('userTable', {
		template: require('./user-table.template.html'),
		controller: UserTableController,
		controllerAs: 'vm'
	});
