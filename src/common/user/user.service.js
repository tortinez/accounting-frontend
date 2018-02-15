'use strict';

User.$inject = ['$resource'];

function User($resource) {
	//$resource Objects________________________________________________________
	//not returned
	var resource = $resource(
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

	var self = $resource('/api/user/self/:pass', { pass: '' });

	//return statement_________________________________________________________
	return {
		get: get,
		query: query,
		getSelf: getSelf,
		save: save,
		remove: remove,
		saveSelfPassword: saveSelfPassword
	};

	///////////////////////////////////////////////////////////////////////////
	//Functions________________________________________________________________
	//override save and remove $resource methods
	function get(itemId) {
		return resource.get({id: itemId });
	}

	function query() {
		return resource.query();
	}

	function getSelf() {
		return self.get();
	}

	function save(user) {
		//convert binded data to id parameters
		user.employeeId = user.employee.id;

		if (user.password) {
			return user.id
				? resource.save(
						{
							id: user.id,
							pass: 'password',
							password: user.password
						},
						{}
					).$promise
				: resource.save(user).$promise.then(function(res) {
						var userPassword = user.password;

						resource.save(
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
				? resource.update(user).$promise
				: resource.save(user).$promise;
		}
	}

	function remove(user) {
		return resource.remove({ id: user.id }).$promise;
	}

	function saveSelfPassword(user) {
		var vm = this;
		return self.save(
			{
				pass: 'password',
				password: user.password
			},
			{}
		).$promise;
	}
}

export default User;
