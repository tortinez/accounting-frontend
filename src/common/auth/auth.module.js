(function() {
	'use strict';

	import Auth from './auth.service';

	// Define the 'common.auth' module
	angular.module('common.auth', ['ngResource']).factory('Auth', Auth);

	export default Common.auth;
})();
