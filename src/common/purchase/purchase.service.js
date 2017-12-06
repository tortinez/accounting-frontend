'use strict';

angular.
  module('common.purchase').
  factory('Purchase', ['$resource',
    function ($resource) {
      return {
        api: $resource('http://localhost:1337/localhost:8080/api/purchase/:id', {id: '@id'}, {
          
          //Modify some HTTP methods
          query: {
            method: 'GET',
            params: {size: '50'}, //set the default page size to 50
            isArray: true,
    
            //the data is populated with metadata, parse it
            transformResponse: function (content) {
              var wrappedResult = angular.fromJson(content);
              wrappedResult.content.$metadata = wrappedResult.metadata;
              return wrappedResult.content;
            },
            interceptor: {
              response: function (response) {
                  response.resource.$metadata = response.content.$metadata;
                  return response.resource;
              }
            }          
          },
          update: { method: 'PUT'},     
        }),
        
        search: search,
        save: save,
        remove: remove
      };

      //////////////////////////////////////////////////////////////////////

      //Functions________________________________________________________________
      function search(query){
        //concatenate query
        var concatQuery = concatenateQuery(query)
        return this.api.query({q: concatQuery, size: query.size, page:query.page});
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

        return purchase.id ? this.api.update(purchase).$promise : this.api.save(purchase).$promise;
      }

      function remove(purchase) {
        return this.api.remove({id: purchase.id}).$promise;
      }

      function concatenateQuery(query) {
        var q =[];
        var vm = query;
        
        if (vm.amountTop !== 0)    q.push('amount<' + vm.amountTop);
        if (vm.amountBot !== 0)    q.push('amount>' + vm.amountBot);
        if (vm.item !== '')        q.push('item~' + vm.item);
        if (vm.chProj !== 'All')   q.push('chargingProject.name~' + vm.chProj);
        if (vm.reqProj !== 'All')  q.push('requestingProject.name~' + vm.reqProj);
        if (vm.status !== 'All')   q.push('state.name~' + vm.status);
        if (vm.supplier !== 'All') q.push('supplier.name~' + vm.supplier);
        if (vm.type !== 'All')     q.push('type.name~' + vm.type);
          
        return q
      }       
    }
  ]);
