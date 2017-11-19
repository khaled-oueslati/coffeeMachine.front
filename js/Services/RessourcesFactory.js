CoffeeApp.factory('RessourcesFactory',function($http,$resource){
    var uri ='http://localhost:17057/api/';
    return{
        ordersType : function()
        {
            return $resource(uri+'orderTypes');
        },
        OrdersByUserId : function(){
            return $resource(uri+'orders/user/:userId',null,{
                get: {cancellable: true}
            });
        },
        Order : function(){
            return $resource(uri+'orders/:id', null,
            {
                'save' : {method : 'POST'},
                'update': { method:'PUT' }
            });
        },
        UpdateOrder : function(){
            return $resource(uri+'orders/:id')
        }

    }
});