(function() {
	'use strict';

	import AuthFormController from './auth-form.component';

	// Define the 'authForm' module
	angular
		.module('authForm', ['common.auth'])

		// Register the 'authForm' page along with its controller an template
		.component('authForm', {
			template: require('./auth-form.template.html'),
			controller: AuthFormController,
			controllerAs: 'vm'
		});

	export default authForm;
})();
