var pageModule = angular.module("PageModule", []);

pageModule.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'html/index.html',
			controller: 'IndexController',
			headerShow: true,
			authenticate: false
			// resolve: {
			// 	authenticated: ["user", '$q', function(user, $q) {
			// 		return user.cek();
			// 	}]
			// }
		}).
		when('/login', {
			templateUrl: 'html/login.html',
			controller: 'LoginController',
			headerShow: false,
			authenticate: false
			// resolve: {
			// 	authenticated: ["user", '$q', function(user, $q) {
			// 		return user.cek();
			// 	}]
			// }
		}).
		otherwise({
			redirectTo: '/'
		});
	}
	]);

pageModule.run(['$rootScope', '$location', function($root, $location){
	$root.changePath = function(path) {
		lgi("changepath", path);
		$location.path(path);

		var drawer = angular.element( document.querySelector(".mdl-layout__drawer") )
		drawer.removeClass("is-visible");
	}
}]);

pageModule.controller('LoginController', ['$scope', '$rootScope', function($scope, $root){
	$scope.l_username = "";
	$scope.l_password = "";
	$scope.loginSubmit = function() {
		lgi("Login", $scope.l_username, $scope.l_password);
	}
}]);
pageModule.controller('IndexController', ['$scope', '$rootScope', function($scope, $root){
	
}]);


/* Directives and their controllers */
pageModule.controller('headerCtrl', ['$scope', '$rootScope', function($scope, $root){
	
}]);
pageModule.controller('headerDrawerCtrl', ['$scope', '$rootScope', function($scope, $root){
	
}]);