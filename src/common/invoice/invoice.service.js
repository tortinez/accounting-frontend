'use strict';

angular.
  module('common.invoice').
  factory('Invoice', ['$resource',
    function($resource) {
      return $resource('http://localhost:1337/localhost:8080/api/purchase/:Id', {}, {
        
      query: {
          method: 'GET',
          params: {Id: ''},
          isArray: true,



          // The response is not a JSON array as expected by $resource but rather a
          // JSON object that contains the actual result with additional metadata.
          // It is therefore necessary to extract the payload before it can be
          // processed by the resource.
          transformResponse: function (content) {
            var wrappedResult = angular.fromJson(content);
            wrappedResult.content.$metadata = wrappedResult.metadata;
            return wrappedResult.content;
          },

          // The response ist not a JSON array as expected by $resource but rather a
          // JSON object that contains the actual result with additional metadata.
          // It is therefore necessary to extract the payload before it can be
          // processed by the resource.
          
          // The array returned by transformResponse is not passed directly to the
          // application logic, $resource only copies its contents. Due to this we
          // cannot directly access the added metadata. But fortunately for us
          // we can register a response interceptor in addition to transformResponse.
          // Inside the interceptor we can access the array of instances that is
          // returned by the query and the original data we parsed in
          // transformResponse, so that we can add the metadata.
          //
          // CAVEAT: This depends on the fact that the actual result is exposed as
          // response.resource which might change in future versions
          interceptor: {
            response: function (response) {
                response.resource.$metadata = response.content.$metadata;
                return response.resource;
            }
          }

          
        }
      });
    }
  ]);
