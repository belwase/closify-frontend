app.service('IntegrationService', function($http, $rootScope) {
    var integrations = [];

    function getAll(callback){
      if(integrations.length < 1){

        var promise = $http.get($rootScope.API_URL+'/api/user/integration/').then(function (response) {
          integrations = response.data.results;
          callback(integrations)
          
        });
      }else{
        callback(integrations);
      }
    }

    return {getAll:getAll, integrations:integrations}
});

app.service('CampaignService', function($http, $rootScope) {

    var data = {id:'', title:'', from_address:'', message:{}};
    // var properties = ['id', 'title'];
    // for(x in properties){
    //     define(properties[x]);
    // }

    // function define(property){
    //     Object.defineProperty(self, property, {
    //       get: function() { return self.data['property']; },
    //       set: function(newValue) { 
    //              self.data['property'] = newValue; 
    //            },
    //       enumerable: true,
    //       configurable: true
    //     });
    // }

    function newCampaign(callback){
        $http.post($rootScope.API_URL+"/api/mass_mailer/campaign/" ).then(function (response) {
                cp = response.data;
                callback(cp);
             });
    }

    function init(id, callback){
      if(typeof(id) !== 'undefined'){
        data.id = id;
        $http.get($rootScope.API_URL+"/api/mass_mailer/campaign/"+id ).then(function (response) {
                cp = response.data;
                callback(cp);
             });

      }else{
        callback(data);
      }
      
     
    }

    function allCampaigns(callback){
      $http.get($rootScope.API_URL+"/api/mass_mailer/campaign/").then(function (response) {
                cp = response.data.results;
                callback(cp);
      });
    }

    function save(campaign, step='start', callback){
      console.log(JSON.stringify(campaign))
      var payload = campaign;
      payload.step = step;
      $http.put($rootScope.API_URL+"/api/mass_mailer/campaign/"+data.id+"/", payload).then(function(response){
        callback(response);
      });
    }

    return {newCampaign: newCampaign, save:save, init:init, allCampaigns:allCampaigns};

    
    
});


// app.run(['IntegrationService', function(IntegrationService) { 
//   IntegrationService.init();
// }]);