app.controller('appController', ['$scope', '$rootScope', '$http', '$cookies', '$cookieStore', '$timeout', '$location', function($scope, $rootScope, $http, $cookies, $cookieStore, $timeout, $location) {
    console.log('app controller');
    $rootScope.hideMainHeader = false;
    console.log($location.absUrl())
    console.log($location.path())
    var path = $location.path();
    console.log(path);
    if (path == '/profile/'){
      $rootScope.hideMainHeader = true;
    }

//console.log($rootScope.user)
   $rootScope.resetSession = function(){
        $http.defaults.headers.common['Authorization'] = '';
        $rootScope.user = false;
        $cookieStore.put('ems_user', $rootScope.user);
    }


   // /// Cookies 
   $rootScope.user = $cookieStore.get('ems_user');

   console.log($rootScope.user);
    if($rootScope.user == false || typeof($rootScope.user) === 'undefined'){
      $rootScope.resetSession()

    }else{

        console.log('Token : ' + $rootScope.user.token);
        $http.defaults.headers.common['Authorization'] = 'JWT ' + $rootScope.user.token;

        $http.get($rootScope.API_URL+'/api/authenticate/').then(function(response){
                var success = response.data.success;
                if (success === true){
                    console.log(response.data);
                    //window.location.href = '/dashboard';

                }else{
                   $rootScope.resetSession();
                }
        });

    }
   

    $rootScope.signout = function(){
        $rootScope.resetSession();
        alert("You've been successfully signed out")
        $location.path("/");
    }

}]);