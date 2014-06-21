--
-- Database: `shaun`
--

-- --------------------------------------------------------

--
-- Table structure for table `wh_d_basis`
--

CREATE TABLE IF NOT EXISTS `wh_d_basis` (
  `u_id` int(5) NOT NULL,
  `time_of_reading` varchar(30) NOT NULL,
  `heart_rate` int(5) NOT NULL,
  `steps` int(5) NOT NULL,
  `calories` int(5) NOT NULL,
  `gsr` float NOT NULL,
  `skin_temp` int(5) NOT NULL,
  `air_temp` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wh_users`
--

CREATE TABLE IF NOT EXISTS `wh_users` (
  `u_id` int(5) NOT NULL,
  `name` int(30) NOT NULL,
  `age` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
