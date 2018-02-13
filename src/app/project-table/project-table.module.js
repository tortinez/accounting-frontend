'use strict';

import ProjectTableController from './project-table.component';

// Define the 'project' module
export default angular
	.module('projectTable', [])
	.component('projectTable', {
		template: require('./project-table.template.html'),
		controller: ProjectTableController,
		controllerAs: 'vm'
	});
