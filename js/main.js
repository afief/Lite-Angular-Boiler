var lg = console.log.bind(console);
var lgi = console.info.bind(console);;
var lge = console.error.bind(console);;
var lgw = console.warn.bind(console);;

var baseUrl = "";// "http://192.168.43.222/lalumpatan/";
var apiUrl = "api/";// "http://192.168.43.222/lalumpatan/api/";

(function() {

	var batikOL = angular.module("LiteBoiler", ["ngRoute", "PageModule"]);

	batikOL.run(['$rootScope', '$location', function($root, $location) {
		$root.headerShow = false;
		$root.$on('$routeChangeStart', function(e, curr, prev) {


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