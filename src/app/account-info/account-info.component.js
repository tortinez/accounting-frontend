'use strict';

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
	User.self()
		.get()
		.$promise.then(function(res) {
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
		switch (vm.user.roles.length) {
			case 1:
				role = 'USER';
				break;
			case 2:
				role = 'MANAGER';
				break;
			case 3:
				role = 'ADMIN';
				break;
			default:
				'';
				break;
		}
		return role;
	}

	//create a toast to perform some actions________________________
	function showToast(msg) {
		$mdToast.show(
			$mdToast
				.simple()
				.textContent(msg)
				.position('top right')
				.hideDelay(3000)
		);
	}
}

export default AccountInfoController;
