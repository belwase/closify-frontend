app.controller('campaignController', ['$scope', '$rootScope', 'toastr', '$http', '$cookies', '$cookieStore', '$routeParams', '$timeout', '$location', 'CampaignService', 'IntegrationService', function($scope, $rootScope, toastr, $http, $cookies, $cookieStore, $routeParams, $timeout, $location, CampaignService, IntegrationService) {
    console.log('campaignController');

    $rootScope.activetab = 'campaign';
    $rootScope.user = $cookieStore.get('ems_user');
    if($rootScope.user == false || typeof($rootScope.user) === 'undefined'){
        $location.path('/');
    }


    var id = $routeParams.id;
    console.log('route' + id)
    
    $scope.campaign = {};
    $scope.integrations = null;

    $scope.campaign.recipients = [];
    $scope.recipients_counter = 0;
    $scope.recipient_headers = [];

    $scope.receive_flags = [{name:'A reply'}, {name: 'An open'}, {name:'A reply or an open'}]


    IntegrationService.getAll(function(integrations){
        $scope.integrations = integrations;
        //console.log('integrations :: ' + JSON.stringify($scope.integrations))
    });

    CampaignService.init(id, function(campaign){
        $scope.campaign = campaign;
        $scope.campaign.from_address = campaign.integration;
        //console.log($scope.campaign.reply.receive_flag)
        //$scope.message_content = $scope.campaign.message.body;
        //$scope.campaign.message = campaign.message;

        for(int in $scope.integrations){
            var int_obj = $scope.integrations[int];
            //console.log( int_obj.identifier  + $scope.campaign.from_address )
            if (int_obj.identifier == $scope.campaign.from_address){
                $scope.campaign.integration = int_obj;
            }
        }
        //console.log($scope.campaign)
    });


    $scope.getClass = function (path) {
        //var _class = ($location.path().substr(0, path.length) === path) ? 'active' : '';
        //console.log($location.path() + path)
        var _class = ($location.path().includes(path)) ? 'active' : '';
        return _class;
    }

    $scope.getDisabled = function(){
        console.log('here')
        console.log($scope.recipients.length )
        if($scope.recipients.length < 1){
            return 'disabled';
        }
        return '';
    }


    $scope.new_campaign = function(){
    	console.log('new campaign');
        $scope.campaign.id = 9;
        $location.path('/campaign-new/'+$scope.campaign.id+'/start');

    	// $CampaignService.newCampaign(function(campaign){

     //        $scope.campaign.id = campaign.id;
     //        console.log($scope.campaign.id)
     //        $location.path('/campaign-new/'+$scope.campaign.id+'/start');
    		
    	// });
    }

    $scope.new_campaign_start = function(){
        CampaignService.save($scope.campaign, 'start', function(response){
            console.log(response);
            if(response.status == 200){
                $location.path('/campaign-new/'+$scope.campaign.id+'/recipients');
            }else{
                console.log('Error :: ')
            }
        });
        //
    }

    $scope.new_campaign_compose = function(){
        CampaignService.save($scope.campaign, 'recipients', function(response){
            console.log(response);
            if(response.status == 200){
                $location.path('/campaign-new/'+$scope.campaign.id+'/compose');
            }else{
                console.log('Error :: ')
            }
        });
        //
    }

    $scope.new_campaign_preview = function(){
        console.log(JSON.stringify($scope.campaign));
        console.log('subject' + $scope.campaign.message.subject);
        console.log('body' + $scope.campaign.message.body) 
        console.log('body' + $scope.campaign.reply.body) 
        // CampaignService.save($scope.campaign, 'preview', function(response){
        //     console.log(response);
        //     if(response.status == 200){
        //         $location.path('/campaign-new/'+$scope.campaign.id+'/compose');
        //     }else{
        //         console.log('Error :: ')
        //     }
        // });
        //
    }

    $scope.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        separatorVisible: false,
        result: null,
        encodingVisible: true,
        uploadButtonLabel: "upload a csv file"
    };
    $scope.uploadCSV = function(){
        var rows = $scope.csv.result;
        console.log(rows)

        //check for filename:
        var same_name = false;
        for(var i = 0; i < $scope.campaign.recipients.length; i++) {
            if($scope.campaign.recipients[i].filename.includes(rows.filename) ){
                same_name = true;
                alert('collide')
            }
        }

        if(same_name === false){

        
            $scope.recipients_counter += 1
            rows.id = $scope.recipients_counter;
            rows.filename = rows.filename
            
            var new_rows = rows;
            var recepit_rows ={filename:rows.filename, id:rows.id, rows:new_rows}
            console.log(recepit_rows)
            $scope.campaign.recipients.push(recepit_rows);
            //$scope.recipient_headers = Object.keys(rows[0]);

            //console.log(JSON.stringify($scope.campaign));
        }

    };


    $scope.removeRecipient = function(id){
        alert('removing ' + id)
        for(var i = 0; i < $scope.campaign.recipients.length; i++) {
                if($scope.campaign.recipients[i].id == id) {
                    console.log('removing now' )
                    $scope.campaign.recipients.splice(i, 1);
                    console.log(JSON.stringify($scope.campaign.recipients));
                    return;
                }
         
        }
    }



    $scope.editorConfig = {
        sanitize: false,
        toolbar: [
        { name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-'] },
        { name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-'] },
        { name: 'doers', items: ['removeFormatting', 'undo', 'redo', '-'] },
        { name: 'colors', items: ['fontColor', 'backgroundColor', '-'] },
        { name: 'links', items: ['image', 'hr', 'symbols', 'link', 'unlink', '-'] },
        { name: 'tools', items: ['print', '-'] },
        { name: 'styling', items: ['font', 'size', 'format'] },
        ]
    };

}]);    