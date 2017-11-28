'use strict';

angular.
  module('common.purchase').
  factory('Purchase', ['$resource',
    function($resource) {
      return $resource('http://localhost:1337/localhost:8080/api/purchase/:id', {}, {
       
      //set the HTTP methods GET & PUT
      query: {
          method: 'GET',
          params: {size: '50'},
          isArray: true,

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
      
      update: {
        method: 'PUT',
      },

      //set the different functions for the PurchaseTable
      getSearch: function(params){
        query = params || {}
        //convert the parameters into a valid query
        //query.q = "amount>" + params.amountGreat + "amount<" + params.amountLess 
        //    + "type.name=" + params.type + "supplier.name=" + params.supplier;
        //query.size = params.size;
        //query.page = params.page;
       return this.query({
          q: query.q,
          page: query.page,
          size: query.size
        })
      }





      
      });
    }
  ]);
