OtherResource.$inject = ['$resource', '$filter'];
function OtherResource($resource, $filter) {
	//$resource Objects________________________________________________________
	//not returned
	var resource = $resource(
		'./api/:entity/:id',
		{
			entity: 'undefined',
			id: '@id'
		},
		{
			//Modify some HTTP methods
			query: {
				method: 'GET',
				isArray: true
			},
			update: { method: 'PUT' }
		}
	);

	//return statement_________________________________________________________
	return {
		get: get,
		query: query,
		save: save,
		remove: remove
	};

	//////////////////////////////////////////////////////////////////////
	//Functions___________________________________________________________
	function get(entity, itemId) {
		return resource.get({ entity: entity, id: itemId });
	}

	function query(entity, sortBy) {
		return resource.query({ entity: entity }).$promise.then(res => {
			//sort the items by name
			return $filter('orderBy')(res, sortBy);
		});
	}

	//override save and remove $resource methods
	function save(entity, item) {
		var obj = {};
		//clone the item converting binded data to id parameters
		Object.keys(item).forEach(key => {
			if (typeof item[key] == 'object' && key[0] != '$') {
				obj[key + 'Id'] = item[key].id;
			} else if (key[0] != '$') obj[key] = item[key];
		});

		return item.id
			? resource.update({ entity: entity }, obj).$promise
			: resource.save({ entity: entity }, obj).$promise;
	}

	function remove(entity, item) {
		return resource.remove({ entity: entity, id: item.id }).$promise;
	}
}

export default OtherResource;
