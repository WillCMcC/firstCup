var app = angular.module('firstCup', ['ui.router']);
app.config(function($stateProvider, $httpProvider) {
  $stateProvider
  	.state('main', {
  	      url: "/links",
  	      templateUrl: "angular/links.html",
  	      controller: "LinksController"
  	    })

});

app.controller('LinksController', function($scope, $http){
	//get array of link objects from db
	// $scope.links should be an array of objects from linkmodels collection


	// making ajax request
	function updateLinks(){
		$http({
			method: 'GET',
			url: '/bro'
		}).then(function(resp){
			$scope.links = resp.data;
		})
	}
	updateLinks();
})

app.controller("LinkSubmitController", function($scope, $http){
	$scope.submission = {};
	$scope.submit = function(submission){
		console.log(submission)
		//save to db
		$http({
			method: 'POST',
			url: '/linkSubmit',
			data: {submission: submission},
			dataType: 'application/json'
		});
	}
})