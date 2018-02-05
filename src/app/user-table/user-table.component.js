(function() {
	'use strict';

	// Register the 'user' page along with its controller an template
	angular.module('userTable').component('userTable', {
		templateUrl: 'app/user-table/user-table.template.html',
		controller: UserTableController,
		controllerAs: 'vm'
	});

	UserTableController.$inject = ['$mdDialog', 'Auth', 'User', 'OtherResource'];

	function UserTableController($mdDialog, Auth, User, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.users = User.api().query();
		vm.user = Auth.user;
		//variables
		vm.item = {};
		vm.title = '';
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		vm.editPassword = editPassword;
		vm.userRole = userRole;
		//dialogs
		vm.showEdit = showEdit;
		vm.showPasswordEdit = showPasswordEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(user) {
			vm.item = user;
			vm.title = 'Edit User';
			vm.showEdit();
		}

		function addItem() {
			vm.item = {};
			vm.title = 'Add User';
			vm.showEdit();
		}

		function editPassword(user) {
			vm.item = user;
			vm.showPasswordEdit();
		}

		function userRole(item) {
			var role = '';
			switch (item.roles.length) {
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

		//Dialogs________________________________________________________________
		function showPasswordEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/user-table/editPasswordDialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: false
			});
		}
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/user-table/editDialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: false
			});
		}
		function DialogController(
			$scope,
			$routeParams,
			$mdDialog,
			$mdToast,
			AutocompleteFields,
			OtherResource
		) {
			//functions callable from the html
			$scope.cancel = cancel;
			$scope.editUser = editUser;
			$scope.assignRoles = assignRoles;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			vm.item.id
				? User.api()
						.get({ id: vm.item.id })
						.$promise.then(function(res) {
							$scope.item = res;
							$scope.role = vm.userRole($scope.item);
						})
				: ($scope.item = {});

			$scope.employeeList = OtherResource.api('employee').query();
			$scope.role = '';
			$scope.title = vm.title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editUser() {
				return User.save($scope.item).then(
					function(value) {
						User.api()
							.query()
							.$promise.then(function(res) {
								vm.users = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('User saved: ID=', value.id);
					},
					function(err) {
						if (err.status == 409) {
							showToast('This username is already in use');
						} else {
							showToast('An error occured');
						}
						console.error(
							'The user cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function assignRoles(role) {
				switch (role) {
					case 'USER':
						$scope.item.roles = ['USER'];
						break;
					case 'MANAGER':
						$scope.item.roles = ['USER', 'MANAGER'];
						break;
					case 'ADMIN':
						$scope.item.roles = ['USER', 'MANAGER', 'ADMIN'];
						break;
					default:
						$scope.item.roles = ['USER'];
						break;
				}
				return $scope.item;
			}

			function removeItem(user) {
				User.remove(user).then(
					function() {
						User.api()
							.query()
							.$promise.then(function(res) {
								vm.users = res;
							});
						showToast('User Deleted!');
						console.log('Succesfully removed');
					},
					function(err) {
						console.error(
							'The item could not be deleted:',
							err.status,
							err.statusText
						);
					}
				);
				$mdDialog.hide();
			}

			//Related to the autocomplete form inputs
			$scope.autocompleteSearch = function(query, items) {
				return AutocompleteFields.search(query, items);
			};

			//create a dialog and a toast to perform some actions________________________
			function showToast(msg) {
				$mdToast.show(
					$mdToast
						.simple()
						.textContent(msg)
						.position('top right')
						.hideDelay(3000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the user?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.item).then(console.log('User Deleted!'));
					},
					function() {
						console.log('Delete user cancelled');
					}
				);
			}
		}
	}
})();
