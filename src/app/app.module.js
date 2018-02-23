//vendor module imports
import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import ngRoute from 'angular-route';
import ngMessages from 'angular-messages';
import angularMoment from 'angular-moment';

//3rd party module imports
import 'npm/md-color-menu/md-color-menu';
import 'npm/angular-material-data-table';

//custom module imports
import accordion from '../common/directives/accordion/accordion.module';
import validate from '../common/directives/validate/validate.module';
import common from '../common/common.module';
//(from here, app pages)
import MainController from './main/main.controller';
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

//directive import
import icon from '../common/directives/icon/icon.directive';

//css imports
import 'npm/angular-material/angular-material.css';
import 'npm/angular-material-data-table/dist/md-data-table.css';
import 'npm/md-color-menu/md-color-menu.css';
import '../style/accordion.css';
import '../style/app.animations.css';
import '../style/app.css';

//SVG imports (for svg-sprite-loader)
import accountKeyIcon from '../assets/icons/account-key.svg';
import accountMultIcon from '../assets/icons/account-multiple.svg';
import accountSettIcon from '../assets/icons/account-settings.svg';
import accountIcon from '../assets/icons/account.svg';
import alertCircleIcon from '../assets/icons/alert-circle.svg';
import attachIcon from '../assets/icons/attach.svg';
import boxIcon from '../assets/icons/box.svg';
import clipboardAccIcon from '../assets/icons/clipboard-account.svg';
import closeIcon from '../assets/icons/close.svg';
import deleteIcon from '../assets/icons/delete.svg';
import downArrowIcon from '../assets/icons/downArrow.svg';
import editIcon from '../assets/icons/edit.svg';
import filePdfIcon from '../assets/icons/file-pdf.svg';
import folderIcon from '../assets/icons/folder.svg';
import logoutIcon from '../assets/icons/logout.svg';
import mciaLogoIcon from '../assets/icons/MCIA_logo.svg';
import navNextIcon from '../assets/icons/navNext.svg';
import navPrevIcon from '../assets/icons/navPrev.svg';
import paletteIcon from '../assets/icons/palette.svg';
import settingsIcon from '../assets/icons/settings.svg';
import shoppingCartIcon from '../assets/icons/shopping-cart.svg';

// Define the 'AccountingFEapp' module
angular
	.module('AccountingFEapp', [
		//vendor modules
		'ngAnimate',
		'ngMaterial',
		'ngRoute',
		'ngMessages',
		'angularMoment',

		//3rd Party modules
		'mdColorMenu',
		'md.data.table',

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
	.run(onChangeRun)

	.controller('MainController', MainController)

	.directive('icon', icon);
