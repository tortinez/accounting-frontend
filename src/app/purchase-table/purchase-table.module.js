import PurchaseTableController from './purchase-table.component';

export default angular
.module('purchaseTable', [])
.component('purchaseTable', {
	template: require('./purchase-table.template.html'),
	controller: PurchaseTableController,
	controllerAs: 'vm'
});
