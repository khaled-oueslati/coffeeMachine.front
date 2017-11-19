var CoffeeApp = angular.module( "CoffeeApp", ['ngResource','ngAnimate', 'ngSanitize', 'ui.bootstrap'] );

CoffeeApp.controller('CoffeeCtrl', function ($scope,$uibModal, $log, $document,$timeout, OrderTypeService, OrderService) {

    $scope.order = {
      OrderTypeId : 1,
      SelfMug: false,   
      SugarQuantity: 0,
      Type : {
        Id:1,
        Label: "Coffee"
      }   
    };
    $scope.loading = true;
    $scope.alerts=[];
    $scope.addAlert = function(msg,type) {
      $scope.alerts.push({msg: msg,type:type});

      $timeout(function(){
        if($scope.alerts.length>0){
          $scope.closeAlert($scope.alerts.length-1);
        }
      },2000);
    };
  
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    OrderTypeService.getAll().then(function(data){
      if(data.status == 0){
          $scope.orderTypes = data.Response;
          $scope.loading = false;
      }else{
        $scope.addAlert("Something is wrong","danger");      
      }
    }, function (error) {
      $scope.addAlert("Server not responding","danger");
      });

    $scope.setSugar = function (i){
      $scope.order.SugarQuantity = i;
    };

    $scope.searchByUserId = function (){
      // to reduce requests to the server we can do search only if userID.length >3 (we are not going to do it now ;) )
      if ($scope.orderTypeRequest) {
        $scope.orderTypeRequest.$cancelRequest();
      }
      if($scope.order.UserId){
        $scope.orderTypeRequest =OrderService.getByUserId($scope.order.UserId);
        $scope.orderTypeRequest.$promise.then(function(data){
          if(data && data.status == 0){
            $scope.order = data.Response;
            $scope.order.newUser = false;  
            $scope.addAlert("last order for User : "+$scope.order.UserId ,"warning");         
          }
        },function(error){
          if(error.status == 404){
            $scope.order.newUser = true;
          }else{
            $scope.addAlert("Server not responding","danger");      
          }
        });
      }
    }
    $scope.submit = function(){
        // alert('kk');
        $scope.open();
    };
    $scope.$watch('order.OrderTypeId',function(){
      if($scope.orderTypes){
        $scope.order.Type = $scope.orderTypes.find(function(type){
          return type.Id == $scope.order.OrderTypeId;
        })
      }
    });
    $scope.open = function (size, parentSelector) {
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'modalConfirm.html',
        controller: 'ModalOrderCtrl',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parentElem,
        resolve: {
          data: function () {
            return {
              order : $scope.order
            };
          }
        }
      });
  
      modalInstance.result.then(function (selectedItem) {
        if($scope.order.Id && $scope.order.UserId){
          OrderService.updateOrder($scope.order).then(function(data){
            manageAlertsAfterUpdate(data);
            $scope.order = data.Response;  
          },function(error){
            $scope.addAlert("Server error" ,"danger");                                       
          });
        }else{
          OrderService.addOrder($scope.order).then(function(data){
            manageAlertsAfterUpdate(data);
            $scope.order = data.Response;        
          },function(error){
              $scope.addAlert("Server error" ,"danger");                           
          });          
        }
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    
    manageAlertsAfterUpdate=function(data){
      if(data.status==0){
        if(!$scope.order.UserId)
        {
          $scope.addAlert("please inquire a user badge to save your order" ,"warning"); 
        }
        $scope.addAlert("Please wait for the machine to make your order" ,"success"); 
      }else{
        $scope.addAlert("please verify your order, something went wrong with it" ,"danger");               
      }
    }
});
    
CoffeeApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});