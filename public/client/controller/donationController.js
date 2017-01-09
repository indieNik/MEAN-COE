var easyDonations=angular.module('easyDonations');

easyDonations.controller('donationController',['$scope', '$http', '$sessionStorage', 'donationFactory','$timeout','$rootScope','$location', function($scope, $http, $sessionStorage, donationFactory,$timeout,$rootScope,$location){
    
	console.log("inside view donations controller");
    $scope.hidePostButton=true;
	$scope.items = [];
    
	if($sessionStorage.user){
		// Only if Session is Set
		$scope.posted_by = $sessionStorage.user.current_user;
		$scope.current_user_name = $sessionStorage.user.current_user;
	}
    
    function getDonors(){
        donationFactory.getDonors().then(function(response){
            $scope.donors=response.data;
            console.log("Donors object");
            console.log(response);
          },function(error){
            console.log("Couldnot get donors data");});
    };
    
    function getDonorById(){
        donationFactory.getDonorById($sessionStorage.user.current_user).then(function(response){
            $scope.donor=response.data;
            console.log("Donor object");
            console.log(response);
          },function(error){
            console.log("Couldnot get donor data");});
    };
    
    
    function getOrphanageById(){
        donationFactory.getOrphanageById($sessionStorage.user.current_user).then(function(response){
            $scope.orphanage=response.data;
            console.log("Orphanage object");
            console.log(response);
          },function(error){
            console.log("Couldnot get orphanage data");});
    };
    
     function getPostsOfDonor(){
        donationFactory.getPostsByDonorName($sessionStorage.user.current_user).then(function(response){
            $scope.postsOfDonor=response.data;
            console.log("DonorPosts object");
             $rootScope.numberOfPosts=Object.keys($scope.postsOfDonor).length;
            console.log(response);
          },function(error){
            console.log("Couldnot get donorPost data");});
    };
    
    function getPosts() {
				console.log("Inside Get Posts");
        donationFactory.getPosts().then(function (response){
            $scope.posts = response.data;
            console.log("POST OBJECT");
            console.log(response);
        }, function (error) {
            console.log("Could not get data");
        });
    };
   
    $scope.getAllDetails=function(){
    $scope.postDetails=[];
    console.log("Inside GetAll");
        
        for(i in $scope.posts){
            for(j in $scope.donors){  
                if($scope.posts[i].posted_by ==$scope.donors[j]._id){
                    $scope.postDetails.push({"name":$scope.donors[j].name,"items":$scope.posts[i].items,"quantity":$scope.posts[i].quantity,"postedBy":$scope.posts[i].posted_by,"postId":$scope.posts[i]._id,"loaction":$scope.donors[j].address.city,"claims":$scope.posts[i].claims});
                        
                    console.log("postDetails");
										console.log($scope.postDetails);
                }
            }
        }        
    };
    
    getDonorById();
    getOrphanageById();
    getPostsOfDonor();
    getDonors();
    getPosts();
    $timeout($scope.getAllDetails, 1050);

    $scope.viewPosts=function(){	
        
        $scope.hidePostButton=false;		

        console.log($rootScope.numberOfPosts);		

        if($rootScope.numberOfPosts>0){	
            $scope.showPosts=true;		
            $scope.showPostError=false;	
            $scope.viewPostButton=true;	
        }		
       else{		
            $scope.showPosts=false;
            $scope.showPostError=true;		
            $scope.viewPostButton=true;	
        }	
    };		
    		
    $scope.hidePosts=function(){		
        $scope.showPosts=false;		
        $scope.showPostError=false;		
        $scope.viewPostButton=false;		
        $scope.hidePostButton=true;		
    };		
    		
    $scope.deletePost=function(id){
				console.log("ID : " + id);
        donationFactory.deletePostById(id).then(function(response){	
						alert("Deleted the post Successfully!");
            $location.path("/home");
        },function(error){		
            console.log("Couldnot delete post");
            }
        );
    };
    
    
	$scope.insertPosts = function(){
		// Insert the item to the Items Array
		$scope.items.push($scope.item);
		console.log("Added Items : ");
		console.log($scope.items);
		
		// Insert the items array, posted_by and the expiry_date into Posts Collection
		var postData = {
			"posted_by" : $scope.posted_by,
			"expiry_date" : $scope.expiry_date,
			"items" : $scope.items,
			"activated" : true
		}
		donationFactory.insertPosts(postData).then(function (response){
                $location.path("/home");
                alert("You brought smile on someone's face, THANK YOU !");
				console.log("Inserted Item : ");
				console.log(response.data);
        }, function(error){
				console.log("Could Not Insert");
            }
		);
	};
    
	$scope.addItem = function(){
		// Create a item object and populate it
		var item = {};
		item.item = $scope.item.item;
		item.quantity = $scope.item.quantity;
		
		//Push item into Items Array
		$scope.items.push(item);
		
		// Reset the Fields
		$scope.item.item = "";
		$scope.item.quantity = "";
		console.log("Added Items : ");
		console.log($scope.items);
	};
    
    $scope.claimForThisPost = function(postId, claims){
        
        console.log("Inside claimForThisPost");
        //var id = $sessionStorage.user._id;
        console.log(claims);
        var claimsObj={"claims":$sessionStorage.user._id};
        
        if($.inArray($sessionStorage.user._id, claims) > -1){
            alert("You have Already Claimed for this Post");
        }
        else{
            donationFactory.updatePosts(postId,claimsObj).then(function(response){
                    $location.path("/home");
                    alert("You claimed successfully!");
            }, function(error){
                console.log("Claim unsuccessful !");
			});
        }
    };
		
		$scope.acceptClaim = function(id, donated_by, donated_to, items){
			var donationData = {
				"donated_by" : donated_by,
				"donated_to" : donated_to,
				"donated_items": items
			};
			// Insert the donation into Donations Table
			donationFactory.insertDonations(donationData).then(function (response){
				$location.path("/home");
				alert("Claimed Successfully!!");
				
				// Update the Post with 0 claims and de-activate the post
				donationFactory.updatePosts(id,{"activated": false}).then(function(response){
					console.log("post id: " + id);
					$location.path("/home");
					alert("Post De-activated!");
				}, function(error){
					console.log("Post couldn't be de-activated!!! :( ");
				});
			}, function(error){
				console.log("Could not say yes to a Donation request! :( ");
			});
		};
}]);