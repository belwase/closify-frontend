app.controller('dashboardController', ['$scope', '$rootScope', 'toastr', '$http', '$cookies', '$cookieStore', '$timeout', '$location', function($scope, $rootScope, toastr, $http, $cookies, $cookieStore, $timeout, $location) {
    console.log('dashboardController');
    
    $rootScope.activetab = 'dashboard';
    $rootScope.user = $cookieStore.get('ems_user');
    if($rootScope.user == false || typeof($rootScope.user) === 'undefined'){
    	$location.path('/');
    }else{

      
    }



}]);    