'use strict'

var app = angular.module('AngularCocktails', ["firebase"]);


app.controller('MainCtrl', function ($scope, angularFireAuth, angularFire) {
	var ref = new Firebase("https://gd-firebase.firebaseio.com/cocktails/cocktails");
	angularFireAuth.initialize(ref, {scope: $scope, name: "user"});

	$scope.login = function() {
		angularFireAuth.login("facebook");
	};
	$scope.logout = function() {
		angularFireAuth.logout();
	};

	$scope.cocktails = [];
      angularFire(ref, $scope, "cocktails");

      $scope.currentPage = 0;
      $scope.pageSize = 8;
      $scope.numberOfPages=function(){
          return Math.ceil($scope.cocktails.length/$scope.pageSize);                
    }

});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});