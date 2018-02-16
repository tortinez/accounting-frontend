MainController.$inject = ['$scope', '$location', '$mdSidenav', 'Auth'];

function MainController($scope, $location, $mdSidenav, Auth) {
	var vm = this;

	// execute on init
	var init = function() {
		Auth.isAuthenticated().then(res => {
			vm.user = Auth.user;
			//redirect to the main page
			if (vm.user.isLogged) $location.path('/purchases');
		});
	};
	init();

	//functions passed out____________
	vm.showAccountInfo = showAccountInfo;
	vm.handleLogout = handleLogout;
	vm.userRole = userRole;
	//Related to the sidenav
	vm.toggleNavBar = buildToggler('left');
	vm.sidemenuSections = []; //array of the page sections

	//////////////////////////////////////////////////////////////////////
	// variables
	//sidemenu
	vm.sidemenuSections = [
		{
			header: 'Purchases',
			type: 'toogle',
			icon: 'assets/icons/shopping-cart.svg',
			pages: [
				{
					title: 'Purchases Table',
					type: 'link',
					linkTo: '#!/purchases'
				},
				{
					title: 'Status',
					type: 'link',
					linkTo: '#!/purchase-status'
				},
				{
					title: 'Type',
					type: 'link',
					linkTo: '#!/purchase-types'
				}
			]
		},
		{
			header: 'Projects',
			type: 'toogle',
			icon: 'assets/icons/folder.svg',
			pages: [
				{
					title: 'Projects Table',
					type: 'link',
					linkTo: '#!/projects'
				},
				{
					title: 'Type',
					type: 'link',
					linkTo: '#!/project-types'
				}
			]
		},
		{
			header: 'Clients',
			type: 'toogle',
			icon: 'assets/icons/clipboard-account.svg',
			pages: [
				{
					title: 'Clients Table',
					type: 'link',
					linkTo: '#!/clients'
				},
				{
					title: 'Type',
					type: 'link',
					linkTo: '#!/client-types'
				}
			]
		},
		{
			header: 'Supplier',
			type: 'link',
			linkTo: '#!/suppliers',
			icon: 'assets/icons/box.svg',
			pages: []
		},
		{
			header: 'Staff',
			type: 'link',
			linkTo: '#!/employees',
			icon: 'assets/icons/account-multiple.svg',
			pages: []
		},
		{
			header: 'Users',
			type: 'link',
			linkTo: '#!/users',
			icon: 'assets/icons/account-settings.svg',
			pages: []
		}
	];

	// functions
	//Related to the account info & logout menu
	function showAccountInfo() {
		$location.path('/account-info');
	}

	function handleLogout() {
		Auth.logout().then(res => $location.path('/login'));
	}

	function buildToggler(componentId) {
		return function() {
			$mdSidenav(componentId).toggle();
		};
	}

	function userRole() {
		var role = '';
		if (vm.user.isAdmin) role = 'ADMIN';
		else if (vm.user.isManager) role = 'MANAGER';
		else if (vm.user.isUser) role = 'USER';
		else role = '';

		return role;
	}
}

export default MainController;
