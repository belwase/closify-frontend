var app = angular.module('myApp', [
    "ngRoute",
    "ngCookies",
    'angular-jwt',
    'angularValidator',
    'toastr',
    'googleplus',
    'ngCsvImport',
    'ngWYSIWYG'
]);

const TEMPLATE_PATH = "static/assets/templates"
// Routes
app.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: TEMPLATE_PATH + "/main.html"
        })
        .when("/signup", {
            controller: 'signupController',
            templateUrl: TEMPLATE_PATH + "/auth/signup.html"
        })
        .when("/confirm-registration/:hash", {
            controller: 'signupController',
            templateUrl: TEMPLATE_PATH + "/auth/confirm-registration.html"
        })
        .when("/signin", {
            controller: 'signinController',
            templateUrl: TEMPLATE_PATH + "/auth/signin.html"
        })
        .when("/profile", {
            controller: 'profileController',
            templateUrl: TEMPLATE_PATH + "/profile.html"
        })
        .when("/dashboard", {
            controller: 'dashboardController',
            templateUrl: TEMPLATE_PATH + "/dashboard.html"
        })
        .when("/campaign", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/home.html"
        })
        .when("/campaign-new/:id/start", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/new.html"
        })
        .when("/campaign-new/:id/recipients", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/recipients.html"
        })
        .when("/campaign-new/:id/compose", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/compose.html"
        })
        .when("/campaign-new/:id/preview", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/preview.html"
        })
        .when("/campaign-new/:id/options", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/options.html"
        })
        .when("/campaign-new/:id/send", {
            controller: 'campaignController',
            templateUrl: TEMPLATE_PATH + "/campaign/send.html"
        })
        
        // .when("/signout", {
        //     controller: 'signoutController'
        // })

        // .when("/airport/:slug", {
        //     controller: 'airportController',
        //     templateUrl: "templates/airport.html"
        // })


        .otherwise({
            redirectTo: "/"
        })
        //use the HTML5 History API
    $locationProvider.html5Mode(true);
});


function getSettings() {

    var settings;

    $.ajax({
        type: "GET",
        url: '/static/setting.ini',
        async: false,
        success : function(data) {
            settings = data;
        }
    });

    return settings;

}

app.run(['$rootScope', '$http', function ($rootScope, $http) {

    //$rootScope.API_URL = 'http://52.56.96.157:8000';
    var settings = getSettings();
    settings = $.parseJSON(settings);
    $rootScope.API_URL = settings.api_url;

}]);


app.service('airportService', function($http) {
  var airports =  [];

  var setValue = function(key, value){
    airports[key] = value;
  };

  var getAirportDetail = function(slug, callback){
    $http.get($rootScope.API_URL+"/api/airport/"+slug+'/').then(function(response){
            //console.log(response);
            callback(response)
        }).catch(function(e){
            //callback(e)
            callback(e)
    });
  }


   var getAirports = function(callback){
        if(airports.length < 1){
             $http.post($rootScope.API_URL+"/api/get-airport-list/" ).then(function (response) {
                airports = response.data.result;
                callback(airports);
             });
        }else{
            callback(airports);
        }
    }


    var getTypeAheadAirports = function(){
        var source = [];
        for(i=0;i<airports.length;i++){
            var airport = airports[i];
            var obj = {id:airport.id, name:airport.name + ' (' + airport.code + ')'};
            source.push(obj)
        }
        //console.log(source)
        return source;
    }


  return { setValue: setValue, getAirportDetail:getAirportDetail, getAirports: getAirports, getTypeAheadAirports:getTypeAheadAirports};

});




// app.service('AuthService', function() {
//        var title = '';
//        var metaDescription = '';
//        var metaKeywords = '';
//        return {
//           set: function(newTitle, newMetaDescription, newKeywords) {
//               metaKeywords = newKeywords;
//               metaDescription = newMetaDescription;
//               title = newTitle; 
//           },
//           metaTitle: function(){ return title; },
//           metaDescription: function() { return metaDescription; },
//           metaKeywords: function() { return metaKeywords; }
//        }
// });

//    // app.controller('myCtrl',function($scope,$rootScope,MetaService){
//    //    $rootScope.metaservice = MetaService;
//    //    $rootScope.metaservice.set("Web App","desc","blah blah");
//    // });


app.config(['GooglePlusProvider', function(GooglePlusProvider) {
    GooglePlusProvider.setScopes(['https://www.googleapis.com/auth/userinfo.email']);
    //GooglePlusProvider.setScopes(['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']);
    //GooglePlusProvider.setScopes('https://www.googleapis.com/auth/gmail.readonly');
    //GooglePlusProvider.setScopes('https://www.googleapis.com/auth/gmail.compose');
    // GooglePlusProvider.setScopes('https://www.googleapis.com/auth/gmail.modify');
    // GooglePlusProvider.setScopes('https://www.googleapis.com/auth/gmail.send');
    // GooglePlusProvider.setAccessType('offline');
    // GooglePlusProvider.setApprovalPrompt('force'); 
    console.log(GooglePlusProvider.getScopes())
    GooglePlusProvider.enableServerSide();

    GooglePlusProvider.init({
        // clientId: '73046689236-8cik77rqnqngs5v3h6o0hgr7n4hll2q5.apps.googleusercontent.com', //'956202454072-ean3lh20313ts1mmltg586m5pdpf6dl5.apps.googleusercontent.com', 
        // apiKey: 'AIzaSyCiucBo_up-fG0paww2fvLS3DUs2QSuJUM' //'AIzaSyAKJqP-bQaO-I26t-k1GwHE8swE8hokPj4'

        //My test 
        clientId: '461853961224-40unu2krlriajdldog3h4sufupa16ner.apps.googleusercontent.com',
        apiKey: 'AIzaSyCCK-Z_wy0cfi1WdT5RKn66ARFG53BAynw'
    });
}]);

app.controller('GoogleAuthCtrl', ['$scope', '$rootScope', '$route', '$timeout', '$cookieStore', 'GooglePlus', '$http', 'jwtHelper', function($scope, $rootScope, $route, $timeout, $cookieStore, GooglePlus, $http, jwtHelper) {
    $scope.connect_google = function(source) {
        GooglePlus.login().then(function(authResult) {
            console.log(authResult)
            GooglePlus.getUser().then(function(user) {
                console.log(user);
                var social_obj = { uid:user.id, full_name:user.name, access_token:authResult.access_token, auth_code:authResult.code, identifier:user.email  };
                $http.post($rootScope.API_URL+"/api/user/integration/google/", social_obj).then(function(response) {
                    console.log(response);
                        $timeout(function() {
                                $route.reload();
                            }, 300);
                });
                
            });
        }, function(err) {
            console.log(err);
        });
    };
}]);




