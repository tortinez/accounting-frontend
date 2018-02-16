import AuthFormController from './auth-form.component';

// Define the 'authForm' module
export default angular
.module('authForm', [])
.component('authForm', {
	template: require('./auth-form.template.html'),
	controller: AuthFormController,
	controllerAs: 'vm'
});
