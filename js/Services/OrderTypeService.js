angular.module( "CoffeeApp").service('OrderTypeService',function(RessourcesFactory){
    return {
        getAll : function(){
            return RessourcesFactory.ordersType().get().$promise;
        }
    };
});