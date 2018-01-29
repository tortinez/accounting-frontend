(function() {
	'use strict';

	// Define the 'common' module
	angular.module('common', [
		'common.purchase',
		'common.purchaseType',
		'common.purchaseStatus',
		'common.other-resource',
		'common.projectType',
		'common.client',
		'common.clientType',
		'common.supplier',
		'common.employee',
		'common.user',
		'common.auth',
		'common.autocomplete-fields'
	]);
})();
