-- phpMyAdmin SQL Dump
-- version 3.5.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 25, 2014 at 06:19 PM
-- Server version: 5.5.29-log
-- PHP Version: 5.3.20

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `shaun`
--

-- --------------------------------------------------------

--
-- Table structure for table `wh_d_basis`
--

CREATE TABLE IF NOT EXISTS `wh_d_basis` (
  `u_id` int(5) NOT NULL,
  `date_epoch` varchar(15) NOT NULL,
  `date_human` varchar(30) NOT NULL,
  `heartrate` varchar(8) NOT NULL,
  `steps` varchar(8) NOT NULL,
  `calories` varchar(8) NOT NULL,
  `gsr` varchar(8) NOT NULL,
  `skin_temp` varchar(8) NOT NULL,
  `air_temp` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_d_lumo`
--

CREATE TABLE IF NOT EXISTS `wh_d_lumo` (
  `u_id` int(5) NOT NULL,
  `date_epoch` varchar(15) NOT NULL,
  `date_human` varchar(30) NOT NULL,
  `pct` varchar(4) NOT NULL,
  `act` varchar(10) NOT NULL,
  `delta` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_d_moves_acts`
--

CREATE TABLE IF NOT EXISTS `wh_d_moves_acts` (
  `u_id` int(5) NOT NULL,
  `time_start` varchar(30) NOT NULL,
  `time_end` varchar(30) NOT NULL,
  `type` varchar(10) NOT NULL,
  `act` varchar(20) NOT NULL,
  `duration` varchar(10) NOT NULL,
  `distance` varchar(10) NOT NULL,
  `steps` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_d_moves_places`
--

CREATE TABLE IF NOT EXISTS `wh_d_moves_places` (
  `u_id` int(5) NOT NULL,
  `time_start` varchar(30) NOT NULL,
  `time_end` varchar(30) NOT NULL,
  `type` varchar(10) NOT NULL,
  `place_id` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lat` varchar(20) NOT NULL,
  `lon` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_d_moves_trackpoints`
--

CREATE TABLE IF NOT EXISTS `wh_d_moves_trackpoints` (
  `u_id` int(5) NOT NULL,
  `time` varchar(30) NOT NULL,
  `lat` varchar(20) NOT NULL,
  `lon` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_users`
--

CREATE TABLE IF NOT EXISTS `wh_users` (
  `u_id` int(5) NOT NULL,
  `name` varchar(30) NOT NULL,
  `age` int(2) NOT NULL,
  `begin_date` varchar(15) NOT NULL,
  `basis_u` varchar(30) NOT NULL,
  `basis_p` varchar(30) NOT NULL,
  `lumo_u` varchar(30) NOT NULL,
  `lumo_p` varchar(30) NOT NULL,
  `lumo_api` varchar(200) NOT NULL,
  `moves_u` varchar(30) NOT NULL,
  `moves_p` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_user_goals`
--

CREATE TABLE IF NOT EXISTS `wh_user_goals` (
  `u_id` int(5) NOT NULL,
  `stat_name` varchar(30) NOT NULL,
  `min` float NOT NULL,
  `max` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
