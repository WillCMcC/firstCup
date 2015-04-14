
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
