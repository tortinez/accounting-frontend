(function() {
	'use strict';

	import compareTo from './compare-to.directive';

	// 'validate' module, extracted from https://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
	angular.module('validate', ['ngMessages']).directive('compareTo', compareTo);

	export default validate;
})();
