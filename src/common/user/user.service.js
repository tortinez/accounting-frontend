(function() {
	'use strict';

	angular.module('common.user').factory('User', User);

	User.$inject = ['$resource'];

	function User($resource) {
		return {
			//api calls using $resource
			api: api,
			self: self,
			//other functions
			save: save,
			remove: remove
		};

		///////////////////////////////////////////////////////////////////////////
		//Functions________________________________________________________________
		function self() {
			return $resource('/api/user/self', {});
		}

		function api() {
			return $resource(
				'/api/user/:id',
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
		function save(user) {
			//convert binded data to id parameters
			user.employeeId = user.employee.id;

			return user.id
				? this.api().update(user).$promise
				: this.api().save(user).$promise;
		}

		function remove(user) {
			return this.api().remove({ id: user.id }).$promise;
		}
	}
})();
