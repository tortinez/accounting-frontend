(function() {
	'use strict';

	Auth.$inject = ['$resource'];

	function Auth($resource) {
		var vm = this;
		//Variables
		vm.user = {
			isLogged: false,
			role: null
		};

		return {
			login: login,
			logout: logout,
			isAuthenticated: isAuthenticated,
			user: vm.user
		};

		//////////////////////////////////////////////////////////////////////

		//Functions ($resource)________________________________________________________________
		function resource(credentials) {
			return $resource(
				'/api/user/self',
				{},
				{
					//create login method
					login: {
						method: 'GET',
						headers: {
							Authorization:
								'Basic ' + btoa(credentials.user + ':' + credentials.password),
							withCredentials: true
						}
					}
				}
			);
		}

		function logoutResource() {
			return $resource('/logout', {}, {});
		}

		//LOGIN FUNCTION
		function login(credentials) {
			return resource(credentials)
				.login()
				.$promise.then(getAuthSuccess)
				.catch(getAuthFailed);
		}

		//LOGOUT FUNCTION
		function logout() {
			return logoutResource().get().$promise;
		}

		//Check if user was already logged in a previous session
		function isAuthenticated() {
			var credentials = {};
			return resource(credentials)
				.get()
				.$promise.then(getAuthSuccess)
				.catch(getAuthFailed);
		}

		//then & catch
		function getAuthSuccess(response) {
			vm.user.isLogged = !!response;
			vm.user.name = response.employee.fullname;
			if (response.roles.length == 1) vm.user.role = 'USER';
			if (response.roles.length == 2) vm.user.role = 'MANAGER';
			if (response.roles.length == 3) vm.user.role = 'ADMIN';
			console.log('Login success');
			return vm.user.isLogged;
		}

		function getAuthFailed(error) {
			console.log('Login failed');
			return false;
		}
	}

	export default Auth;
})();
