(function() {
	'use strict';
	// 'validate' module, extracted from https://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
	angular.module('accordion').directive('compareTo', function() {
		return {
			require: 'ngModel',
			scope: {
				otherModelValue: '=compareTo'
			},
			link: function(scope, element, attributes, ngModel) {
				ngModel.$validators.compareTo = function(modelValue) {
					return modelValue == scope.otherModelValue;
				};

				scope.$watch('otherModelValue', function() {
					ngModel.$validate();
				});
			}
		};
	});
})();
