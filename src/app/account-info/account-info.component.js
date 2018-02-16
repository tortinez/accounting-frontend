AccountInfoController.$inject = ['$location', '$mdToast', 'User'];

function AccountInfoController($location, $mdToast, User) {
	var vm = this;
	//variables
	vm.user = {};
	vm.title = '';
	//functions
	vm.editPassword = editPassword;
	vm.userRole = userRole;

	////////////////////////////////////////////////////////////////////////
	//variables_____________________________________________________________
	//get the data from the api
	User.getSelf().$promise.then(function(res) {
		vm.user = res;
	});

	//functions_____________________________________________________________
	function editPassword() {
		return User.saveSelfPassword(vm.user).then(
			function(value) {
				console.log('Password changed');
				showToast('Password Changed');
				$location.path('/purchases');
			},
			function(err) {
				console.error(
					'The password cannot be modified',
					err.status,
					err.statusText
				);
			}
		);
	}

	function userRole() {
		var role = '';
		if (vm.user.isAdmin) role = 'ADMIN';
		else if (vm.user.isManager) role = 'MANAGER';
		else if (vm.user.isUser) role = 'USER';
		else role = '';

		return role;
	}

	//create a toast to perform some actions________________________
	function showToast(msg) {
		$mdToast.show(
			$mdToast
				.simple()
				.textContent(msg)
				.position('top right')
				.hideDelay(2500)
		);
	}
}

export default AccountInfoController;
