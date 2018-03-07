checkAvailability.$inject = ['$q', 'Purchase'];

function checkAvailability($q, Purchase) {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: { selfId: '=' },
		link: function(scope, element, attr, ngModel) {
			var entity = attr.checkAvailability;

			ngModel.$asyncValidators.notAvailable = function(viewValue, modelValue) {
				var deferred = $q.defer();
				var q = scope.selfId
					? [entity + ':' + viewValue, 'id!' + scope.selfId]
					: [entity + ':' + viewValue];

				Purchase.search(q).then(res => {
					if (res.$metadata.totalElements == 1) {
						deferred.reject();
					} else {
						deferred.resolve();
					}
				});

				return deferred.promise;
			};
		}
	};
}

export default checkAvailability;
