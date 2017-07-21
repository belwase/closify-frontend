app.controller('profileController', ['$scope', '$rootScope', 'toastr', '$http', '$cookies', '$cookieStore', '$timeout', '$location', function($scope, $rootScope, toastr, $http, $cookies, $cookieStore, $timeout, $location) {
    console.log('profile controller');
    $scope.profile = {};
    $rootScope.activetab = 'profile';

    $rootScope.user = $cookieStore.get('ems_user');
    if($rootScope.user == false || typeof($rootScope.user) === 'undefined'){
    	$location.path('/');
    }else{

        $http.get($rootScope.API_URL+"/api/user/profile/"+$rootScope.user.user_id+"/").then(function(response) {
            $scope.profile = response.data.data.profile;
            console.log(JSON.stringify($scope.profile))

        }, function(response){
        	if(response.status == 404){
        		toastr.error('Error', 'Profile not found')
        	}else{
        		toastr.error('Error', response.data.message)
        	}
        });

    }


    $scope.update_profile = function(){
    	console.log(JSON.stringify($scope.profile));

    	$http.put($rootScope.API_URL+"/api/user/profile/"+$rootScope.user.user_id+"/", $scope.profile).then(function(response) {
	        console.log(response);
            toastr.success('Updated', 'Profile updated successfully');

		    }, function(response){
		    	if(response.status == 404){
		    		toastr.error('Error', 'Profile not found')
		    	}else{
		    		toastr.error('Error', response.data.message)
		    	}
		});

    }

}]);    