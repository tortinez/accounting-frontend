(function() {
	'use strict';

	import OtherResource from './other-resource.service';

	// Define the 'common.otherResource' module
	angular
		.module('common.otherResource', ['ngResource'])
		.factory('OtherResource', OtherResource);

	export default common.otherResource;
})();
