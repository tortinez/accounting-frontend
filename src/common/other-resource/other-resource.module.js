import ngResource from 'npm/angular-resource';
import OtherResource from './other-resource.service';

// Define the 'common.otherResource' module
export default angular
	.module('common.otherResource', ['ngResource'])
	.factory('OtherResource', OtherResource).name;
