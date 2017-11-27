'use strict';

angular.
  module('common.purchase').
  factory('Purchase', ['$resource',
    function($resource) {
      return $resource('http://localhost:1337/localhost:8080/api/purchase/:id', {}, {
       
      //set the HTTP methods
      query: {
          method: 'GET',
          params: {s: '50'},
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
      search: function(params){
        Console.log('Searching the next query: ${JSON.stringify(query)}');
        return this.query({
          q: query.q,
          page: query.page,
          size: query.size
        })
      }





      
      });
    }
  ]);
