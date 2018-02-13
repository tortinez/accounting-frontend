'use strict';

import EmployeeTableController from './employee-table.component';

// Define the 'employee' module
angular
	.module('employeeTable', ['common.other-resource'])

	// Register the 'employee' page along with its controller an template
	.component('employeeTable', {
		templateUrl: require('./employee-table.template.html'),
		controller: EmployeeTableController,
		controllerAs: 'vm'
	});

export default employeeTable;
