'use strict';

angular.
  module('common.invoice').
  factory('Invoice', ['$resource',
    function ($resource) {
      return $resource('http://localhost:1337/localhost:8080/api/purchase/:id/invoice', {id: '@id'}, {
          
        //Modify some HTTP methods
        save: {
          method: 'POST',
          transformRequest: FormDataObject,
          headers: { 'Content-Type': undefined, enctype: 'multipart/form-data'}  },     
      }),
      
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
