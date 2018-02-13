'use strict';

import ProjectTypeTableController from './project-type-table.component';

// Define the 'project-type' module
angular
	.module('projectTypeTable', ['common.other-resource'])

	// Register the 'projectType' page along with its controller an template
	.component('projectTypeTable', {
		template: require('./project-type-table.template.html'),
		controller: ProjectTypeTableController,
		controllerAs: 'vm'
	});

export default projectTypeTable;
