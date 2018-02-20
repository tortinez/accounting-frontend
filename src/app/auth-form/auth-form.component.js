AuthFormController.$inject = ['$routeParams', '$location', 'Auth'];

function AuthFormController($routeParams, $location, Auth) {
	var vm = this;

	vm.credentials = {}; //variable to store credentials
	vm.login = login;
	vm.LoginStatus = '';

	///////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function login() {
		return Auth.login(vm.credentials).then(res => {
			if (!res.status) {
				if (res.message == 'Bad credentials')
					vm.LoginStatus = 'The username or password entered is incorrect';
				else vm.LoginStatus = res.message;
			}
			if (res.status) {
				$location.path('/purchases');
			}
		});
	}
}

export default AuthFormController;
