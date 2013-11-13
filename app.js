'use strict'

var app = angular.module('AngularCocktails', ["firebase"]).config(function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {templateUrl: 'list.html', controller: 'MainCtrl' }).
	when('/Detail/:cocktailId', {templateUrl: 'detail.html',controller: 'DetailCtrl'}).
	when('/Favorites', {templateUrl: 'favorites.html',controller: 'FavoritesCtrl'}).
	otherwise({ redirectTo: '/' });
}).constant('FIREBASE_URL', 'https://gd-firebase.firebaseio.com')
.run(['$rootScope', 'angularFireAuth', 'FIREBASE_URL', function($rootScope, angularFireAuth, FIREBASE_URL) {
	angularFireAuth.initialize(new Firebase(FIREBASE_URL), {scope: $rootScope, name: 'user'});
}]);


app.controller('MainCtrl', function ($scope, angularFireAuth, angularFire, FIREBASE_URL) {
	var cocktailref = new Firebase(FIREBASE_URL+"/cocktails/cocktails");

	$scope.cocktails = [];
	angularFire(cocktailref, $scope, "cocktails");

	$scope.currentPage = 0;
	$scope.pageSize = 8;
	$scope.numberOfPages=function(){
		return Math.ceil($scope.cocktails.length/$scope.pageSize);                
	}

	$scope.addToFavorites = function(cocktail) {
		


		var userfavref = new Firebase(FIREBASE_URL+"/users/"+$scope.user.id+'/favorites/');
		var promise = angularFire(userfavref, $scope, "user.favorites");
		promise.then(function(){ // ana sayfada cikmiyor eger favlari burda initialize edersen

			userfavref.push(angular.copy(cocktail));

		});
		console.log('added to favorites');
		console.log($scope.user.favorites);
	};

});


app.controller('LoginCtrl', function ($scope, angularFireAuth, angularFire, FIREBASE_URL) {

	$scope.login = function() {
		angularFireAuth.login("facebook");
	};

	$scope.$on("angularFireAuth:login", function(evt, user) {

		var userref = new Firebase(FIREBASE_URL+"/users/"+user.id);
		angularFire(userref, $scope, "user"); //silerken id lazim unique id genrate et

	});

	$scope.logout = function() {
		angularFireAuth.logout();
	};
});

app.controller('FavoritesCtrl', function ($scope, angularFire, $routeParams,FIREBASE_URL,$location) {
	
	/*$scope.removeFromFavorites = function(cocktail) {
		


		var userfavdeleteref = new Firebase(FIREBASE_URL+"/users/"+$scope.user.id+'/favorites/'+cocktail.id);
		var promise = angularFire(userfavref, $scope, "user.favorites");
		promise.then(function(){

			userfavdeleteref.remove();

		});
		console.log('deleted to favorites');
	};*/

	if($scope.user){
		console.log($scope.user);
	}else{
		alert('please login');
		
	}

});

app.controller('DetailCtrl', function ($scope, angularFire, $routeParams,FIREBASE_URL) {
	var cocktailId = $routeParams.cocktailId;

	var chosenref = new Firebase(FIREBASE_URL+"/cocktails/cocktails/"+cocktailId);
	$scope.chosenCocktail;
	angularFire(chosenref, $scope, "chosenCocktail");
});


app.filter('startFrom', function() {
	return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});