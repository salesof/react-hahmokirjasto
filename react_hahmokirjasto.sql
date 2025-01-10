-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 10.01.2025 klo 15:38
-- Palvelimen versio: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react_hahmokirjasto`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `armor`
--

CREATE TABLE `armor` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `effect` varchar(120) DEFAULT NULL,
  `character_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `armor`
--

INSERT INTO `armor` (`id`, `name`, `effect`, `character_id`) VALUES
(1, 'Maagin kaapu', '+5 suojaluokka ja +2 magiapistettä', 4),
(2, 'Ethereal Plate', 'Grants +4 armor', 5),
(3, 'Patchwork Tunic', '+2 armor', 6),
(4, 'Huopakaapu', '+2 suojaluokka & +2 magiapisteet', 10),
(8, 'testilakki', '', 4),
(12, 'Huopakaapu', 'Suojaluokka +2, magiapisteet +2', 30),
(16, 'Palahaarniska', 'Suojaluokka +2', 37);

-- --------------------------------------------------------

--
-- Rakenne taululle `character`
--

CREATE TABLE `character` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `character_class` varchar(64) NOT NULL,
  `level` smallint(6) DEFAULT NULL,
  `experience_stars` smallint(6) DEFAULT NULL,
  `max_experience_stars` smallint(6) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `hit_points` smallint(6) DEFAULT NULL,
  `current_hit_points` smallint(6) DEFAULT NULL,
  `armor_class` smallint(6) DEFAULT NULL,
  `armor_bonus` smallint(6) DEFAULT NULL,
  `balance_points` smallint(6) DEFAULT NULL,
  `current_balance_points` smallint(6) DEFAULT NULL,
  `magic_points` smallint(6) DEFAULT NULL,
  `magic_bonus` smallint(6) DEFAULT NULL,
  `current_magic_points` smallint(6) DEFAULT NULL,
  `base_speed` varchar(64) DEFAULT NULL,
  `base_accuracy` varchar(64) DEFAULT NULL,
  `strength` smallint(6) DEFAULT NULL,
  `strength_bonus` smallint(6) DEFAULT NULL,
  `dexterity` smallint(6) DEFAULT NULL,
  `dexterity_bonus` smallint(6) DEFAULT NULL,
  `constitution` smallint(6) DEFAULT NULL,
  `constitution_bonus` smallint(6) DEFAULT NULL,
  `intelligence` smallint(6) DEFAULT NULL,
  `intelligence_bonus` smallint(6) DEFAULT NULL,
  `wisdom` smallint(6) DEFAULT NULL,
  `wisdom_bonus` smallint(6) DEFAULT NULL,
  `charisma` smallint(6) DEFAULT NULL,
  `charisma_bonus` smallint(6) DEFAULT NULL,
  `weakness` varchar(64) DEFAULT NULL,
  `food` smallint(6) DEFAULT NULL,
  `copper` smallint(6) DEFAULT NULL,
  `silver` smallint(6) DEFAULT NULL,
  `gold` smallint(6) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `character`
--

INSERT INTO `character` (`id`, `name`, `character_class`, `level`, `experience_stars`, `max_experience_stars`, `image`, `hit_points`, `current_hit_points`, `armor_class`, `armor_bonus`, `balance_points`, `current_balance_points`, `magic_points`, `magic_bonus`, `current_magic_points`, `base_speed`, `base_accuracy`, `strength`, `strength_bonus`, `dexterity`, `dexterity_bonus`, `constitution`, `constitution_bonus`, `intelligence`, `intelligence_bonus`, `wisdom`, `wisdom_bonus`, `charisma`, `charisma_bonus`, `weakness`, `food`, `copper`, `silver`, `gold`, `user_id`) VALUES
(1, 'Mabrae Elanorin', 'Ritari', 2, 5, 10, 'ritari.png', 18, 18, 18, 2, 20, 20, 0, 0, 0, 'n20+2', 'n20+3', 18, 4, 14, 2, 16, 3, 12, 1, 10, 0, 15, 2, 'Pimeän pelko', 5, 50, 1, 0, 4),
(4, 'Franalath Trisqirelle', 'Velho', 10, 40, 51, 'velho.png', 35, 20, 12, 3, 25, 25, 20, 7, 27, 'n20+4', 'n20+2', 8, 2, 14, 4, 12, 1, 18, 4, 16, 3, 14, 2, 'Raudan polte', 3, 10, 5, 0, 4),
(5, 'Thiwarith Shaydark', 'Aarni', 3, 12, 15, 'aarni.jpg', 23, 23, 14, 2, 25, 25, 20, 3, 23, 'n20+3', 'n20+5', 12, 2, 12, 1, 16, 3, 14, 3, 18, 5, 2, 1, 'Piiran pelko', 5, 120, 0, 0, 5),
(6, 'Matti Meikäläinen', 'Sikopaimen', 2, 5, 12, 'sikopaimen.jpg', 20, 20, 15, 2, 23, 20, 0, 0, 0, 'n20+3', 'n20+3', 15, 3, 14, 3, 17, 5, 13, 4, 10, 1, 12, 2, 'Korkeanpaikan kammo', 5, 100, 0, 0, 4),
(7, 'Viirusilmä', 'Niekka', 1, NULL, NULL, 'niekka.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5),
(8, 'Eloise Wright', 'Eränkävijä', 3, NULL, NULL, 'erankavija.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6),
(9, 'Arianna Gardner', 'Ritari', 6, NULL, NULL, 'ritari2.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6),
(10, 'Prilaena Crajor', 'Velho', 1, 3, NULL, 'velho2.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, 4),
(11, 'Criamisa', 'Aarni', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7),
(27, 'Ulgur', 'Staalo', 1, NULL, NULL, '1734690350513-ai-generated-8094772_1920.jpg', 24, 24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'n20+2', NULL, 15, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 100, NULL, NULL, 4),
(30, 'Credia Havenglow', 'Velho', 3, 17, 31, '1734710102617-5c453434-c47b-48f7-876f-e7a5a8a35e87.PNG', 22, 22, 11, 2, 32, 32, 22, 2, 24, 'n20+4', 'n20+2', 7, 2, 14, 4, 11, 3, 16, 5, 13, 4, 16, 5, 'Korkeanpaikan kammo', 4, 163, NULL, 4, 4),
(37, 'Pitkäkorva', 'Niekka', 1, 3, 5, '1734711158146-animal-8556952_1280.jpg', 12, 12, 10, 2, 20, 20, NULL, NULL, NULL, 'n20+5', 'n20+2', 7, 3, 16, 5, 12, 3, 16, 5, 14, 5, 13, 3, 'Pimeän pelko', 5, 120, NULL, NULL, 13);

-- --------------------------------------------------------

--
-- Rakenne taululle `other_equipment`
--

CREATE TABLE `other_equipment` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `effect` varchar(120) DEFAULT NULL,
  `character_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `other_equipment`
--

INSERT INTO `other_equipment` (`id`, `name`, `effect`, `character_id`) VALUES
(1, 'Loitsukirja', NULL, 4),
(2, 'Parantava liemipullo', 'Palauttaa 10 kestopistettä', 4),
(3, 'Ring of Shadows', 'Increases magic points by 3', 5),
(4, 'Potion of Balance', 'Restores 10 balance points', 5),
(5, 'Bag of Feed', 'Attracts animals within a 10 ft radius', 6),
(6, 'Whetstone', 'Improves weapon damage by +1 for one day', 6),
(7, 'Loitsukirja', '', 10),
(8, 'Kynttilä', '', 10),
(11, 'Köysi', '', 10),
(12, 'kynttilä', '', 4),
(17, 'Loitsukirja', '', 30),
(19, 'Parantava vesileili', 'Palauttaa 1n6 vastaavan määrän kestopisteitä', 30),
(21, 'Soihtu', '', 37),
(23, 'Kynttilä', '', 30);

-- --------------------------------------------------------

--
-- Rakenne taululle `skill`
--

CREATE TABLE `skill` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `star_price` smallint(6) DEFAULT NULL,
  `magic_points` smallint(6) DEFAULT NULL,
  `character_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `skill`
--

INSERT INTO `skill` (`id`, `name`, `star_price`, `magic_points`, `character_id`) VALUES
(1, 'Fireball', NULL, 3, 4),
(2, 'Teleport', NULL, 2, 4),
(3, 'Identify', NULL, 2, 4),
(4, 'Shadow Strike', 1, NULL, 5),
(5, 'Ethereal Leap', 1, NULL, 5),
(6, 'Cloak of Darkness', NULL, 3, 5),
(7, 'Animal Whisperer', 1, NULL, 6),
(8, 'Mud Splash', 1, NULL, 6),
(9, 'Boar Charge', 2, NULL, 6),
(10, 'Parannus', NULL, 5, 10),
(11, 'Lannistus', NULL, 3, 10),
(12, 'Hoputus', NULL, 3, 10),
(15, 'testbeam', NULL, 3, 4),
(22, 'Lannistus', NULL, 3, 30),
(26, 'Parannus', NULL, 5, 30),
(27, 'Hoputus', NULL, 3, 30),
(28, 'Noidannuoli', NULL, 5, 30),
(29, 'Ruuan etsintä', 1, NULL, 37);

-- --------------------------------------------------------

--
-- Rakenne taululle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(64) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `about_me` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `avatar`, `about_me`) VALUES
(4, 'Sofia', 'sofia@mail.com', '$2b$10$CaYIywKuEhOBAkvEBF45PeKbQpzPWoNj/hxNMmhgeGPvRwqsl70We', '1734516241224-1734435046399-avatar.jpg', 'Olen vielä aloitteleva pöytäropettaja! Tykkään tehdä erityisesti taikuutta hyödyntäviä hahmoja :)'),
(5, 'Sopuli', 'sopuli@mail.fi', 'salasana', 'sopuli.jpg', 'Niekat best <3'),
(6, 'Soffe', 'soffe@mail.fi', 'salasana', NULL, NULL),
(7, 'Sulosiili', 'sulosiili@gmail.com', 'salasana', NULL, NULL),
(13, 'PupuTupuna', 'pupunen@mail.fi', '$2b$10$/hClaL5zJ1Fd3M6cnmIXueMLjcnUnElTkdoMq2609S83liAL0tY5C', '1734710957181-bunny-7651591_1280.jpg', 'Moi! Kutsukaa mua Pupuks vaan :>');

-- --------------------------------------------------------

--
-- Rakenne taululle `weapon`
--

CREATE TABLE `weapon` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `damage` varchar(64) NOT NULL,
  `critical` varchar(64) NOT NULL,
  `other_info` varchar(120) DEFAULT NULL,
  `character_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `weapon`
--

INSERT INTO `weapon` (`id`, `name`, `damage`, `critical`, `other_info`, `character_id`) VALUES
(1, 'Staff of Power', '1d6+2', '19-20', 'Grants spellcasting bonus', 4),
(3, 'Shadow Claws', '1d8+3', '18-20', 'Drains 5 balance points on hit', 5),
(4, 'Käärmeruoska', '1d6', '18-20', 'Mahdollista takertua vastustajaan', 6),
(5, 'Sauva', 'n4kp', '20', '2 käden ase', 10),
(9, 'Tikari', 'n6kp', '19-20', '', 10),
(10, 'Säilä', 'n8kp/n8tp', '19-20', 'Min ketteryys 12', 10),
(11, 'test sword', '1n6', '19-20', NULL, 4),
(15, 'Velhon sauva', 'n4kp/2n4tp', '20', '2 käden, Magia +2', 30),
(18, 'Pistopuukko', 'n4+3kp', '19-20', 'Osumaheittoon +2 käytettäessä', 30),
(19, 'Tarkka lyhytjousi', 'n6kp/2tp', '18-20', '2 käden', 30),
(20, 'Säilä', 'n8kp/n8tp', '19-20', 'Minimi ketteryys 12', 30),
(22, 'Puukko', 'n4kp', '20', '', 37);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `armor`
--
ALTER TABLE `armor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `character_id` (`character_id`);

--
-- Indexes for table `character`
--
ALTER TABLE `character`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `other_equipment`
--
ALTER TABLE `other_equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `character_id` (`character_id`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `character_id` (`character_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_user_email` (`email`),
  ADD UNIQUE KEY `ix_user_username` (`username`);

--
-- Indexes for table `weapon`
--
ALTER TABLE `weapon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `character_id` (`character_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `armor`
--
ALTER TABLE `armor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `character`
--
ALTER TABLE `character`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `other_equipment`
--
ALTER TABLE `other_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `weapon`
--
ALTER TABLE `weapon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `armor`
--
ALTER TABLE `armor`
  ADD CONSTRAINT `armor_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`);

--
-- Rajoitteet taululle `character`
--
ALTER TABLE `character`
  ADD CONSTRAINT `character_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Rajoitteet taululle `other_equipment`
--
ALTER TABLE `other_equipment`
  ADD CONSTRAINT `other_equipment_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`);

--
-- Rajoitteet taululle `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`);

--
-- Rajoitteet taululle `weapon`
--
ALTER TABLE `weapon`
  ADD CONSTRAINT `weapon_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `character` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
