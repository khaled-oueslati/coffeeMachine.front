angular.module( "CoffeeApp").service('OrderService',function(RessourcesFactory){
    return {
        getByUserId : function(userId){
            return RessourcesFactory.OrdersByUserId().get({userId:userId});
        },
        addOrder : function(item){
            var order = RessourcesFactory.Order();
            var orderToAdd = {
                SugarQuantity: item.SugarQuantity,
                SelfMug: item.SelfMug,
                OrderTypeId: item.OrderTypeId
            };
            if(item.UserId){
                orderToAdd.UserId = item.UserId;                
            }
            return order.save(orderToAdd).$promise;
        },
        updateOrder : function(order){
            return RessourcesFactory.Order().update({id:order.Id},{
                    Id:order.Id,
                    UserId: order.UserId,
                    SugarQuantity: order.SugarQuantity,
                    SelfMug: order.SelfMug,
                    OrderTypeId: order.OrderTypeId
                }).$promise;
        }
    };
});