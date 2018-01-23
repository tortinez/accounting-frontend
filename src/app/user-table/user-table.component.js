'use strict';

// Register the 'user' page along with its controller an template
angular.
module('userTable').
component('userTable', {
  templateUrl: 'app/user-table/user-table.template.html',
  controller: ['$mdDialog', 'User',
    function UserTableController($mdDialog, User) {
      var vm = this;
      //get the items of the table
      vm.users = User.api.query();
    }
  ]
});