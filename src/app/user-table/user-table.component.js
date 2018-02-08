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

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(user) {
			vm.item = user;
			vm.title = 'Edit User';
			showFormDialog();
		}

		function addItem() {
			vm.item = {};
			vm.title = 'Add User';
			showFormDialog();
		}

		function editPassword(user) {
			vm.item = user;
			showPasswordFormDialog();
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
		function showPasswordFormDialog(ev) {
			$mdDialog.show({
				controller: FormDialogController,
				controllerAs: 'vm',
				templateUrl: 'app/user-table/password-form-dialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				locals: { title: vm.title, itemId: vm.item.id }
			});
		}
		function showFormDialog(ev) {
			$mdDialog.show({
				controller: FormDialogController,
				controllerAs: 'vm',
				templateUrl: 'app/user-table/form-dialog.template.html',
				targetEvent: ev,
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				locals: { title: vm.title, itemId: vm.item.id }
			});
		}
		function FormDialogController(
			$mdDialog,
			$mdToast,
			AutocompleteFields,
			OtherResource,
			title,
			itemId
		) {
			var vm2 = this;
			//functions callable from the html
			vm2.cancel = cancel;
			vm2.editUser = editUser;
			vm2.assignRoles = assignRoles;
			vm2.showConfirmDialog = showConfirmDialog;
			vm2.autocompleteSearch = autocompleteSearch;
			//get the data from the service
			itemId
				? User.api()
						.get({ id: itemId })
						.$promise.then(function(res) {
							vm2.item = res;
							vm2.role = vm.userRole(vm2.item);
						})
				: (vm2.item = {});
			vm2.employeeList = OtherResource.api('employee').query();

			vm2.role = '';
			vm2.title = title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editUser() {
				return User.save(vm2.item).then(
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
							$mdDialog.hide();
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
						vm2.item.roles = ['USER'];
						break;
					case 'MANAGER':
						vm2.item.roles = ['USER', 'MANAGER'];
						break;
					case 'ADMIN':
						vm2.item.roles = ['USER', 'MANAGER', 'ADMIN'];
						break;
					default:
						vm2.item.roles = ['USER'];
						break;
				}
				return vm2.item;
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
						showToast('An error occured');
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
			function autocompleteSearch(query, items) {
				return AutocompleteFields.search(query, items);
			}

			//create a dialog and a toast to perform some actions________________________
			function showToast(msg) {
				$mdToast.show(
					$mdToast
						.simple()
						.textContent(msg)
						.position('top right')
						.hideDelay(2500)
				);
			}

			function showConfirmDialog(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the user?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem(vm2.item).then(console.log('User Deleted!'));
					},
					function() {
						console.log('Delete user cancelled');
					}
				);
			}
		}
	}
})();
