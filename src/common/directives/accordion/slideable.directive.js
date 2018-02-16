// 'accordion' module, extracted from https://codepen.io/anayarojo/pen/JRmvAW

function slideable() {
	return {
		restrict: 'C',
		compile: function(element, attr) {
			// wrap tag
			var contents = element.html();
			element.html(
				'<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' +
					contents +
					'</div>'
			);

			return function postLink(scope, element, attrs) {
				// default properties
				attrs.duration = !attrs.duration ? '0.5s' : attrs.duration;
				attrs.easing = !attrs.easing ? 'ease-in-out' : attrs.easing;
				element.bind('click', function($event) {
					$event.stopPropagation();
				});
				element.css({
					overflow: 'hidden',
					height: '0px',
					transitionProperty: 'height',
					transitionDuration: attrs.duration,
					transitionTimingFunction: attrs.easing
				});
			};
		}
	};
}

export default slideable;
