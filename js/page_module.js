var pageModule = angular.module("PageModule", ["UserModule", "ngFileUpload"]);

pageModule.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'html/index.html',
			controller: 'IndexController',
			headerShow: true,
			authenticate: true
		}).
		when('/login', {
			templateUrl: 'html/login.html',
			controller: 'LoginController',
			headerShow: false,
			authenticate: false,
			onlyLogout: true
		}).
		when('/profile', {
			templateUrl: 'html/profile.html',
			controller: 'ProfileController',
			headerShow: true,
			authenticate: true
		}).
		when('/editprofile', {
			templateUrl: 'html/editProfile.html',
			controller: 'EditProfileCtrl',
			headerShow: true,
			authenticate: true
		}).
		otherwise({
			redirectTo: '/'
		});
	}
	]);

pageModule.run(['$rootScope', '$location', "user", function($root, $location, user){
	$root.changePath = function(path) {
		lgi("changepath", path);
		$location.path(path);

		var drawer = angular.element( document.querySelector(".mdl-layout__drawer") )
		drawer.removeClass("is-visible");
	}
	$root.logout = function() {
		lgi("Logout Root");

		$root.loadingSrv.show();
		user.logout().then(function() {
			$root.loadingSrv.hide();
			$root.changePath("/login");
		});
	}
}]);

pageModule.directive('loadingDir', function(){
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		replace: true,
		templateUrl: 'html/loading.html',
		controller: ["$scope", "loadingSrv", "$rootScope", function($scope, loadingSrv, $root) {
			loadingSrv.show = function(txt) {
				txt = txt || "";
				this.text = txt;
				this.isShow = true;
				if(!$scope.$$phase)
					$scope.$digest();
			}
			loadingSrv.hide = function() {
				this.isShow = false;
				this.text = "";
				if(!$scope.$$phase)
					$scope.$digest();
			}
			$root.loadingSrv = loadingSrv;
		}]
	};
});
pageModule.service("loadingSrv", function() {
	this.isShow = false;
	this.text = "";
});

/* Controllers */

pageModule.controller('LoginController', ['$scope', '$rootScope', "user", function($scope, $root, user){

	/* login handler */
	$scope.l_username = "";
	$scope.l_password = "";
	$scope.loginSubmit = function() {
		lgi("Login", $scope.l_username, $scope.l_password);

		if (($scope.l_username == "") && ($scope.l_password == "")) {
			alert("Username & Password harus diisi");
			return;
		}

		$root.loadingSrv.show();
		user.login($scope.l_username, $scope.l_password).then(function() {
			$root.loadingSrv.hide();
			$root.changePath("");
		}, function() {
			$root.loadingSrv.hide();
			alert("Username / Password Salah");
		});
	}

	/* register handler */
	$scope.r_username = "";
	$scope.r_email = "";
	$scope.r_password = "";
	$scope.r_password2 = "";
	$scope.r_setuju = false;
	$scope.registerSubmit = function() {
		lgi("Register", $scope.r_setuju);

		if (!$scope.r_setuju) {
			alert("Harus pelajari dan setuju dengan syarat dan ketentuan yang berlaku.");
			return;
		}

		if ($scope.r_password != $scope.r_password2) {
			alert("Password Berbeda!");
			return;
		}

		$root.loadingSrv.show();
		user.register($scope.r_username, $scope.r_email, $scope.r_password, $scope.r_password2).then(function(res) {
			user.login($scope.r_username, $scope.r_password).then(function() {
				$root.loadingSrv.hide();
				$root.changePath("");
			}, function() {
				$root.loadingSrv.hide();
				alert("Username / Password Salah");
			});
		});
	}

}]);
pageModule.controller('IndexController', ['$scope', '$rootScope', function($scope, $root){
	
}]);
pageModule.controller('ProfileController', ['$scope', '$rootScope', function($scope, $root){
	
}]);

pageModule.controller('EditProfileCtrl', ['$scope', '$rootScope', "user", function($scope, $root, user){
	
	$scope.fileChanged = function(file) {
		if (file.files.length > 0) {
			// ada file masuk
			user.changeAvatar(file.files[0]).then(function(url) {
				user.profile.detail.avatar = url;
			}, function() {
				
			});
		}
	}	

}]);


/* Directives and their controllers */
pageModule.controller('headerCtrl', ['$scope', '$rootScope', function($scope, $root){
	
}]);
pageModule.controller('headerDrawerCtrl', ['$scope', '$rootScope', function($scope, $root){
	
}]);