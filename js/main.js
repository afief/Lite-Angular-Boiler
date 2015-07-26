var lg = console.log.bind(console);
var lgi = console.info.bind(console);;
var lge = console.error.bind(console);;
var lgw = console.warn.bind(console);;

var baseUrl = "";// "http://192.168.43.222/lalumpatan/";
var apiUrl = "api/";// "http://192.168.43.222/lalumpatan/api/";

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

			/* Kalau yang dibuka BUKAN page login, dan user tidak login, masuk ke page login */
			if (authenticate && !user.isLoginLocal()) {

				user.cekLocal().then(function(res) {
					if (res.status) {
						user.cek().then(function(resc) {
							if (!resc.status)
								$root.changePath("/login");
						});
					} else {
						$root.changePath("/login");
					}
				});
			}
		});

		$root.$on('$routeChangeSuccess', function(e, curr, prev) {

			lgi("headerShow", curr.$$route.headerShow);
			if (curr && curr.$$route) {
				$root.headerShow = curr.$$route.headerShow;
			}

		});

		$root.$on("$viewContentLoaded", function() {
			lgi("Upgrade All Registered");
			componentHandler.upgradeAllRegistered();
		});
	}]);

})();