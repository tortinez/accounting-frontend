(function() {
	'use strict';

	angular
		.module('common.autocomplete-fields')
		.factory('AutocompleteFields', AutocompleteFields);

	function AutocompleteFields() {
		return { search: search };

		function search(query, items) {
			return !query
				? items
				: items.filter(function(item) {
						var lowerCaseItem = angular.lowercase(item.name);
						var lowercaseQuery = angular.lowercase(query);
						return lowerCaseItem.indexOf(lowercaseQuery) === 0;
					});
		}
	}
})();
