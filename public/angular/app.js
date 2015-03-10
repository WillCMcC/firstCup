var app = angular.module('firstCup', ['ui.router']);

app.config(function($stateProvider, $httpProvider, $urlRouterProvider) {
	// $scope.links = [];
	$urlRouterProvider.otherwise("/home");
	$stateProvider
		.state('home', {
		      url: "/home",
		      views: {
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
	$scope.deleteLink = function(link){
		// delete link from database
		LinkDb.deleteLink(link);
	}
})

app.controller("NavController", function($scope, LinkDb, $state){
	$scope.submission = {};
	$scope.submit = function(submission){
		console.log(submission)
		//save to db
		LinkDb.postLink(submission);
		$state.reload();
	}
	$scope.refresh = function(submission){
		console.log('refresh')
		$state.reload();
	}
	$('.modal-trigger').leanModal();
})

app.factory('LinkDb', function($http){
	function updateLinks(){
		return $http({
			method: 'GET',
			url: '/bro'
		})
	};
	function postLink(submission){
		return $http({
			method: 'POST',
			url: '/linkSubmit',
			data: {submission: submission},
			dataType: 'application/json'
		});
	}
	function deleteLink(link){
		return $http({
			method: 'DELETE',
			url: '/deleteLink',
			data: {link: link},
			dataType: 'application/json'
		})
	}

	return {
		updateLinks: updateLinks,
		postLink: postLink,
		deleteLink: deleteLink
	}
})

$(document).on('ready', function(){
	console.log('ready block')
	$(".dropdown-button").dropdown();
})