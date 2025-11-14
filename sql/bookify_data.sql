-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 02 nov. 2025 à 16:47
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bookify`
--

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `update_available_seats`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_available_seats` (IN `id` INT, IN `quantity` INT, IN `operation` VARCHAR(10))   BEGIN
    IF operation = 'INSERT' THEN
        UPDATE `event`
        SET event_seats = event_seats - quantity
        WHERE event_id = id;
    ELSEIF operation = 'CANCEL' THEN
        UPDATE `event`
        SET event_seats = event_seats + quantity
        WHERE event_id = id;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_pseudo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `admin_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'offline',
  `admin_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `Admin_admin_email_key` (`admin_email`),
  UNIQUE KEY `Admin_admin_pseudo_key` (`admin_pseudo`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_firstname`, `admin_lastname`, `admin_pseudo`, `admin_email`, `admin_password`, `admin_image`, `admin_role`, `admin_type`, `admin_status`, `admin_created`) VALUES
(1, 'Admin', 'Super', 'supadmin', 'admin@example.com', '$2a$10$wsTIwvChN/r4H9jEJR2gCe.xT/Yo7rsmftxwfuLz8NSf1JTITkpFG', '/profiles/user-1-1761881655284.jpg', 'admin', 'Super admin', 'offline', '2025-10-22 03:30:37.000');

-- --------------------------------------------------------

--
-- Structure de la table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `booking_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_event_id` int NOT NULL,
  `booking_user_id` int DEFAULT NULL,
  `booking_user_firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_user_lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_user_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_user_phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_price` int NOT NULL,
  `booking_quantity` int NOT NULL,
  `booking_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `booking_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`booking_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `booking`
--

INSERT INTO `booking` (`booking_id`, `booking_event_id`, `booking_user_id`, `booking_user_firstname`, `booking_user_lastname`, `booking_user_email`, `booking_user_phone`, `booking_price`, `booking_quantity`, `booking_status`, `booking_created`) VALUES
('BK1760928017755ckabvkpll', 2, NULL, 'ff', 'dd', '^^^^^@glgl.fr', '983383431', 0, 1, 'past', '2025-10-20 02:40:18.069'),
('BK1760928249626cvw19ifho', 2, NULL, 'ffkk', 'ddkkk', '^^^^^@glgl.fr', '2147483647', 0, 1, 'past', '2025-10-20 02:44:09.642'),
('BK1760928606723g4xhuluaz', 2, NULL, 'd', 'd', '^^^^^@glgl.fr', '983383431', 0, 1, 'past', '2025-10-20 02:50:06.926'),
('BK176092876648413fy6wmqd', 2, NULL, 'ff', 'dd', '^^^^^@glgl.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-20 02:52:46.527'),
('BK1760929100370nyjrel7kr', 2, NULL, 'ff', 'dd', '^^^^^@glgl.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-20 02:58:20.768'),
('BK176176529864103a2ai2l0', 4, 4, 'Romaric', 'Mion', 'test@test.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-29 19:14:58.783'),
('BK1761765429852ovancq4rz', 7, 4, 'Romaric', 'Mion', ' test@test.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-29 19:17:09.988'),
('BK1761767571683tgdlc45uh', 2, 4, 'Romaric', 'Mion', 'test@test.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-29 19:52:51.772'),
('BK1761793001364a0owvegd5', 2, 4, 'Romaric', 'Mion', 'test@test.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-30 02:56:41.649'),
('BK1761793285741vlceeuqo6', 3, 4, 'Romaric', 'Mion', 'test@test.fr', '09 83 38 34 31', 0, 1, 'past', '2025-10-30 03:01:25.750');

--
-- Déclencheurs `booking`
--
DROP TRIGGER IF EXISTS `trg_after_insert_booking`;
DELIMITER $$
CREATE TRIGGER `trg_after_insert_booking` AFTER INSERT ON `booking` FOR EACH ROW BEGIN
    CALL update_available_seats(NEW.booking_event_id, NEW.booking_quantity, 'INSERT');
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trg_after_update_booking`;
DELIMITER $$
CREATE TRIGGER `trg_after_update_booking` AFTER UPDATE ON `booking` FOR EACH ROW BEGIN
    IF NEW.booking_status = 'cancelled' AND OLD.booking_status != 'cancelled' THEN
        CALL update_available_seats(OLD.booking_event_id, OLD.booking_quantity, 'CANCEL');
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_price` int NOT NULL,
  `event_location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime(3) NOT NULL,
  `event_time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_organizer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_seats` int NOT NULL,
  `event_seats_start` int NOT NULL,
  `event_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sketch',
  `event_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`event_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `event`
--

INSERT INTO `event` (`event_id`, `event_name`, `event_description`, `event_price`, `event_location`, `event_address`, `event_date`, `event_time`, `event_category`, `event_organizer`, `event_image`, `event_seats`, `event_seats_start`, `event_status`, `event_created`) VALUES
(1, 'Festival Électro Summer', 'Le plus grand festival de musique électronique de l\'été ! Avec plus de 50 artistes internationaux, 3 scènes et une ambiance inoubliable. Venez danser du coucher au lever du soleil sur les mei', 0, 'Parc des Expositions', '123 Avenue de la Musique, Paris 75001', '2025-07-15 00:00:00.000', '18:00:00', 'Festival', 'EventPro Productions', 'festival.jpg', 4999, 5000, 'sketch', '2025-10-18 22:28:01.254'),
(2, 'Conférence Tech Innovation 2025', 'Découvrez les dernières innovations technologiques avec les leaders de l\'industrie. Au programme : IA, blockchain, cloud computing et développement durable. Networking, workshops et keynotes ', 0, 'Centre de Congrès', '45 Rue de l\'Innovation, Lyon 69002', '2025-06-20 00:00:00.000', '09:00:00', 'Conférence', 'TechConnect', 'conference.jpg', 799, 800, 'sketch', '2025-10-18 22:28:01.254'),
(3, 'Concert Rock Legends', 'Une soirée inoubliable avec les plus grandes légendes du rock ! Revivez les plus grands hits dans une ambiance électrique. Son premium, effets visuels spectaculaires et surprises garanties.', 0, 'Zénith Arena', '78 Boulevard du Spectacle, Marseille 13001', '2025-08-05 00:00:00.000', '20:00:00', 'Concert', 'Live Nation France', 'concert.jpg', 3498, 3500, 'sketch', '2025-10-18 22:28:01.254'),
(4, 'Match de Football - Finale', 'La finale tant attendue du championnat ! Assistez au match décisif dans une ambiance de feu. Supporters, chants, émotions fortes garanties. Ne manquez pas cet événement historique.', 0, 'Stade Municipal', '12 Avenue des Sports, Bordeaux 33000', '2025-06-30 00:00:00.000', '21:00:00', 'Sport', 'Ligue de Football', 'sport.jpg', 14999, 15000, 'sketch', '2025-10-18 22:28:01.254'),
(5, 'Jazz & Soul Night', 'Une soirée intimiste dédiée au jazz et à la soul music. Laissez-vous porter par des mélodies envoûtantes dans un cadre raffiné. Cocktails premium et ambiance feutrée.', 0, 'Le Blue Note Club', '89 Rue du Jazz, Nice 06000', '2025-07-10 00:00:00.000', '19:30:00', 'Concert', 'Jazz Productions', 'concert.jpg', 249, 250, 'sketch', '2025-10-18 22:28:01.254'),
(6, 'Salon de l\'Entrepreneuriat', 'Le rendez-vous incontournable des entrepreneurs et startups. Conférences, ateliers pratiques, speed-networking et rencontres avec des investisseurs. Boostez votre business !', 0, 'Palais des Congrès', '34 Place de l\'Entreprise, Toulouse 31000', '2025-09-12 00:00:00.000', '10:00:00', 'Conférence', 'Business Connect', 'conference.jpg', 999, 1000, 'sketch', '2025-10-18 22:28:01.254'),
(7, 'Festival des Arts de la Rue', 'Trois jours de spectacles gratuits et performances artistiques ! Cirque, théâtre de rue, concerts live, arts visuels. Pour toute la famille dans une ambiance festive et colorée.', 0, 'Centre-Ville', 'Place de la République, Nantes 44000', '2025-08-20 00:00:00.000', '14:00:00', 'Festival', 'Ville de Nantes', 'festival.jpg', 9999, 1000, 'sketch', '2025-10-18 22:28:01.254'),
(8, 'Tournoi de Tennis International', 'Les meilleurs joueurs mondiaux s\'affrontent sur terre battue. Assiste aux matches les plus intenses et vibrez avec les champions. Ambiance garantie !', 0, 'Tennis Club Premium', '56 Route du Sport, Strasbourg 67000', '2025-10-05 00:00:00.000', '11:00:00', 'Sport', 'Tennis Federation', 'sport.jpg', 4999, 5000, 'sketch', '2025-10-18 22:28:01.254');

-- --------------------------------------------------------

--
-- Structure de la table `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `logs_id` int NOT NULL AUTO_INCREMENT,
  `logs_description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_admin_id` int NOT NULL,
  `logs_admin_firstname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_admin_lastname` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_admin_pseudo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_admin_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_admin_image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_admin_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`logs_id`),
  UNIQUE KEY `Logs_logs_admin_email_key` (`logs_admin_email`),
  UNIQUE KEY `Logs_logs_admin_pseudo_key` (`logs_admin_pseudo`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `logs`
--

INSERT INTO `logs` (`logs_id`, `logs_description`, `logs_admin_id`, `logs_admin_firstname`, `logs_admin_lastname`, `logs_admin_pseudo`, `logs_admin_email`, `logs_admin_image`, `logs_admin_type`, `logs_created`) VALUES
(1, 'test', 1, 'test', 'test', 'test', 'test', '/profiles/user-1-1761881655284.jpg', 'Super admin', '2025-11-02 04:11:21.000');

-- --------------------------------------------------------

--
-- Structure de la table `notificationadmin`
--

DROP TABLE IF EXISTS `notificationadmin`;
CREATE TABLE IF NOT EXISTS `notificationadmin` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_admin_id` int NOT NULL,
  `notification_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_read` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no',
  `notification_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`notification_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notificationadmin`
--

INSERT INTO `notificationadmin` (`notification_id`, `notification_admin_id`, `notification_type`, `notification_title`, `notification_message`, `notification_read`, `notification_created`) VALUES
(1, 1, 'Système', 'test', 'test', 'no', '2025-11-02 04:10:08.000'),
(2, 1, 'Système', 'test', 'test', 'no', '2025-11-02 04:17:51.000');

-- --------------------------------------------------------

--
-- Structure de la table `organization`
--

DROP TABLE IF EXISTS `organization`;
CREATE TABLE IF NOT EXISTS `organization` (
  `organization_id` int NOT NULL AUTO_INCREMENT,
  `organization_user_id` int NOT NULL,
  `organization_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization_description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization_image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `organization_category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`organization_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `ticket_event_id` int NOT NULL,
  `ticket_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_price` int NOT NULL,
  `ticket_available` int NOT NULL,
  `ticket_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`ticket_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ticket`
--

INSERT INTO `ticket` (`ticket_id`, `ticket_event_id`, `ticket_name`, `ticket_description`, `ticket_price`, `ticket_available`, `ticket_created`) VALUES
(1, 1, 'Pass 1 Jour', '', 65, 1200, '2025-10-18 22:28:01.285'),
(2, 1, 'Pass 3 Jours', '', 150, 800, '2025-10-18 22:28:01.285'),
(3, 1, 'VIP Premium', '', 250, 200, '2025-10-18 22:28:01.285'),
(4, 2, 'Pass Standard', '', 120, 400, '2025-10-18 22:28:01.285'),
(5, 2, 'Pass Premium + Workshops', '', 200, 150, '2025-10-18 22:28:01.285'),
(6, 3, 'Fosse', '', 85, 1000, '2025-10-18 22:28:01.285'),
(7, 3, 'Gradin', '', 55, 2000, '2025-10-18 22:28:01.285'),
(8, 3, 'Carré Gold', '', 150, 500, '2025-10-18 22:28:01.285'),
(9, 4, 'Tribune Latérale', '', 35, 8000, '2025-10-18 22:28:01.285'),
(10, 4, 'Tribune Centrale', '', 60, 5000, '2025-10-18 22:28:01.285'),
(11, 4, 'Loge VIP', '', 180, 200, '2025-10-18 22:28:01.285'),
(12, 5, 'Standard', '', 45, 150, '2025-10-18 22:28:01.285'),
(13, 5, 'Table VIP', '', 90, 50, '2025-10-18 22:28:01.285'),
(14, 6, 'Pass Visiteur', '', 25, 700, '2025-10-18 22:28:01.285'),
(15, 6, 'Pass Exposant', '', 150, 100, '2025-10-18 22:28:01.285'),
(16, 7, 'Entrée Libre', '', 0, 10000, '2025-10-18 22:28:01.285'),
(17, 8, 'Court Central', '', 75, 2000, '2025-10-18 22:28:01.285'),
(18, 8, 'Courts Annexes', '', 40, 2500, '2025-10-18 22:28:01.285'),
(19, 8, 'Loge Prestige', '', 200, 100, '2025-10-18 22:28:01.285');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_pseudo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_isActived` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no',
  `user_role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `user_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'offline',
  `user_created` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`user_id`, `user_firstname`, `user_lastname`, `user_pseudo`, `user_email`, `user_phone`, `user_password`, `user_image`, `user_isActived`, `user_role`, `user_status`, `user_created`) VALUES
(1, 'test', 'test', '', 'test@test.test', '0606060606', '$2a$10$VMcZaAnUAypEeM7Qx7L4/ucAs9jcvDGd6VNNalrsL83o6qsOANx0m', '', 'no', 'user', 'offline', '2025-10-07 02:15:22.000'),
(2, 'ddd', 'dddddd', '', 'ss^^^^^@glgl.fr', '09 83 38 34 31', '$2b$10$baJLLbgpfK2MQSPFRJydau0It1COqOVo/Hut8rYfV.dV6.ITkVnzG', '', 'no', 'user', 'offline', '2025-10-28 20:31:01.441'),
(3, 'dqdqdd', 'dqdqdd', '', 'test@test.frd', '09 83 38 34 31', '$2b$10$5CAhQJA3VCCl3HGIbsoMU.1BJTmpAwmnhayn6ifiq52/yeJLQ5MCO', '', 'no', 'user', 'offline', '2025-10-28 20:40:37.507'),
(4, 'Romaric', 'Test', '', 'test@test.fr', '09 83 38 34 31', '$2a$10$w51SsVadrN7unrb0ottu/.gscVpoizx/A6Q7PuUV8SFcqD7PDCx7G', '/profiles/user-4-1761706600651.png', 'no', 'user', 'offline', '2025-10-28 23:13:34.207'),
(5, 'test', 'test', '', 'test@tesddddt.fr', '09 83 38 34 31', '$2b$10$lgI3a7yMIJKwv/75NElQ7er0CLGuE47cDiN1.yd/hhNgpyL6Fta9u', '', 'no', 'user', 'offline', '2025-10-28 23:19:03.292'),
(9, 'ff', 'dd', '', '^^^^^@glgl.fr', '09 83 38 34 31', '$2b$10$UANM.XgpcqBt/feibdQXNup/LhHO6IDjjWgYGscJaSDSQQzaBhKwS', '', 'no', 'user', 'offline', '2025-10-28 23:41:49.493'),
(10, 'ff', 'dddd', '', 'tedddst@tesdt.fr', '06 51 45 55 44', '$2b$10$doi36HfPvUzC0N8xGbPcIuIjpunrPm79MxzFo0cZc0/jWAFjxjNWS', '', 'no', 'user', 'offline', '2025-10-28 23:46:35.007');

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('c4aed9d7-5422-40ff-8d2f-a41a4817bcb9', '7cb07a1bfd692865ae488f247d5325e1386ee0654862792b4c394e3c42a6c004', '2025-10-18 16:25:20.731', '20251018162520_init', NULL, NULL, '2025-10-18 16:25:20.714', 1),
('b80457fb-905c-46e5-b777-50267555b6ea', 'eb510f8f6d7ea213b523fc64a50b7ca2be5691eb60660b2109444df1cae67aa0', '2025-10-18 20:08:10.954', '20251018200810_init', NULL, NULL, '2025-10-18 20:08:10.922', 1);

DELIMITER $$
--
-- Évènements
--
DROP EVENT IF EXISTS `update_past_bookings`$$
CREATE DEFINER=`root`@`localhost` EVENT `update_past_bookings` ON SCHEDULE EVERY 1 DAY STARTS '2025-10-30 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
UPDATE booking as b
  JOIN event e ON b.booking_event_id = e.event_id
  SET b.booking_status = 'past'
  WHERE e.event_date < NOW()
    AND b.booking_status != 'past';
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
