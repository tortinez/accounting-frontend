function AutocompleteFields() {
	return { search: search };

	function search(query, items) {
		return !query
			? items
			: items.filter(function(item) {
					var lowerCaseItem = angular.lowercase(
						item.fullname ? item.fullname : item.name
					);
					var lowercaseQuery = angular.lowercase(query);
					return lowerCaseItem.indexOf(lowercaseQuery) >= 0;
			  });
	}
}

export default AutocompleteFields;
