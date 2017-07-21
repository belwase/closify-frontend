app.service('IntegrationService', function($http) {
    var integrations = [];

      var promise = $http.get('/api/user_profile/integration/').success(function (data) {
        for (d in data){
          integrations.push(data[d]);
        }
      });

      return {
          integrations;
       }
});