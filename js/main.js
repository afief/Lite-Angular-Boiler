var lg = console.log.bind(console);
var lgi = console.info.bind(console);
var lge = console.error.bind(console);
var lgw = console.warn.bind(console);
var lgblue = function(arg) { console.log( "%c" + arg, "background-color: blue; color: white" )}
var lgblack = function(arg) { console.log( "%c" + arg, "background-color: black; color: white" )}

var baseUrl = "http://192.168.88.14/mdl/angular/";
var apiUrl = "http://192.168.88.14/mdl/angular/api/";

(function() {

	var batikOL = angular.module("LiteBoiler", ["ngRoute", "PageModule"]);

	batikOL.run(['$rootScope', '$location', "user", function($root, $location, user) {
		$root.headerShow = false;
		$root.$on('$routeChangeStart', function(e, curr, prev) {

			if (!curr.$$route) {
				e.preventDefault();
				return;
			}
			var authenticate = curr.$$route.authenticate || false;
			var onlyLogout = curr.$$route.onlyLogout || false;

			if (authenticate) {
				if (user.isLoginLocal()) {
					user.cekLocal().then(function(res) {
						if (res.status) {
							cekPeriodicOnline();
						} else {
							$root.changePath("/login");
						}
					});
				} else {
					$root.changePath("/login");
				}

			} else if (onlyLogout && user.isLoginLocal()) {
				$root.changePath("/");
			}

			function cekPeriodicOnline() {
				lgblue("cekPeriodicOnline");
				if (!user.isLogin()) {
					user.cek().then(function(resc) {
						if (!resc.status)
							$root.changePath("/login");
					}, function() {
						window.setTimeout(cekPeriodicOnline, 5000);
					});
				}
			}
		});

		$root.$on('$routeChangeSuccess', function(e, curr, prev) {

			lgi("headerShow", curr.$$route.headerShow);
			if (curr && curr.$$route) {
				$root.headerShow = curr.$$route.headerShow;
			}

		});

		$root.$on("$viewContentLoaded", function() {
			lgblue("Upgrade All Registered");
			componentHandler.upgradeAllRegistered();
		});
	}]);

})();