(function() {
	'use strict';

	// Register the 'client' page along with its controller an template
	angular.module('clientTable').component('clientTable', {
		templateUrl: 'app/client-table/client-table.template.html',
		controller: ClientTableController,
		controllerAs: 'vm'
	});

	ClientTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function ClientTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.clients = OtherResource.api('client').query();
		vm.user = Auth.user;
		//variables
		vm.client = {};
		vm.title = '';
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(client) {
			vm.client = client;
			vm.title = 'Edit Client';
			vm.showEdit();
		}

		function addItem() {
			vm.client = {};
			vm.title = 'Add client';
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/client-table/editDialog.template.html',
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
			$scope.editClient = editClient;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			$scope.client = vm.client;
			$scope.typeList = OtherResource.api('client-type').query();

			$scope.title = vm.title;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editClient() {
				return OtherResource.save('client', $scope.client).then(
					function(value) {
						OtherResource.api('client')
							.query()
							.$promise.then(function(res) {
								vm.clients = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('Client saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
						console.error(
							'The client cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function removeItem(client) {
				OtherResource.remove('client', client).then(
					function() {
						OtherResource.api('client')
							.query()
							.$promise.then(function(res) {
								vm.clients = res;
							});
						showToast('Client Deleted!');
						console.log('Succesfully removed');
					},
					function(err) {
						if (err.status == 409 || err.statusText == 'Conflict') showError();
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
						.hideDelay(5000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the client?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.client).then(console.log('Client Deleted!'));
					},
					function() {
						console.log('Delete client cancelled');
					}
				);
			}

			function showError(ev) {
				$mdDialog.show(
					$mdDialog
						.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Error deleting the client')
						.textContent(
							'The client you are trying to delete has associated purchases. Please delete these purchases first'
						)
						.ariaLabel('Error Deleting Item')
						.ok('Ok')
						.targetEvent(ev)
				);
			}
		}
	}
})();
