(function() {
	'use strict';

	// Register the 'account-info' page along with its controller an template
	angular.module('accountInfo').component('accountInfo', {
		templateUrl: 'app/account-info/account-info.template.html',
		controller: AccountInfoController,
		controllerAs: 'vm'
	});

	AccountInfoController.$inject = ['$location', 'User'];

	function AccountInfoController($location, User) {
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
	}
})();
