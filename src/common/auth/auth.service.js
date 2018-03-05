Auth.$inject = ['$http'];

function Auth($http) {
	var vm = this;
	//Variables
	vm.user = {
		isLogged: false,
		roles: {}
	};

	return {
		login: login,
		logout: logout,
		isAuthenticated: isAuthenticated,
		user: vm.user
	};

	//////////////////////////////////////////////////////////////////////
	//LOGIN FUNCTION
	function login(credentials) {
		const config = {};
		if (credentials && credentials.user && credentials.password) {
			config.headers = {};
			config.headers.authorization =
				'Basic ' + btoa(credentials.user + ':' + credentials.password);
		}
		return $http.get('/api/user/self', config).then(
			res => {
				vm.user.isLogged = !!res;
				if (vm.user.isLogged) {
					vm.user.name = res.data.employee.fullname;
					vm.user.roles = res.data.roles;

					vm.user.isAdmin = vm.user.roles.includes('ADMIN');
					vm.user.isManager = vm.user.roles.includes('MANAGER');
					vm.user.isUser = vm.user.roles.includes('USER');
					console.log('Login success');
				} else {
					console.log('Login failed');
				}

				return { status: vm.user.isLogged };
			},
			err => {
				console.log('Login Failed. ' + err.data.message);

				return { status: false, message: err.data.message };
			}
		);
	}

	//LOGOUT FUNCTION
	function logout() {
		return $http.get('/logout').then(
			res => {
				console.log('Logout failed');
				return vm.user.isLogged;
			},
			err => {
				console.log('Logout success');
				vm.user.isLogged = false;
				return vm.user.isLogged;
			}
		);
	}

	//Check if user was already logged in a previous session
	function isAuthenticated() {
		return $http.get('/api/user/self').then(
			res => {
				vm.user.isLogged = !!res;
				vm.user.name = res.data.employee.fullname;
				vm.user.roles = res.data.roles;

				vm.user.isAdmin = vm.user.roles.includes('ADMIN');
				vm.user.isManager = vm.user.roles.includes('MANAGER');
				vm.user.isUser = vm.user.roles.includes('USER');

				return vm.user.isLogged;
			},
			err => {
				return false;
			}
		);
	}
}

export default Auth;
