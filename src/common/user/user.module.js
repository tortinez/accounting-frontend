(function() {
	'use strict';

	import User from './user.service';

	// Define the 'common.user' module
	angular.module('common.user', ['ngResource']).factory('User', User);

	export default common.user;
})();
