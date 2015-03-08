var app = angular.module('firstCup', ['ui.router']);

app.config(function($stateProvider, $httpProvider, $urlRouterProvider) {
	// $scope.links = [];
	$urlRouterProvider.otherwise("/home");
	$stateProvider
		.state('home', {
		      url: "/home",
		      views: {
		        "linkSubmitView": { templateUrl: "angular/views/linkSubmitView.html" },
		        "linksView": { templateUrl: "angular/views/linksView.html" },
		        "navbar": { templateUrl: "angular/views/navBar.html" }
		      }
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

app.controller("LinkSubmitController", function($scope, LinkDb, $state){
	$scope.submission = {};
	$scope.submit = function(submission){
		console.log(submission)
		//save to db
		LinkDb.postLink(submission);
		$state.reload();
	}
	$scope.toggleLinkSubmitView = function(){
		console.log($scope.links)
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