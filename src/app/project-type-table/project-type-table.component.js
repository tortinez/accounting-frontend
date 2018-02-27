ProjectTypeTableController.$inject = ['$mdDialog', 'Auth', 'OtherResource'];

function ProjectTypeTableController($mdDialog, Auth, OtherResource) {
	var vm = this;
	//get the items of the table
	vm.projectTypes = OtherResource.query('project-type');
	vm.user = Auth.user;
	//variables
	vm.projectType = {};
	vm.title = '';
	//functions
	vm.editItem = editItem;
	vm.addItem = addItem;

	////////////////////////////////////////////////////////////////////////
	//functions_____________________________________________________________
	function editItem(projectType) {
		vm.projectType = projectType;
		vm.title = 'Edit Project Type';
		showFormDialog();
	}

	function addItem() {
		vm.projectType = {};
		vm.title = 'Add Project Type';
		showFormDialog();
	}

	//Dialogs________________________________________________________________
	function showFormDialog(ev) {
		$mdDialog.show({
			controller: FormDialogController,
			controllerAs: 'vm',
			template: require('./form-dialog.template.html'),
			targetEvent: ev,
			parent: angular.element(document.body),
			clickOutsideToClose: false,
			locals: { title: vm.title, itemId: vm.projectType.id }
		});
	}
	FormDialogController.$inject = ['$mdDialog', '$mdToast', 'OtherResource', 'title', 'itemId'];
	function FormDialogController(
		$mdDialog,
		$mdToast,
		OtherResource,
		title,
		itemId
	) {
		var vm2 = this;
		//functions callable from the html
		vm2.cancel = cancel;
		vm2.editProjectType = editProjectType;
		vm2.showConfirmDialog = showConfirmDialog;
		//get the data from the service
		itemId
			? OtherResource.get('project-type', itemId).$promise.then(
					res => (vm2.projectType = res)
				)
			: (vm2.projectType = {});

		vm2.title = title;

		////////////////////////////////////////////////////////////////////////
		//functions_____________________________________________________________
		function cancel() {
			$mdDialog.cancel();
		}

		function editProjectType() {
			return OtherResource.save('project-type', vm2.projectType).then(
				value => {
					OtherResource.query('project-type').$promise.then(res => {
						vm.projectTypes = res;
						$mdDialog.hide();
					});
					showToast('Succesfully Saved!');
					console.log('ProjectType saved: ID=', value.id);
				},
				err => {
					$mdDialog.hide();
					showToast('An error occured');
					console.error(
						'The Project Type cannot be modified',
						err.status,
						err.statusText
					);
				}
			);
		}

		function removeItem(projectType) {
			OtherResource.remove('project-type', projectType).then(
				() => {
					OtherResource.query('project-type').$promise.then(
						res => (vm.projectTypes = res)
					);
					showToast('Project Type Deleted!');
					console.log('Succesfully removed');
				},
				err => {
					if (err.status == 409) showErrorDialog();
					console.error(
						'The item could not be deleted:',
						err.status,
						err.statusText
					);
				}
			);
			$mdDialog.hide();
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
				.title('Would you like to delete the project type?')
				.textContent('This action cannot be undone.')
				.targetEvent(ev)
				.ok('Delete')
				.cancel('Cancel');

			$mdDialog
				.show(confirm)
				.then(
					() =>
						removeItem(vm2.projectType).then(
							console.log('Project Type Deleted!')
						),
					() => console.log('Delete project type cancelled')
				);
		}

		function showErrorDialog(ev) {
			$mdDialog.show(
				$mdDialog
					.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Error deleting the project type')
					.textContent(
						'The project type you are trying to delete has associated purchases. Please delete these purchases first'
					)
					.ariaLabel('Error Deleting Item')
					.ok('Ok')
					.targetEvent(ev)
			);
		}
	}
}

export default ProjectTypeTableController;
