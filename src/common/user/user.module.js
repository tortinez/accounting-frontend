import ngResource from 'npm/angular-resource';
import User from './user.service';

// Define the 'common.user' module
export default angular
	.module('common.user', ['ngResource'])
	.factory('User', User).name;
