'use strict';

import Purchase from './purchase.service';

// Define the 'common.purchase' module
export default angular
	.module('common.purchase', ['ngResource'])
	.factory('Purchase', Purchase);
