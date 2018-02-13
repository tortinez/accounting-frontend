'use strict';

import AccountInfoController from './account-info.component';

// Define the 'account-info' module
export default angular
	.module('accountInfo', ['common.user'])
	.component('accountInfo', {
		template: require('./account-info.template.html'),
		controller: AccountInfoController,
		controllerAs: 'vm'
	});
