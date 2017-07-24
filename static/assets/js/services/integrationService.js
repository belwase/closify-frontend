app.service('IntegrationService', function($http, $rootScope) {
    var integrations = [];

      var promise = $http.get($rootScope.API_URL+'/api/user_profile/integration/').success(function (data) {
        for (d in data){
          integrations.push(data[d]);
        }
      });

      return {
          integrations;
       }
});