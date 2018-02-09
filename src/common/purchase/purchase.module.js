(function() {
	'use strict';

	import Purchase from './purchase.service';

	// Define the 'common.purchase' module
	angular
		.module('common.purchase', ['ngResource'])
		.factory('Purchase', Purchase);

	export default common.purchase;
})();
