(function() {
	'use strict';

	import AutocompleteFields from './autocomplete-fields.service';

	// Define the 'common.autocomplete-fields' module
	angular
		.module('common.autocomplete-fields', [])
		.factory('AutocompleteFields', AutocompleteFields);

	export default common.autocomplete - fields;
})();
