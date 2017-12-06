'use strict';

// Register the 'purchaseForm' page along with its controller an template
angular.
  module('purchaseForm').
  component('purchaseForm', {
    templateUrl: 'app/purchase-form/purchase-form.template.html',
    controller: ['$routeParams', '$location', 'Purchase', 'Project',
      //get the items of the table
      function PurchaseTableController($routeParams, $location, Purchase, Project) {
        this.purchase = Purchase.api.get({ id: $routeParams.id })

        //retrieve the list of projects, status, type and supplier
        this.projList = Project.api.query();

        ///////////////////////////////////////////////////////////////////////
        //functions_____________________________________________________________
        this.editPurchase = function () {
          return Purchase.save(this.purchase).then(
            $location.path("/purchases"), console.log("The purchase cannot be modified"));
        }
      }
    ]
  });
