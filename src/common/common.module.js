(function() {
	'use strict';

	// Define the 'common' module
	angular.module('common', [
		'common.purchase',
		'common.purchaseType',
		'common.purchaseStatus',
		'common.other-resource',
		'common.auth',
		'common.autocomplete-fields'
	]);
})();
