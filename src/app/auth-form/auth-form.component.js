(function() {
	'use strict';

	AuthFormController.$inject = ['$routeParams', '$location', 'Auth'];

	function AuthFormController($routeParams, $location, Auth) {
		var vm = this;

		vm.credentials = {}; //variable to store credentials
		vm.login = login;
		vm.LoginStatus = '';

		///////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function login() {
			return Auth.login(vm.credentials).then(function(status) {
				if (!status) {
					vm.LoginStatus = 'The username or password entered is incorrect';
				}
				if (status) {
					$location.path('/purchases');
				}
			});
		}
	}

	export default AuthFormController;
})();
