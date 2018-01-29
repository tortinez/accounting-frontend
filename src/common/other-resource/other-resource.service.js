(function() {
	'use strict';

	angular
		.module('common.other-resource')
		.factory('OtherResource', OtherResource);

	OtherResource.$inject = ['$resource'];
	function OtherResource($resource) {
		return {
			api: api,
			save: save,
			remove: remove
		};

		//////////////////////////////////////////////////////////////////////

		//Functions___________________________________________________________
		function api(entity) {
			return $resource(
				'/api/' + entity + '/:id',
				{ id: '@id' },
				{
					//Modify some HTTP methods
					query: {
						method: 'GET',
						isArray: true
					},
					update: { method: 'PUT' }
				}
			);
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
				? this.api(entity).update(item).$promise
				: this.api(entity).save(item).$promise;
		}

		function remove(entity, item) {
			return this.api(entity).remove({ id: item.id }).$promise;
		}
	}
})();
