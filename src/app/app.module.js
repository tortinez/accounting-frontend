(function() {
	'use strict';

	//vendor module imports
	import angular from 'angular';
	import ngAnimate from 'angular-animate';
	import ngMaterial from 'angular-material';
	import ngRoute from 'angular-route';
	import ngMessages from 'angular-messages';

	//3rd party module imports
	import angularMoment from 'moment';
	import mdColorMenu from 'md-color-menu';
	import mddatatable from 'angular-material-data-table';

	//custom module imports
	import accordion from '../common/directives/accordion/accordion.module';
	import validate from '../common/directives/validate/validate.module';
	import common from '../common/common.module';
	//(from here, app pages)
	import authForm from './auth-form/auth-form.module';
	import accountInfo from './account-info/account-info.module';
	import purchaseTable from './purchase-table/purchase-table.module.js';
	import purchaseForm from './purchase-form/purchase-form.module.js';
	import purchaseStatusTable from './purchase-status-table/purchase-status-table.module.js';
	import purchaseTypeTable from './purchase-type-table/purchase-type-table.module.js';
	import projectTable from './project-table/project-table.module.js';
	import projectTypeTable from './project-type-table/project-type-table.module.js';
	import clientTable from './client-table/client-table.module.js';
	import clientTypeTable from './client-type-table/client-type-table.module.js';
	import supplierTable from './supplier-table/supplier-table.module.js';
	import employeeTable from './employee-table/employee-table.module.js';
	import userTable from './user-table/user-table.module.js';

	//config imports
	import {
		routingConfig,
		themingConfig,
		dateConfig,
		onChangeRun
	} from './app.config';

	//css imports
	import '../bower_components/angular-material/angular-material.css';
	import '../bower_components/angular-material-data-table/dist/md-data-table.css';
	import '../bower_components/md-color-menu/md-color-menu.css';
	import '../style/accordion.css';
	import '../style/app.animations.css';
	import '../style/app.css';

	// Define the 'AccountingFEapp' module
	angular
		.module('AccountingFEapp', [
			//vendor modules
			'ngAnimate',
			'ngMaterial',
			'ngRoute',
			'ngMessages',

			//3rd Party modules
			'angularMoment',
			'mdColorMenu',
			'mddatatable',

			//custom modules
			'accordion',
			'validate',
			'common',
			'authForm',
			'accountInfo',
			'purchaseTable',
			'purchaseForm',
			'purchaseTypeTable',
			'purchaseStatusTable',
			'projectTable',
			'projectTypeTable',
			'clientTable',
			'clientTypeTable',
			'supplierTable',
			'employeeTable',
			'userTable'
		])
		.config(routingConfig)
		.config(themingConfig)
		.config(dateConfig)
		.run(onChangeRun);
})();
