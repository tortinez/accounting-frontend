'use strict';

import slideToggle from './slide-toggle.directive';
import slideable from './slideable.directive';

// 'accordion' module, extracted from https://codepen.io/anayarojo/pen/JRmvAW
export default angular
	.module('accordion', ['ngMaterial'])
	.directive('slideToggle', slideToggle)
	.directive('slideable', slideable);
