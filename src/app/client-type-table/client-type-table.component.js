(function() {
	'use strict';

	// Register the 'clientType' page along with its controller an template
	angular.module('clientTypeTable').component('clientTypeTable', {
		templateUrl: 'app/client-type-table/client-type-table.template.html',
		controller: ClientTypeTableController,
		controllerAs: 'vm'
	});

	ClientTypeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

	function ClientTypeTableController($mdDialog, Auth, OtherResource) {
		var vm = this;
		//get the items of the table
		vm.clientTypes = OtherResource.api('client-type').query();
		vm.clientType = [];
		vm.user = Auth.user;
		//functions
		vm.editItem = editItem;
		vm.addItem = addItem;
		//dialogs
		vm.showEdit = showEdit;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function editItem(clientType) {
			vm.clientType = clientType;
			vm.showEdit();
		}

		function addItem() {
			vm.clientType = { description: '' };
			vm.showEdit();
		}

		//Dialogs________________________________________________________________
		function showEdit(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/client-type-table/editDialog.template.html',
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
			$scope.editClientType = editClientType;
			$scope.showConfirm = showConfirm;
			//get the data from the service
			$scope.clientType = vm.clientType;

			////////////////////////////////////////////////////////////////////////
			//functions_____________________________________________________________
			function cancel() {
				$mdDialog.cancel();
			}

			function editClientType() {
				return OtherResource.save('client-type', $scope.clientType).then(
					function(value) {
						OtherResource.api('client-type')
							.query()
							.$promise.then(function(res) {
								vm.clientTypes = res;
								$mdDialog.hide();
							});
						showToast('Succesfully Saved!');
						console.log('ClientType saved: ID=', value.id);
					},
					function(err) {
						$mdDialog.hide();
						console.error(
							'The Client Type cannot be modified',
							err.status,
							err.statusText
						);
					}
				);
			}

			function removeItem(clientType) {
				OtherResource.remove('client-type', clientType).then(
					function() {
						$scope.showToast('Client Type Deleted!');
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
						.hideDelay(3000)
				);
			}

			function showConfirm(ev) {
				var confirm = $mdDialog
					.confirm()
					.title('Would you like to delete the client type?')
					.textContent('This action cannot be undone.')
					.targetEvent(ev)
					.ok('Delete')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(
					function() {
						removeItem($scope.clientType).then(
							console.log('Client Type Deleted!')
						);
					},
					function() {
						console.log('Delete client type cancelled');
					}
				);
			}

			function showError(ev) {
				$mdDialog.show(
					$mdDialog
						.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('Error deleting the client type')
						.textContent(
							'The client type you are trying to delete has associated purchases. Please delete these purchases first'
						)
						.ariaLabel('Error Deleting Item')
						.ok('Ok')
						.targetEvent(ev)
				);
			}
		}
	}
})();
