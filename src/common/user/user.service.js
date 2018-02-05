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
			remove: remove,
			saveSelfPassword: saveSelfPassword
		};

		///////////////////////////////////////////////////////////////////////////
		//Functions________________________________________________________________
		function self() {
			return $resource('/api/user/self/:pass', { pass: '' });
		}

		function api() {
			return $resource(
				'/api/user/:id/:pass',
				{ id: '@id', pass: '' },
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
			var vm = this;
			//convert binded data to id parameters
			user.employeeId = user.employee.id;

			if (user.password) {
				return user.id
					? vm.api().save(
							{
								id: user.id,
								pass: 'password',
								password: user.password
							},
							{}
						).$promise
					: vm
							.api()
							.save(user)
							.$promise.then(function(res) {
								var userPassword = user.password;
								var model = vm; // reassign the api callback functions

								model.api().save(
									{
										id: res.id,
										pass: 'password',
										password: userPassword
									},
									{}
								).$promise;
							});
			} else {
				return user.id
					? this.api().update(user).$promise
					: this.api().save(user).$promise;
			}
		}

		function remove(user) {
			return this.api().remove({ id: user.id }).$promise;
		}

		function saveSelfPassword(user) {
			var vm = this;
			return vm.self().save(
				{
					pass: 'password',
					password: user.password
				},
				{}
			).$promise;
		}
	}
})();
