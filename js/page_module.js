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
		when('/editprofile/:back', {
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

	lg("on");

	$scope.isAvatarLoading = false;
	$scope.detail = user.profile.detail;
	$scope.isDetailReady = false;

	if ($scope.detail) {
		$scope.isDetailReady = true;
	} else {
		$root.$on("userProfileUpdated", function(event, data) {
			$scope.detail = data.detail;
			$scope.isDetailReady = true;
			lgi("update", $scope.detail.gender);
			if (!$scope.$$phase)
				$scope.$digest();
		});
	}
	
	$scope.fileChanged = function(file) {
		lgi("File Changed", file.files);

		if (file.files.length > 0) {
			// ada file masuk
			var cf = file.files[0];

			if (["image/jpeg", "image/png"].indexOf(cf.type) < 0) {
				alert("Tipe file tidak didukung");
			} else if (cf.size >= 3000000) {
				alert("Ukuran tidak melebihi 3 Mb");
				file.value = "";
			} else {
				document.querySelector("#uploadFile").value = cf.name;

				$scope.isAvatarLoading = true;

				user.changeAvatar(file.files[0]).then(function(url) {
					/* success */
					user.profile.detail.avatar = url;
					$scope.isAvatarLoading = false;
				}, function() {
					/* error */
					$scope.isAvatarLoading = false;
				}, function(percent) {
					/* progress */
					var progEl = document.querySelector("#progressAvatar");
					progEl.MaterialProgress.setProgress(percent);
				});
			}
		}
	}

	$scope.editProfileSubmit = function() {
		$root.loadingSrv.show();
		user.updateUser($scope.detail).then(function(res) {
			$root.changePath("/profile");
			$root.loadingSrv.hide();
		}, function() {
			$root.loadingSrv.hide();
			alert("Gagal Update Profil");
		});;
	}

}]);


/* Directives and their controllers */
pageModule.controller('headerCtrl', ['$scope', '$rootScope', function($scope, $root){
	
}]);
pageModule.controller('headerDrawerCtrl', ['$scope', '$rootScope', function($scope, $root){
	
}]);