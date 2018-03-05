Purchase.$inject = ['$resource'];

function Purchase($resource) {
	var date = {
		max: new Date(new Date().getFullYear() + 1, 0, 1),
		min: new Date(new Date().getFullYear(), 0, 1)
	};

	var params = {
		amountMax: null,
		amountMin: null,
		dateMax: date.max,
		dateMin: date.min,
		item: '',
		code: '',
		codeRP: '',
		codeLV: '',
		chProj: null,
		reqProj: null,
		status: null,
		supplier: null,
		type: null,
		employee: null,
		page: 0,
		size: 50
	};

	//$resource Objects________________________________________________________
	//not returned
	var resource = new $resource(
		'/api/purchase/:id',
		{ id: '@id' },
		{
			//Modify some HTTP methods
			query: {
				method: 'GET',
				params: {
					size: '50',
					q: [
						'requestDate<' + date.max.valueOf(),
						'requestDate>' + date.min.valueOf()
					]
				}, //set the default page size to 50 and request a date interval of 1 year
				isArray: true,

				//the data is populated with metadata, parse it
				transformResponse: function(content) {
					var wrappedResult = angular.fromJson(content);
					wrappedResult.content.$metadata = wrappedResult.metadata;
					return wrappedResult.content;
				},
				interceptor: {
					response: function(response) {
						response.resource.$metadata = response.data.$metadata;
						return response.resource;
					}
				}
			},
			update: { method: 'PUT' }
		}
	);

	var invoice = $resource(
		'/api/purchase/:id/invoice',
		{ id: '@id' },
		{
			//Create upload method
			upload: {
				method: 'PUT',
				transformRequest: FormDataObject,
				headers: {
					'Content-Type': undefined,
					enctype: 'multipart/form-data'
				}
			}
		}
	);

	//return statement_________________________________________________________
	return {
		//filtering & pagination params
		params: params,
		//Date initialization (values are hardcoded)
		date: date,
		//other functions to return
		get: get,
		query: query,
		search: search,
		save: save,
		remove: remove,
		uploadInvoice: uploadInvoice,
		deleteInvoice: deleteInvoice
	};

	///////////////////////////////////////////////////////////////////////////
	//Functions________________________________________________________________
	function get(itemId) {
		return resource.get({ id: itemId }).$promise.then(res => {
			res.requestDate = new Date(res.requestDate);
			return res;
		});
	}

	function query() {
		return resource.query();
	}

	function search(query) {
		var params = {};
		var concatQuery = [];

		Array.isArray(query)
			? (params = { q: query })
			: ((concatQuery = concatenateQuery(query)),
			  (params = { q: concatQuery, size: query.size, page: query.page }));

		return resource.query(params).$promise.then(res => {
			angular.forEach(res, function(item) {
				item.requestingProject.fullname =
					'(' +
					item.requestingProject.code +
					') ' +
					item.requestingProject.name;
				item.chargingProject.fullname =
					'(' + item.chargingProject.code + ') ' + item.chargingProject.name;
			});
			return res;
		});
	}

	//override save and remove $resource methods
	function save(purchase) {
		var item = {};

		//convert the Date to the desired format
		item.requestDate = purchase.requestDate.getTime();

		//clone the purchase item converting binded data to id parameters
		Object.keys(purchase).forEach(key => {
			if (
				typeof purchase[key] == 'object' &&
				key != 'invoicePath' &&
				key[0] != '$'
			) {
				item[key + 'Id'] = purchase[key].id;
			} else if (key[0] != '$') item[key] = purchase[key];
		});

		return item.id
			? resource.update(item).$promise
			: resource.save(item).$promise;
	}

	function remove(purchase) {
		return resource.remove({ id: purchase.id }).$promise;
	}

	//create the callable functions to upload and remove the invoice
	function uploadInvoice(itemId, blob) {
		return invoice.upload({ id: itemId }, blob).$promise;
	}

	function deleteInvoice(itemId) {
		return invoice.delete({ id: itemId }).$promise;
	}

	//not returned functions
	function concatenateQuery(query) {
		var q = [];
		var vm = query;

		if (vm.dateMax !== null) q.push('requestDate<' + vm.dateMax.valueOf());
		if (vm.dateMin !== null) q.push('requestDate>' + vm.dateMin.valueOf());
		if (vm.amountMax !== null) q.push('amount<' + vm.amountMax);
		if (vm.amountMin !== null) q.push('amount>' + vm.amountMin);
		if (vm.item !== '') q.push('item~' + vm.item);
		if (vm.code !== '') q.push('code~' + vm.code);
		if (vm.codeRP !== '') q.push('codeRP~' + vm.codeRP);
		if (vm.codeLV !== '') q.push('codeLV~' + vm.codeLV);
		if (vm.chProj !== null) q.push('chargingProject.name~' + vm.chProj);
		if (vm.reqProj !== null) q.push('requestingProject.name~' + vm.reqProj);
		if (vm.status !== null) q.push('state.name~' + vm.status);
		if (vm.supplier !== null) q.push('supplier.name~' + vm.supplier);
		if (vm.type !== null) q.push('type.name~' + vm.type);
		if (vm.employee != null)
			q.push('requestingEmployee.fullname~' + vm.employee);

		return q;
	}

	function FormDataObject(data) {
		var fd = new FormData();
		fd.append('file', data);
		return fd;
	}
}

export default Purchase;
