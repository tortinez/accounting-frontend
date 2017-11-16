'use strict';

// Register the 'invoiceTable' page along with its controller an template
angular.
  module('invoiceTable').
  component('invoiceTable', {
    templateUrl: 'app/invoice-table/invoice-table.template.html',
    controller: ['Invoice',
      function PhoneListController(Invoice) {
        this.invoices = Invoice.query();
        this.orderProp = 'date';
      }
    ]
  });
