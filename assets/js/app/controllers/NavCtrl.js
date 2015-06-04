RiskCityApp.controller('NavCtrl',['$scope','$rootScope','UserService',function($scope,$rootScope,UserService){

  $scope.UserService = UserService

   $scope.showLogin = function(){
    $('#modal1').openModal({
      templateUrl:'views/auth/loginModal.html',
      controller:'AuthLoginModalCtrl'
    });

    // $modal.open({
    //   templateUrl:'views/auth/loginModal.html',
    //   controller:'AuthLoginModalCtrl'
    // });
  };

  $scope.logout = function(){
    UserService.logout(function(err,data){
      // doing nothing...
    });
  }

  $scope.$watchCollection('UserService',function(){
    $scope.currentUser = UserService.currentUser;

  });

  $scope.login = function() {

    UserService.login($scope.email,$scope.password, function(err,data){
      if(err){
        console.log(data);
        alert('something awful happened.');
      } else if (data && data.result){
        $('#modal1').closeModal();
        console.log("logged in", UserService.currentUser.name)
      } else {
        console.log(data);
        alert('unable to log in');
      }
    });
  }

}]);
