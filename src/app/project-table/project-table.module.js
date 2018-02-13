'use strict';

import ProjectTableController from './project-table.component';

// Define the 'project' module
angular
	.module('projectTable', ['common.other-resource'])

	// Register the 'project' page along with its controller an template
	.component('projectTable', {
		template: require('./project-table.template.html'),
		controller: ProjectTableController,
		controllerAs: 'vm'
	});

export default ProjectTable;
