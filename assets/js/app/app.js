var RiskCityApp = angular.module('RiskCityApp',['ngRoute','ngResource']);

RiskCityApp.run(['$rootScope','AlertService','UserService',function($rootScope,AlertService,UserService) {


   UserService.check(function(err,data){

  })

}]);

RiskCityApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/',{
    templateUrl:'/views/home.html',
    controller:'HomeCtrl'
  })
  .when('/about',{
    templateUrl:'/views/about.html',
    controller:'StaticCtrl'
  })
  // .when('/post/:id',{
  //   templateUrl:'/views/post/show.html',
  //   controller:'PostShowCtrl'
  // })
  .otherwise({
    templateUrl:'/views/404.html'
  })

}]);
