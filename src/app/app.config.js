import moment from 'moment';

// App Routing
routingConfig.$inject = ['$locationProvider', '$routeProvider'];

function routingConfig($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
		.when('/login', {
			template: '<auth-form></auth-form>',
			secure: false
		})
		.when('/purchases', {
			template: '<purchase-table></purchase-table>',
			secure: true
		})
		.when('/purchaseform/:id', {
			template: '<purchase-form></purchase-form>',
			secure: true
		})
		.when('/purchaseform', {
			template: '<purchase-form></purchase-form>',
			secure: true
		})
		.when('/purchase-types', {
			template: '<purchase-type-table></purchase-type-table>',
			secure: true
		})
		.when('/purchase-status', {
			template: '<purchase-status-table></purchase-status-table>',
			secure: true
		})
		.when('/projects', {
			template: '<project-table></project-table>',
			secure: true
		})
		.when('/project-types', {
			template: '<project-type-table></project-type-table>',
			secure: true
		})
		.when('/clients', {
			template: '<client-table></client-table>',
			secure: true
		})
		.when('/client-types', {
			template: '<client-type-table></client-type-table>',
			secure: true
		})
		.when('/suppliers', {
			template: '<supplier-table></supplier-table>',
			secure: true
		})
		.when('/employees', {
			template: '<employee-table></employee-table>',
			secure: true
		})
		.when('/users', {
			template: '<user-table></user-table>',
			secure: true
		})
		.when('/account-info', {
			template: '<account-info></account-info>',
			secure: true
		})
		.otherwise('/login');
}

// App Theming
themingConfig.$inject = ['$mdThemingProvider'];

function themingConfig($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('blue', {
			default: '700'
		})
		.accentPalette('pink');

	$mdThemingProvider
		.theme('dark', 'default')
		.primaryPalette('blue', {
			default: 'A200'
		})
		.dark();
}

// Change date format for datepickers
dateConfig.$inject = ['$mdDateLocaleProvider', 'moment'];

function dateConfig($mdDateLocaleProvider, moment) {
	$mdDateLocaleProvider.formatDate = function(date) {
		return date == null ? null : moment(date).format('DD/MM/YYYY');
	};

	$mdDateLocaleProvider.parseDate = function(dateString) {
		var m = moment(dateString, 'DD/MM/YYYY', true);
		return m.isValid() ? m.toDate() : new Date(NaN);
	};
}

// Authentication redirectioning
onChangeRun.$inject = ['$rootScope', '$location', 'Auth'];

function onChangeRun($rootScope, $location, Auth) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (next && next.$$route && next.$$route.secure) {
			if (!Auth.user.isLogged) {
				$rootScope.$evalAsync(function() {
					Auth.isAuthenticated().then(res => {
						!res
							? (console.log('User not Authenticated!'), $location.path('/'))
							: (console.log('Redirecting...'), $location.path('/'));
					});
				});
				event.preventDefault();
			}
		} else if (next && next.$$route && next.$$route.originalPath == '/login') {
			if (Auth.user.isLogged) {
				console.log('User is already Authenticated!');
				$rootScope.$evalAsync(function() {
					$location.path('/purchases');
				});
				event.preventDefault();
			}
		}
	});
}

export { routingConfig, themingConfig, dateConfig, onChangeRun };
