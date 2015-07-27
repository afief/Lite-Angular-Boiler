var userModule = angular.module("UserModule", [], ["$httpProvider", function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

userModule.factory("user", ["$http","$q", "Upload", function($http, $q, Upload) {

	var key = window.localStorage.getItem("key") || "";
	var isLogin = false;

	function changeKey(newKey) {
		key = newKey;
		window.localStorage.setItem("key", key);
		console.log("change key", key);
	}
	serialize = function(obj, prefix) {
		var str = [];
		for(var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push(typeof v == "object" ?
					serialize(v, k) :
					encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	}

	return {
		profile: {},
		getKey: function() {
			return key;
		},
		isLogin: function() {
			return isLogin;
		},
		isLoginLocal: function() {
			return (key != "");
		},
		login: function(username, password) {
			var defer = $q.defer();
			var ini = this;

			var credential = {username: username, password: password};

			$http.post(apiUrl + "login", serialize(credential)).
			success(function(data) {
				if (data.status) {
					changeKey(data.key);
					isLogin = true;		
					ini.cek();
					$http.defaults.headers.common.key = data.key;
					defer.resolve(data.key);
				} else {
					defer.reject(data.message);
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		register: function(username, email, password, password2) {
			var defer = $q.defer();
			var ini = this;

			var credential = {
				username: username,
				password: password,
				password2: password2,
				email: email
			};

			$http.post(apiUrl + "register", serialize(credential)).
			success(function(data) {
				if (data.status) {
					defer.resolve(true);
				} else {
					defer.reject(data.message);
				}
			}).
			catch(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		},
		cekLocal: function() {
			lgi("cek local", key);

			if (key == "") {
				return $q.when({status: false});
			} else {
				return $q.when({status: true});
			}

		},
		cek: function() {
			var defer = $q.defer();
			var ini = this;
			
			if (key == "") {
				lgi("cek login", false);
				return $q.when({status: false});
			}

			$http.post(apiUrl + "user", serialize({key: key})).
			success(function(data, status) {
				lgi("cek login", data.status);
				if (data.status) {
					isLogin = true;
					ini.profile = data.data;
					defer.resolve(data);
				} else if (data.hasOwnProperty("status")) {
					changeKey("");
					defer.resolve(data);
				} else {
					defer.reject(data);
				}
			}).
			catch(function(err) {
				defer.reject(data.message);
			});

			return defer.promise;
		},
		changeKey: changeKey,
		logout: function() {
			var defer  = $q.defer();
			var promise = $http.post(apiUrl + "logout", serialize({key: key})).
			success(function(data) {
				if (data.status) {
					isLogin = false;
				}
				changeKey("");
				defer.resolve(true);
			}).
			catch(function(err) {
				changeKey("");
				defer.resolve(true);
			});

			return defer.promise;
		},
		saveLocalData: function(key, dat) {
			if (window.localStorage) {
				lgw("save local data", dat);
				window.localStorage.setItem(key, JSON.stringify(dat));
			}
		},
		getLocalData: function(key) {
			var res = {};
			if (window.localStorage) {
				var dat = window.localStorage.getItem(key);
				res = JSON.parse(dat);
				lgw("load local data", res);
			}
			return res;
		},

		changeAvatar: function(file) {
			var defer  = $q.defer();

			Upload.upload({
				url: apiUrl + "changeavatar",
				method: 'POST',
				file: file,
				sendFieldsAs: 'form',
				fields: {
					key: key
				}
			}).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				lg('progress: ' + progressPercentage + '% ' + evt.config.file.name);
			}).success(function (data, status, headers, config) {
				lgi('file ' + config.file.name + 'uploaded. Response: ' + data);
				defer.resolve(true);
			}).error(function (data, status, headers, config) {
				lgw('error status: ' + status);
				defer.reject("");
			})

			return defer.promise;
		}
	}

}]);

userModule.run(["user", "$rootScope", function(user, $root) {
	// user.cekLocal().then(function(res) {
	// 	if (res.status) {
	// 		user.cek().then(function() {
	// 		});
	// 	}
	// });

$root.user = user;
}]);
userModule.run(["$http", "user", function($http, user) {
	$http.defaults.headers.common.key = user.getKey();
}]);

userModule.factory("connectivity", function() {
	return {
		checkStatus: function(hres) {
			if (hres.status <= 0)
				return "Koneksi mati. Mohon periksa kembali jaringan anda.";
			else if (hres <= 199)
				return "Gagal (" + hres.status + "): " + hres.statusText;
			else if (hres <= 299)
				return "Gagal mengambil data melalui akun anda. Cobalah untuk keluar, lalu masuk kembali ke aplikasi";
			else if (hres <= 399)
				return "Terjadi kesalahan koneksi. Koneksi dialihkan";
			else if (hres <= 499)
				return "Terjadi kesalahan ketika mengakses server.";
			else
				return "Terjadi kesalahan pada server. Hubungi administrator";
		}
	}
});