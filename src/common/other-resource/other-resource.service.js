OtherResource.$inject = ['$resource'];
function OtherResource($resource) {
	//$resource Objects________________________________________________________
	//not returned
	var resource = $resource(
		'/api/:entity/:id',
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

	function query(entity) {
		return resource.query({ entity: entity });
	}

	//override save and remove $resource methods
	function save(entity, item) {
		//convert binded data to id parameters
		switch (entity) {
			case 'project':
				item.managerId = item.manager.id;
				item.clientId = item.client.id;
				item.typeId = item.type.id;
				break;
			case 'client':
				item.typeId = item.type.id;
				break;
			default:
				break;
		}

		return item.id
			? resource.update({ entity: entity }, item).$promise
			: resource.save({ entity: entity }, item).$promise;
	}

	function remove(entity, item) {
		return resource.remove({ entity: entity, id: item.id }).$promise;
	}
}

export default OtherResource;
