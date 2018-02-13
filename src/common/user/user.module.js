'use strict';

import User from './user.service';

// Define the 'common.user' module
export default angular
	.module('common.user', ['ngResource'])
	.factory('User', User);
