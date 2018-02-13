'use strict';

import Auth from './auth.service';

// Define the 'common.auth' module
export default angular
	.module('common.auth', ['ngResource'])
	.factory('Auth', Auth);
