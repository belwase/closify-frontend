app.controller('signinController', ['$scope', '$rootScope', '$http', '$cookies', '$cookieStore', '$timeout', '$location', 'jwtHelper', function($scope, $rootScope, $http, $cookies, $cookieStore, $timeout, $location,jwtHelper) {
    //console.log('signin controller');
    $scope.signin_user = function() {
        $http.post($rootScope.API_URL+"/api/login/", { 'email': $scope.email, 'password': $scope.password }).then(function(response) {
            console.log(response.data);
            var token = response.data.data.token;
            console.log(typeof(token))
            if (typeof(token) !== 'undefined') {
                //var userid = jwtHelper.decodeToken(token).user_id;
                try{
                $rootScope.user = response.data.data;
                $cookieStore.put('ems_user', $rootScope.user);   

                $http.defaults.headers.common['Authorization'] = 'JWT ' + token;
                window.location.href = '/profile';
            }catch(err){
            	console.log(err)
            }
            } else {
                alert(response.data.message);
            }
        },function(response) {
            $scope.showLoginError=true;
        });

    };

}]);    

app.controller('signupController', ['$scope', '$rootScope','toastr', '$http', '$cookies', '$cookieStore', '$routeParams', '$timeout', '$location', function($scope, $rootScope,toastr, $http, $cookies, $cookieStore, $routeParams, $timeout, $location) {
    //console.log('signup controller');
    $scope.signup_user = function(){

		console.log(JSON.stringify($scope.signup))
		if($scope.signup.password !== $scope.signup.password2){
			alert('Password did not matched');
		}else{
			$http.post($rootScope.API_URL+"/api/register/", $scope.signup).then(function(response) {
				console.log(response)
				if(response.data.success === true){
					alert('You have signed up successfully');
				}else{
					alert(JSON.stringify(response.data.message))
				}
			});
		}

	};

	$scope.comparePswd = function(pass1,pass2){
        if(pass1===pass2){
            return true;
        }
        else{
            return false;
        }
    }


    var path = $location.path();
    $scope.message = 'Invalid link'
    var hash = $routeParams.hash;

    if(typeof(hash) !== 'undefined'){

        $http.post($rootScope.API_URL+"/api/confirm-registration/", { '_hash': hash }).then(function(response) {

            if (response.status == 200){
                $scope.message = 'User Registration has been successfully Confirmed';
                
            }
            toastr.success('Success!', $scope.message);

        }, function(response){

            if(response.status == 404){
                $scope.message = 'Provided Hash not found';
            }else{
                $scope.message = 'Provided Hash Expired or already validated';
            }
            toastr.error('Error!', $scope.message)
        });

    }




}]);    