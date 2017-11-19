angular.module( "CoffeeApp").controller('ModalOrderCtrl',function($uibModalInstance,data){

  this.order = data.order;
  
    this.ok = function () {
        $uibModalInstance.close();
      };
    
    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
});