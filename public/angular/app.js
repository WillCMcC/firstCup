var app = angular.module('firstCup', ['ngRoute']);
app.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'angular/links.html',
      controller: 'LinksController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.controller('LinksController', function($scope, $http){
	//get array of link objects from db
	// $scope.links should be an array of objects from linkmodels collection


	// making ajax request
	$http({
		method: 'GET',
		url: '/bro'
	}).then(function(resp){
		debugger;
		$scope.links = resp.data;
	})


})