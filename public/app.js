//app.js
//Create PlaceMe angular Module
var placeMe = angular.module('placeMe', ['ngRoute'])
	
	//This service allows controllers to access and modify Results values
	.service('shared', function () {
        var results = [];
        return {
            getResults: function () {
                return results;
            },
            setResults: function(value) {
                results = value;
            }
        };
    });;

//Configure the router for the application
placeMe.config(function($routeProvider) {
    $routeProvider
        // route for the home page/search page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'homeController'
        })
        // route for the about page
        .when('/results', {
            templateUrl : 'pages/results.html',
            controller  : 'resultsController'
        });
});

//Controller for the Search page
placeMe.controller('homeController', ['$scope', '$location', 'shared', function($scope, $location, shared) {

	//Location Request Parameters
	$scope.searchtext = "";
	$scope.referencetext = "";
	$scope.miles = 10;

	//Variables that help show/hide the Advanced Options Menue
	$scope.results = [];
	$scope.showAOArrowClass = "fa-angle-double-down";
	$scope.showAOText = "Show Advanced Options";
	$scope.advancedOptionsHide = "advancedOptionsHide";
	$scope.showAO = false;

	//Triggers on PlaceMe button click
	$scope.locationSearch = function(){
		if ($scope.referencetext == ""){
			getLocationsGlobal();
		}
		else {
			//Have to locate the reference's Lattitude and Longitude in order to work with Google properly
			geocodeAddress($scope.referencetext);
		}

	}

	//Get the LatLng of an address and then run the location search using that LatLng
	function geocodeAddress(address) {
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'address': address
		},
		function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			getLocations(results[0].geometry.location);
		} 
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
		});
	}

	//Call GMap API using a specified starting location LatLng, radius, and search query
	function getLocations(latlng) {
		service = new google.maps.places.PlacesService(document.getElementById('map'));
		var request = {
			location: latlng,
			radius: $scope.miles,
			query: $scope.searchtext
		}
		service.textSearch(request, callback);
	}

	//Call GMap API using only a search query.
	function getLocationsGlobal(){
		service = new google.maps.places.PlacesService(document.getElementById('map'));
		var request = {
			query: $scope.searchtext
		}
		service.textSearch(request, callback);
	}

	//Callback used in GMap API calls in order to add the results to the App.
	//Also used to 
	function callback(results, status) {
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	  		$scope.$apply(function(){
	  			for (i = 0; i < results.length; i++){
	  				results[i].types = typeParse(results[i].types);
	  			}
	  			shared.setResults(results);
				$location.path("/results");
   			});
		}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	}

	//Function to show/hide Advanced Options
	$scope.switchAO = function(){
		$scope.showAO = !$scope.showAO;
		if ($scope.showAO) {
			$scope.showAOArrowClass = "fa-angle-double-up";
			$scope.showAOText = "Hide Advanced Options";
			$scope.advancedOptionsHide = ""
		}
		else {
			$scope.showAOArrowClass = "fa-angle-double-down";
			$scope.showAOText = "Show Advanced Options";
			$scope.advancedOptionsHide = "advancedOptionsHide";
		}
	}

	//Takes all they types and converts it to usable text
	function typeParse(typeArr){
		toReturn = [];
		var current;
		for (j = 0; j < typeArr.length; j++){
			current = typeArr[j];
			//replace all underscores with spaces
			current = current.replace(/_/g, ' ');
			//Capitalize every word in the string
			current = current.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
			//add commas when necessary
			if (j != typeArr.length - 1) current = current + ', '
			toReturn.push(current);
		}
		return toReturn;
	}

}]);

//Controller for the Results page
placeMe.controller('resultsController', ['$scope', '$location', 'shared', function($scope, $location, shared) {
	$scope.results = shared.getResults();

	//Used to check for the last entry in results.
	$scope.isNotLast = function(check) {
    	var cssClass = check ? null : "addBorder";
    	return cssClass;
	};

	//Return to the search page when the navbar is clicked
	$scope.returnHome = function(){
		$location.path("/");
	}
}]);	