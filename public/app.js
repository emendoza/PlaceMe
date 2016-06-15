//app.js
//Create PlaceMe angular Module
var placeMe = angular.module('placeMe', ['ngRoute'])

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

//Google Maps Service

//Controller for the Search page
placeMe.controller('homeController', ['$scope', '$location', 'shared', function($scope, $location, shared) {

	$scope.searchtext = "";
	$scope.referencetext = "";
	$scope.miles = 10;

	$scope.results = [];
	$scope.showAOArrowClass = "fa-angle-double-down";
	$scope.showAOText = "Show Advanced Options";
	$scope.advancedOptionsHide = "advancedOptionsHide";
	$scope.showAO = false;

	$scope.locationSearch = function(){
		if ($scope.referencetext == ""){
			getLocationsGlobal();
		}
		else {
			geocodeAddress($scope.referencetext);
		}

	}

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

	function getLocations(latlng) {
		service = new google.maps.places.PlacesService(document.getElementById('map'));
		var request = {
			location: latlng,
			radius: $scope.miles,
			query: $scope.searchtext
		}
		service.textSearch(request, callback);
	}

	function getLocationsGlobal(){
		service = new google.maps.places.PlacesService(document.getElementById('map'));
		var request = {
			query: $scope.searchtext
		}
		service.textSearch(request, callback);
	}

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
	}

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

	function typeParse(typeArr){
		toReturn = [];
		var current;
		for (j = 0; j < typeArr.length; j++){
			current = typeArr[j];
			current = current.replace(/_/g, ' ');
			current = current.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
			if (j != typeArr.length - 1) current = current + ', '
			toReturn.push(current);
		}
		return toReturn;
	}

}]);

//Controller for the Results page
placeMe.controller('resultsController', ['$scope', 'shared', function($scope, shared) {
	$scope.results = shared.getResults();

	$scope.isNotLast = function(check) {
    	var cssClass = check ? null : "addBorder";
    	return cssClass;
	};
}]);

placeMe.controller('mainController', ['$scope', '$location', function($scope, $location){
	$scope.returnHome = function(){
		$location.path("/");
	}
}]);
