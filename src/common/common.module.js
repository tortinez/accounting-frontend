(function() {
	'use strict';

	// Define the 'common' module
	angular.module('common', [
		'common.purchase',
		'common.other-resource',
		'common.user',
		'common.auth',
		'common.autocomplete-fields'
	]);
})();
