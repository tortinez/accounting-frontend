(function() {
	'use strict';

	// Define the 'AccountingFEapp' module
	angular
		.module('AccountingFEapp', [
			'ngAnimate',
			'ngMaterial',
			'ngRoute',
			'ngMessages',
			'angularMoment',
			'accordion',
			'validate',
			'md.data.table',
			'common',
			'authForm',
			'accountInfo',
			'purchaseTable',
			'purchaseForm',
			'purchaseTypeTable',
			'purchaseStatusTable',
			'projectTable',
			'projectTypeTable',
			'clientTable',
			'clientTypeTable',
			'supplierTable',
			'employeeTable',
			'userTable'
		])
		.controller('mainCtrl', function($scope, $location, Auth, $mdSidenav) {
			// execute on init
			var init = function() {
				Auth.isAuthenticated().then(function() {
					$scope.user = Auth.user;
					if ($scope.user.isLogged) $location.path('/purchases');
				});
			};
			init();

			//Related to the account info & logout menu
			$scope.showAccountInfo = function() {
				$location.path('/account-info');
			};

			$scope.handleLogout = function() {
				console.error('Not implemented');
			};

			//Related to the sidenav
			$scope.toggleNavBar = buildToggler('left');

			function buildToggler(componentId) {
				return function() {
					$mdSidenav(componentId).toggle();
				};
			}
			//sidemenu
			$scope.sidemenuSections = [
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
					header: 'Employees',
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
		});
})();
