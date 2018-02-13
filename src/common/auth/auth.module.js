'use strict';

import ngResource from 'npm/angular-resource';
import Auth from './auth.service';

// Define the 'common.auth' module
export default angular
	.module('common.auth', ['ngResource'])
	.factory('Auth', Auth)
	.name;
