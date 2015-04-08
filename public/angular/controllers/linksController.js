angular.module('firstCup.links', []).controller('LinksController', function($scope, Links, $state, $window){
	//get array of link objects from db
	// $scope.links should be an array of objects from linkmodels collection
	Links.updateLinks().then(function(resp){
			$scope.links = resp.data;
		});
	$scope.deleteLink = function(link){
		// delete link from database
		console.log(link)
		Links.deleteLink(link);
		$state.reload();
	}
})