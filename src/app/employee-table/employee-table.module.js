'use strict';

import EmployeeTableController from './employee-table.component';

// Define the 'employee' module
export default angular
	.module('employeeTable', ['common.other-resource'])
	.component('employeeTable', {
		templateUrl: require('./employee-table.template.html'),
		controller: EmployeeTableController,
		controllerAs: 'vm'
	});
