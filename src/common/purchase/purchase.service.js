'use strict';

Purchase.$inject = ['$resource'];

function Purchase($resource) {
	//$resource Objects________________________________________________________
	//not returned
	var resource = new $resource(
		'/api/purchase/:id',
		{ id: '@id' },
		{
			//Modify some HTTP methods
			query: {
				method: 'GET',
				params: { size: '50' }, //set the default page size to 50
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
		//Date initialization (min date hardcoded)
		date: { max: new Date(), min: new Date(1512302317224) },
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
			res.date = new Date(res.requestDate);
			return res;
		});
	}

	function query() {
		return resource.query();
	}

	function search(query) {
		//concatenate query
		var concatQuery = concatenateQuery(query, this.date);
		return resource.query({
			q: concatQuery,
			size: query.size,
			page: query.page
		});
	}

	//override save and remove $resource methods
	function save(purchase) {
		//convert binded data to id parameters
		purchase.requestingEmployeeId = purchase.requestingEmployee.id;
		purchase.requestingProjectId = purchase.requestingProject.id;
		purchase.chargingProjectId = purchase.chargingProject.id;
		purchase.stateId = purchase.state.id;
		purchase.typeId = purchase.type.id;
		purchase.supplierId = purchase.supplier.id;

		return purchase.id
			? resource.update(purchase).$promise
			: resource.save(purchase).$promise;
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
	function concatenateQuery(query, date) {
		var q = [];
		var vm = query;

		if (vm.dateMax !== date.max) q.push('requestDate<' + vm.dateMax.valueOf());
		if (vm.dateMin !== date.min) q.push('requestDate>' + vm.dateMin.valueOf());
		if (vm.amountMax !== null) q.push('amount<' + vm.amountMax);
		if (vm.amountMin !== null) q.push('amount>' + vm.amountMin);
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
