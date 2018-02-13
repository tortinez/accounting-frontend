'use strict';

// Define the 'account-info' module
angular
	.module('accountInfo', ['common.user'])

	.component('accountInfo', {
		template: require('./account-info.template.html'),
		controller: AccountInfoController,
		controllerAs: 'vm'
	});

export default accountInfo;
