var app = angular.module('firstCup', [
	'ui.router',
	'firstCup.links',
	'firstCup.nav'
	]);

app.config(function($stateProvider, $httpProvider, $urlRouterProvider) {
	// $scope.links = [];
	$stateProvider
		.state('home', {
			url: "/home",
			views: {
				"linksView": { templateUrl: "angular/views/linksView.html" },
				"navbar": { templateUrl: "angular/views/navBar.html" }
			}
		})
		// .state('signup', {
		// 	url: "/signup",
		// 	views: {
		// 		"signupView": { templateUrl: "angular/views/signupView.html"}
		// 	}
		// })
	$urlRouterProvider.otherwise("/home");
});

app.factory('User', function($http){
	function getUser(){
		return $http({
			method: "GET",
			url: '/user',
			dataType: 'application/json',
		})
	}

	return {
		getUser: getUser,
	}
});

app.factory('Links', function($http, $window){
	function updateLinks(){
		return $http({
			method: 'GET',
			url: '/bro'
		})
	};
	function postLink(submission){
		console.log(submission);
		return $http({
			method: 'POST',
			url: '/linkSubmit',
			data: {submission: submission},
			dataType: 'application/json'
		});
	}
	function deleteLink(link){
		console.log(link)
		return $http({
			method: 'DELETE',
			url: '/deleteLink?_id='+link._id
		})
	}
	return {
		updateLinks: updateLinks,
		postLink: postLink,
		deleteLink: deleteLink,
	}
});

// app.controller('LinksController', function($scope, Links, $state, $window){
// 	//get array of link objects from db
// 	// $scope.links should be an array of objects from linkmodels collection
// 	Links.updateLinks().then(function(resp){
// 			$scope.links = resp.data;
// 		});
// 	$scope.deleteLink = function(link){
// 		// delete link from database
// 		console.log(link)
// 		Links.deleteLink(link);
// 		$state.reload();
// 	}
// })

// app.controller("NavController", function($scope, User, Links, $state, $window){
// 	$scope.submission = {};
// 	if (!$window.signedIn){
// 		$window.signedIn = false;
// 	};
// 	if($window.signedIn)
// 	User.getUser().then(function(resp){
// 		console.log(resp);
// 		if (resp.data.local){
// 			$scope.user = resp.data.local;
// 			$window.signedIn = true;
// 		};
// 	});
// 	$scope.submit = function(submission){
// 		Links.postLink(submission);
// 		$state.reload();
// 	}
// 	$scope.refresh = function(){
// 		$state.reload();
// 	}
// 	// $('.modal-trigger').leanModal();
// })


$(document).on('ready', function(){
	console.log('ready block')
	$(".dropdown-button").dropdown();

})
