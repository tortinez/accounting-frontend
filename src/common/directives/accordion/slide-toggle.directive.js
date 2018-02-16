// 'accordion' module, extracted from https://codepen.io/anayarojo/pen/JRmvAW

function slideToggle() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var target = document.querySelector(attrs.slideToggle);
			attrs.expanded = false;
			element.bind('click', function() {
				//optional
				if (element.hasClass('opened')) {
					element.removeClass('opened');
				} else {
					element.addClass('opened');
				}
				//

				var content = target.querySelector('.slideable_content');
				if (!attrs.expanded) {
					content.style.border = '1px solid rgba(0,0,0,0)';
					var y = content.clientHeight;
					content.style.border = 0;
					target.style.height = y + 'px';
				} else {
					target.style.height = '0px';
				}
				attrs.expanded = !attrs.expanded;
			});
		}
	};
}

export default slideToggle;
