-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 27 Jul 2015 pada 14.12
-- Versi Server: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jakpot`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `me_login`
--

CREATE TABLE IF NOT EXISTS `me_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `key` varchar(200) NOT NULL,
  `ip` varchar(25) NOT NULL,
  `browser` varchar(200) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `last_login` datetime NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data untuk tabel `me_login`
--

INSERT INTO `me_login` (`id`, `id_user`, `key`, `ip`, `browser`, `status`, `last_login`, `created`) VALUES
(1, 8, 'sSNGziWKcg555eab7e840fat4t1fwYcCE', '::1', 'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 5 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36', 1, '2015-05-22 06:08:50', '2015-05-22 04:07:26'),
(2, 8, 'Kw3D67Sm5g555eacb447330MHnocIik03', '::1', 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5', 1, '2015-05-22 06:12:36', '2015-05-22 04:12:36'),
(3, 8, 'Vpx5x2OA89555eacd51ce41MGuK261kEY', '::1', 'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 5 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36', 1, '2015-05-22 06:17:53', '2015-05-22 04:13:09'),
(4, 8, 'wRf8mNWHn7555eadffee5b4gsWelBQbNR', '::1', 'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 5 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36', 1, '2015-05-22 06:18:08', '2015-05-22 04:18:07'),
(5, 8, 'bY3jPgXFFl555eae12c11c4NQyabyQcc4', '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53', 1, '2015-05-22 09:26:46', '2015-05-22 04:18:26'),
(6, 8, 'UShqAAmffx555eda78763aaMu1Wm8ovsz', '192.168.88.19', 'Mozilla/5.0 (Linux; Android 4.3; HM 1S Build/JLS36C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.111 Mobile Safari/537.36', 1, '2015-05-22 09:29:04', '2015-05-22 07:27:52'),
(7, 8, 'L_3osW01Nu555ee2bc84731tNlvoddeKi', '192.168.88.39', 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53', 1, '2015-05-22 10:35:38', '2015-05-22 08:03:08'),
(8, 8, 'kSo50CZla9555f100139fb1wsfnB9JRjx', '192.168.88.39', 'Mozilla/5.0 (Linux; Android 4.2.2; Nexus 4 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19', 1, '2015-05-22 13:16:46', '2015-05-22 11:16:17'),
(9, 8, 'DHT4hU0CvU55b5deb1aa374Tu24BL4afZ', '::1', 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36', 1, '2015-07-27 09:40:39', '2015-07-27 07:33:05'),
(10, 8, 'K4NxcOlbem55b5f4400c7fdp9z6qrpMoJ', '::1', 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36', 1, '2015-07-27 11:40:08', '2015-07-27 09:05:04'),
(11, 8, 'qPi5Ui1tCY55b60a5aa2da3WnVhbZEdl1', '192.168.88.14', 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.20 Mobile Safari/537.36', 1, '2015-07-27 14:11:52', '2015-07-27 10:39:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `me_users`
--

CREATE TABLE IF NOT EXISTS `me_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '10',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data untuk tabel `me_users`
--

INSERT INTO `me_users` (`id`, `username`, `password`, `email`, `status`, `created`) VALUES
(8, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin@admin.com', 10, '2015-05-02 02:39:46'),
(9, 'eka', '79ee82b17dfb837b1be94a6827fa395a', 'eka@gmail.com', 10, '2015-05-02 12:10:48'),
(10, 'user', 'ee11cbb19052e40b07aac0ca060c23ee', 'user@user.vom', 10, '2015-05-21 10:31:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `me_user_details`
--

CREATE TABLE IF NOT EXISTS `me_user_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `nama_depan` varchar(200) NOT NULL,
  `nama_belakang` varchar(200) NOT NULL,
  `deskripsi` text NOT NULL,
  `avatar` text NOT NULL,
  `gender` varchar(6) NOT NULL,
  `xp` int(11) NOT NULL DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data untuk tabel `me_user_details`
--

INSERT INTO `me_user_details` (`id`, `id_user`, `nama_depan`, `nama_belakang`, `deskripsi`, `avatar`, `gender`, `xp`, `timestamp`) VALUES
(1, 8, 'Afief', 'Yona Ramadhana', 'programmer inmotion', 'admin_55b62008ddf22.PNG', 'pria', 110, '2015-07-27 12:11:52');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
