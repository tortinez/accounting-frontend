'use strict';

angular.
  module('common.purchase').
  factory('Purchase', ['$resource',
    function($resource) {
      return $resource('http://localhost:1337/localhost:8080/api/purchase?size=:s/:Id', {}, {
        
      findAll: {
          method: 'GET',
          params: {Id: '',
                   s: '50'},
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

          
        }
      });
    }
  ]);
