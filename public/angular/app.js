var app = angular.module('firstCup', ['ui.router']);

app.config(function($stateProvider, $httpProvider) {
  $stateProvider
  	.state('main', {
  	      url: "/",
  	      templateUrl: "angular/links.html",
  	      controller: "LinksController"
  	    })

});

app.controller('LinksController', function($scope, LinkDb){
	//get array of link objects from db
	// $scope.links should be an array of objects from linkmodels collection
	console.log('in linkscontroller');

	// making ajax request
	LinkDb.updateLinks().then(function(resp){
			$scope.links = resp.data;
		});
})

app.controller("LinkSubmitController", function($scope, LinkDb){
	$scope.submission = {};
	$scope.submit = function(submission){
		console.log(submission)
		//save to db
		LinkDb.postLink(submission);
	}
	$scope.toggleLinkSubmitView = function(){
		if( $scope.showLinkSubmitView === true ){
			$scope.showLinkSubmitView = false;
		} else {
			$scope.showLinkSubmitView = true;
		}
	}
})

app.factory('LinkDb', function($http){
	function updateLinks(){
		return $http({
			method: 'GET',
			url: '/bro'
		})
	};
	function postLink(submission){
		$http({
			method: 'POST',
			url: '/linkSubmit',
			data: {submission: submission},
			dataType: 'application/json'
		});
	}

	return {
		updateLinks: updateLinks,
		postLink: postLink
	}
})