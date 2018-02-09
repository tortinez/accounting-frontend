(function() {
	'use strict';

	import slideToggle from './slide-toggle.directive';
	import {} from './slideable.directive';

	// 'accordion' module, extracted from https://codepen.io/anayarojo/pen/JRmvAW
	angular
		.module('accordion', ['ngMaterial'])
		.directive('slideToggle', slideToggle)
		.directive('slideable', slideable);

	export default accordion;
})();
