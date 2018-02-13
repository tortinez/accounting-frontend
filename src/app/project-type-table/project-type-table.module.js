'use strict';

import ProjectTypeTableController from './project-type-table.component';

// Define the 'project-type' module
export default angular
	.module('projectTypeTable', [])
	.component('projectTypeTable', {
		template: require('./project-type-table.template.html'),
		controller: ProjectTypeTableController,
		controllerAs: 'vm'
	});
