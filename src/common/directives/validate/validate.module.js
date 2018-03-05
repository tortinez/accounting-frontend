import commonPurchase from '../../purchase/purchase.module';
import compareTo from './compare-to.directive';
import checkAvailability from './check-availability.directive';

// 'compareTo' directive extracted from https://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
export default angular
	.module('validate', ['ngMessages', commonPurchase])
	.directive('compareTo', compareTo)
	.directive('checkAvailability', checkAvailability);
