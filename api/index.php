<?php
require 'vendor/autoload.php';
require 'medoo.min.php';

include "config.php";

$db = new medoo([
	// required
	'database_type' => 'mysql',
	'database_name' => DATABASE_NAME,
	'server' => DATABASE_SERVER,
	'username' => DATABASE_USERNAME,
	'password' => DATABASE_PASSWORD,
	'charset' => 'utf8'
	]);

//routing
$app = new \Slim\Slim();

$app->get("/", function() {
	echo "selamat datang";
});
$app->post("/login", function() {
	global $app;

	$result = new stdClass();
	$result->status = false;
	$user = getPosts();

	if (isset($user["username"]) && isset($user["password"])) {
		$key = loginUser($user["username"], $user["password"]);
		if ($key) {
			$result->status = true;
			$result->key = $key;
		}
	}
	echo json_encode($result);
});

$app->post("/register", function() {
	global $app;

	$result = new stdClass();
	$result->status = false;
	$user = getPosts();

	if (isset($user["username"]) && isset($user["password"]) && isset($user["password2"]) && isset($user["email"])) {
		if ($user["password"] == $user["password2"]) {
			$rowName = getUserByName($user["username"]);
			if (!$rowName) {
				$rowEmail = getUserByEmail($user["email"]);
				if (!$rowEmail) {
					$regStatus = registerNewUser($user["username"], $user["password"], $user["email"], 10);
					if ($regStatus) {
						$result->status = true;
						setUserDetail($regStatus, $user["username"], "", "", "http://www.gravatar.com/avatar/" . md5( strtolower( trim( $user["email"] ) ) ) . "?s=80&d=mm", "pria");
					} else {
						$result->message = "register failed";
					}
				} else {
					$result->message = "email exist";
				}
			} else {
				$result->message = "username exist";
			}
		} else {
			$result->message = "password different";
		}
	} else {
		$result->message = "parameter invalid";
	}
	echo json_encode($result);
});

$app->post("/logout", function() {
	global $app;

	$result = new stdClass();
	$result->status = false;
	$data = getPosts();

	if (isset($data["key"])) {
		$row = logoutByKey($data["key"]);
		$result->status = true;
		$result->row = $row;
	}
	echo json_encode($result);
});
$app->post("/logoutAll", function() {
	global $app;

	$result = new stdClass();
	$result->status = false;
	$data = getPosts();

	if (isset($data["username"]) && isset($data["password"]) && isset($data["key"])) {
		$user = getUserBykey($data["key"]);

		if ($user) {
			if (($data["username"] == $user["username"]) && (md5($data["password"]) == $user["password"])) {
				$rowAffected = logoutAll($user["id"]);
				$result->row = $rowAffected;
				$result->status = true;
			} else {
				$result->message = "wrong username / password";
			}
		} else {
			$result->message = "key not exist";
		}
	} else {
		$result->message = "parameter invalid";
	}
	echo json_encode($result);
});
$app->post("/user", function() {
	global $app;

	$result = new stdClass();
	$result->status = false;

	$data = getPosts();

	if (isset($data["key"])) {
		$user = getUserByKey($data["key"]);
		if ($user) {
			$user["status"] = intval($user["status"]);
			$user["detail"] = getUserDetail($user["id"]);
			$user["detail"]["avatar"] = BASE_URL . AVATAR_DIR . $user["detail"]["avatar"];

			unset($user["password"]);

			$result->status = true;
			$result->data = $user;
		} else {
			$result->message = "invalid_key";
		}
	} else {
		$result->message = "sketcy";
	}

	echo json_encode($result);
});
$app->get("/user/:username", function($username) {
	global $app;

	$result = new stdClass();
	$result->status = false;

	$user = getUserByName($username);
	if ($user) {
		unset($user["password"]);

		$result->status = true;
		$result->data = $user;
	}

	echo json_encode($result);
});
$app->get("/email/:email", function($email) {
	global $app;

	$result = new stdClass();
	$result->status = false;

	$user = getUserByEmail($email);
	if ($user) {
		unset($user["password"]);

		$result->status = true;
		$result->data = $user;
	}

	echo json_encode($result);
});

$app->post("/changeavatar", function() {
	global $app;

	$result = new stdClass();
	$result->status = false;

	$user = getUserByKey($_POST["key"]);
	if ($user) {	

		$ext = explode('.', $_FILES['file']['name']);
		$ext = $ext[count($ext)-1];
		$filename = $user["username"] . "_" . uniqid() . "." . $ext;

		$destination = AVATAR_DIR . $filename;
		if (move_uploaded_file( $_FILES['file']['tmp_name'] , $destination )) {
			updateAvatar($user["id"], $filename);

			//cropImage($destination);

			$result->key = $_POST['key'];
			$result->url = BASE_URL . $destination;
			$result->status = true;
		}
	}

	echo json_encode($result);
});

//route functions
function loginUser($username, $password) {
	global $db;

	$md5pass = md5($password);
	$row = $db->get("me_users", "*", ["AND" => ["username" => $username, "password" => $md5pass]]);
	if ($row) {
		$uid = makeUniqueId(10) . uniqid() . makeUniqueId(10);
		$db->insert("me_login", [
			"id_user"	=> $row['id'],
			"key"		=> $uid,
			"ip"		=> getIp(),
			"browser"	=> getHeaders("User-Agent"),
			"last_login"=> date("Y-m-d H:i:s")
			]);
		return $uid;
	}
	return "";
}
function registerNewUser($username, $password, $email, $status) {
	global $db;

	$row = $db->insert("me_users", [
		"username"	=> $username,
		"password"	=> md5($password),
		"email"		=> $email,
		"status"	=> $status
		]);

	if ($row > 0)
		return $row;
	return false;
}
function logoutByKey($key) {
	global $db;
	$row = $db->update("me_login", ["status" => 0], ["AND" => ["key" => $key, "browser" => getHeaders("User-Agent")]]);
	return $row;
}
function logoutAll($userid) {
	global $db;
	$row = $db->update("me_login", ["status" => 0], ["id_user" => $userid], ["status" => 0]);
	return $row;
}
function getUserById($id) {
	global $db;

	$user = $db->get("me_users", ["username", "email"], ["id" => $id]);
	if ($user) {
		$user["detail"] = getUserDetail($id);
		return $user;
	}
	return false;
}
function getUserDetail($id) {
	global $db;
	$row = $db->get("me_user_details", "*", ["id_user" => $id]);
	if ($row)
		return $row;
	return false;
}
function setUserDetail($id, $nama_depan, $nama_belakang, $deskripsi, $avatar, $gender) {
	global $db;

	$insert = $db->insert("me_user_details", [
		"id_user"		=> $id,
		"nama_depan"	=> $nama_depan,
		"nama_belakang"	=> $nama_belakang, 
		"deskripsi"		=> $deskripsi, 
		"avatar"		=> $avatar,
		"gender"		=> $gender
		]);
}
function updateAvatar($id, $avatar) {
	global $db;

	$db->update("me_user_details", [ "avatar" => $avatar],["id_user" => $id]);
}
function getUserByKey($key) {
	global $db;
	$user = false;
	$row = $db->get("me_login", "*", ["AND" => ["key" => $key, "browser" => getHeaders("User-Agent")]]);
	if ($row && isset($row["id_user"])) {
		$db->update("me_login", ["last_login"=> date("Y-m-d H:i:s")], ["key" => $key]);
		$user = $db->get("me_users", "*", ["id" => $row["id_user"]]);
	}
	return $user;
}
function getUserByKeyPass($key) {
	global $db;
	$user = false;
	$row = $db->get("me_login", "*", ["key" => $key]);
	if ($row && isset($row["id_user"])) {
		$db->update("me_login", ["last_login"=> date("Y-m-d H:i:s")], ["key" => $key]);
		$user = $db->get("me_users", "*", ["id" => $row["id_user"]]);
	}
	return $user;
}
function getUserIdByKey($key) {
	global $db;
	$row = $db->get("me_login", "id_user", ["AND" => ["key" => $key, "browser" => getHeaders("User-Agent")]]);
	return $row;
}
function getUserByName($username) {
	global $db;
	$user = $db->get("me_users", "*", ["username" => $username]);
	if ($user)
		return $user;
	return false;
}
function getUserByEmail($email) {
	global $db;
	$user = $db->get("me_users", "*", ["email" => $email]);
	if ($user)
		return $user;
	return false;
}


function getPosts($dat = "") {
	global $app;
	if ($dat != "")
		return $app->request->post($dat);
	return $app->request->post();
}

function getGets($dat = "") {
	global $app;
	if ($dat != "")
		return $app->request->get($dat);
	return $app->request->get();
}
function getHeaders($dat) {
	global $app;
	if ($dat != "")
		return $app->request->headers->get($dat);
	return $app->request->headers;
}
function getIp() {
	global $app;
	return $app->request->getIp();
}
function makeUniqueId($length = 5) {
	$str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_";

	$res = "";
	for ($i = 0; $i < $length; $i++) {
		$res .= $str[rand(0, strlen($str)-1)];
	}

	return $res;
}
function cropImage($destination) {
	/* Crop */
	$im;
	if (exif_imagetype($destination) == IMAGETYPE_JPEG)
		$im = imagecreatefromjpeg($destination);
	else if (exif_imagetype($destination) == IMAGETYPE_PNG)
		$im = imagecreatefrompng($destination);
	else
		return false;

	$ini_x_size = getimagesize($destination )[0];
	$ini_y_size = getimagesize($destination )[1];

	$crop_measure = min($ini_x_size, $ini_y_size);

	$px = 0; $py = 0;
	if ($ini_x_size > $ini_y_size) {
		$px = $ini_x_size / 2 - $crop_measure / 2;
	} else {
		$py = $ini_y_size / 2 - $crop_measure / 2;
	}

	$to_crop_array = array('x' => $px , 'y' => $py, 'width' => $crop_measure, 'height'=> $crop_measure);
	$thumb_im = imagecrop($im, $to_crop_array);

	$ext = explode('.', $_FILES['file']['name']);
	$ext = $ext[count($ext)-1];

	$cropFile = basename($destination, "." . $ext);
	$cropFile = $cropFile . "_crop." . $ext;
	$cropFile = AVATAR_DIR . $cropFile;

	imagejpeg($thumb_im, $cropFile, 80);
	return $cropFile;
}

$app->run();

?>