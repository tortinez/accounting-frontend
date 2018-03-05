function icon() {
	return {
		restrict: 'EA',
		replace: false,
		scope: {
			svgIcon: '@',
		},
		template:
			'<svg width=100% height=100% aria-label="{{svgIcon}}-icon"><use xlink:href="{{svgIcon}}" />'
	};
}

export default icon;
