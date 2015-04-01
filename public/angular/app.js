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
		.state('signup', {
			url: "/signup",
			views: {
				"signupView": { templateUrl: "angular/views/signupView.html"}
			}
		})
});

app.controller('LinksController', function($scope, Mongo, $state, $window){
	//get array of link objects from db
	// $scope.links should be an array of objects from linkmodels collection
	console.log('in linkscontroller');
	// making ajax request
	Mongo.updateLinks().then(function(resp){
			$scope.links = resp.data;
		});
	$scope.deleteLink = function(link){
		// delete link from database
		console.log(link)
		Mongo.deleteLink(link);
		$state.reload();
	}
	console.log(window.sessionStorage);
	$scope.user = {username: "willcmcc"};
	if(window.sessionStorage.length = 0){
		$scope.tester = false;
		console.log("no token");
	}
	if( window.sessionStorage.length != 0){
		console.log("inside token");
		$scope.tester = true;
	}
})

app.controller("NavController", function($scope, Mongo, $state, $window){
	$scope.submission = {};
	$scope.submit = function(submission){
		console.log(submission)
		//save to db
		Mongo.postLink(submission)
			// .then(function(data){console.log('posted',data.data)})
		$state.reload();
	}
	$scope.refresh = function(submission){
		console.log('refresh')
		$state.reload();
	}
	$scope.signin = function(user){
		console.log('scope signin',user)
		Mongo.signin(user).then(function(){
			console.log('should redirect now');
			$scope.user = user;
			$state.go('home');
		})
	}
	$scope.logout = function()
	{
		console.log('test')
		delete window.sessionStorage.token;
		$state.reload();
	}
	$('.modal-trigger').leanModal();

	// if(!$scope.user){
	// 	// debugger;
	// 	$scope.user = Mongo.getUser();
	// }
})

app.controller("AuthController", function($scope, $state, Mongo, $window){
	$scope.user = {};
	function confirmPassword(pass1, pass2){
		return pass1 === pass2 ? true : false;
	}
	$scope.signup = function(user){
		debugger;
		if(confirmPassword(user.password, user.confirmPassword)){
			Mongo.addUser(user);
			console.log('success')
			$state.reload();
		}
	}
	$scope.signin = function(user){
		console.log('scope signin',user)
		Mongo.signin(user).then(function(){
			console.log('should redirect now')
			$state.reload();
		})
	}
	$scope.refresh = function(submission){
		console.log('refresh')
		$state.reload();
	}
})
app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

app.factory('Mongo', function($http, $window){
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
	function addUser(user){
		console.log(user);
		$http({
			method: "POST",
			url: '/api/users/signup',
			dataType: 'application/json',
			data: {user: user}
		}).success(function(resp){
			console.log('success callback in finduser')
			console.log(resp)
		}).error(function(e){
			console.log(e)
		})
	}
	var user;
	function getUser(){
		return user;
	}
	function signin(user){
		user = user;
		console.log('factory')
		return $http({
			method: "POST",
			url: '/api/users/signin',
			dataType: 'application/json',
			data: {user: user}			
		})
		.success(function(data, status, headers, config){
			$window.sessionStorage.token = data.token;
			console.log('check sessionStorage.token')
			signedIn = true;
		})
		.error(function (data, status, headers, config) {
			console.log("in error signin, ",data)
		})
		// .then(function(resp){
		// 	user = {_id:resp.data._id}
		// })
	}
	return {
		updateLinks: updateLinks,
		postLink: postLink,
		deleteLink: deleteLink,
		addUser: addUser,
		signin: signin,
		user: getUser,
	}
});


$(document).on('ready', function(){
	console.log('ready block')
	$(".dropdown-button").dropdown();
     $('.parallax').parallax();

})
$(document).ready(function(){
    });


window.signinCallback = function(authResult) {
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    document.getElementById('signinButton').setAttribute('style', 'display: none');
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}