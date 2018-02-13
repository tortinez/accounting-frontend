'use strict';

import commonPurchase from './purchase/purchase.module';
import commonOtherResource from './other-resource/other-resource.module';
import commonUser from './user/user.module';
import commonAuth from './auth/auth.module';
import commonAutocompletefields from './autocomplete-fields/autocomplete-fields.module';

// Define the 'common' module
export default angular.module('common', [
	commonPurchase,
	commonOtherResource,
	commonUser,
	commonAuth,
	commonAutocompletefields
]);
