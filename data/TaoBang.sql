CREATE DATABASE  IF NOT EXISTS `ebook` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ebook`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: shuttle.proxy.rlwy.net    Database: ebook
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reason` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `blacklist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklist`
--

LOCK TABLES `blacklist` WRITE;
/*!40000 ALTER TABLE `blacklist` DISABLE KEYS */;
INSERT INTO `blacklist` VALUES (1,3,'MÀY BỊ NGU','2025-04-13 14:43:40'),(2,2,'Khóa tài khoản của người dùng tuan','2025-04-13 14:47:39');
/*!40000 ALTER TABLE `blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_genres`
--

DROP TABLE IF EXISTS `card_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_genres` (
  `card_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`card_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `card_genres_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `card_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`genre_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_genres`
--

LOCK TABLES `card_genres` WRITE;
/*!40000 ALTER TABLE `card_genres` DISABLE KEYS */;
INSERT INTO `card_genres` VALUES (1,1),(2,2),(1,3),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(15,3),(16,3),(16,5),(17,6),(18,6);
/*!40000 ALTER TABLE `card_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `image` text,
  `content` text,
  `link` text,
  `hashtags` text,
  `views` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,'Attack on Titan – Mùa 1','https://m.media-amazon.com/images/I/61t9ie31jgL._AC_UF350,350_QL50_.jpg','Tác giả: Isayama Hajime','https://vi.wikipedia.org/wiki/%C4%90%E1%BA%A1i_chi%E1%BA%BFn_Titan',NULL,167),(2,'Conan - V1','https://product.hstatic.net/200000343865/product/1_36e3e690f3e947a8b10fbfc4ed2638c5_304c807bdc744840900ad73be1b0fb15_master.jpg','Tác giả: Aoyama Gōshō','https://vi.wikipedia.org/wiki/Th%C3%A1m_t%E1%BB%AD_l%E1%BB%ABng_danh_Conan',NULL,101),(7,'Thế Giới Ngọc Rồng – Frieza Hồi Sinh','https://upload.wikimedia.org/wikipedia/vi/6/6a/DBZ_THE_MOVIE_NO._15.png','Akira Toriyama','',NULL,NULL),(8,'Naruto Full Màu','https://images-cdn.ubuy.co.in/65b67da8639ed7538f6d61d9-naruto-1.jpg','Kishimoto Masashi','https://i.hinhhinh.com/ebook/190x247/naruto-full-color-edition_1562333377.jpg?gt=hdfgdfg&mobile=2',NULL,NULL),(9,'Thanh Gươm Diệt Quỷ','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-P7mRlKiYCCTIibZfUYPhdpEom1umQY8MBw&s','Gotouge Koyoharu','',NULL,NULL),(10,'Magi: Bậc Thầy Pháp Thuật','https://2.bp.blogspot.com/-SdskjeWFvtQ/WoGHlCEJnJI/AAAAAAAACSE/kfM2Io8rYmUuJ_59ZkSA2WOobf4JFuUPgCHMYCw/s0/img819292f813854fb8663329484b2e3b4e.jpg','Ohtaka Shinobu','',NULL,NULL),(11,'Fairy Tail','https://i.pinimg.com/474x/65/86/f6/6586f69c96b69a60bcfc25d229b6e67e.jpg','Hiro Mashima','',NULL,NULL),(12,'Mashle: Magic And Muscles','https://static0.srcdn.com/wordpress/wp-content/uploads/2024/03/mashle-magic-and-muscles-tv-poster.jpg','Hajime Komoto','',NULL,NULL),(13,'Shin Seiki Evangelion','https://i.pinimg.com/474x/ac/e6/e2/ace6e26b5d567c141a0ac19a0388ef51.jpg','Đang Cập Nhật','',NULL,NULL),(14,'Học Viện Anh Hùng','https://i.pinimg.com/736x/bd/a7/0c/bda70ca81b0bd76c854309c685c98063.jpg','Tác giả: Horikoshi Kohei','',NULL,NULL),(15,' Onepunch Man','https://static2.vieon.vn/vieplay-image/poster_v4/2022/04/20/fwwhh0oa_660x946-opm1.jpg','Murata Yuusuke, One','',NULL,NULL),(16,' Toriko - Thợ Săn Ẩm Thực','https://upload.wikimedia.org/wikipedia/vi/b/b9/Toriko_DVD_01_cover.jpg','Shimabukuro Mitsutoshi','',NULL,NULL),(17,'Thần Chết Ichigo','https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-bleach-su-gia-than-chet.jpg','Tite Kubo','',NULL,NULL),(18,'Vua trò chơi Yugioh','https://bizweb.dktcdn.net/thumb/1024x1024/100/386/441/products/img474-u335-d20161129-t094556-388508.jpg?v=1594794484423','Takahashi Kazuki','',NULL,NULL);
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `chapter_number` int NOT NULL,
  `chapter_title` varchar(255) DEFAULT NULL,
  `content` text,
  `image_folder` text,
  `image_count` int DEFAULT '0',
  `rating` float DEFAULT '0',
  `comment_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `card_id` (`card_id`,`chapter_number`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (1,1,1,'Nay đã 2000 năm','dsfsd','https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter1',55,0,12),(3,1,2,'Ngày hôm đó',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter2',45,0,0),(6,1,3,'Đêm trước ngày giải tán',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter3',43,0,1),(7,1,4,'Cuộc chiến đầu tiên',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter4',50,0,0),(8,1,5,'Ánh sáng lóe lên trong cơn tuyệt vọng',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter5',40,0,0),(9,1,6,'Thế giới qua lăng kính của một cô gái nhỏ',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter6',40,0,0),(10,1,7,'Lưỡi gươm ngắn',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter7',35,0,0),(11,1,8,'Gầm thét',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter8',36,0,0),(12,2,1,'Thám tử teo nhỏ',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter1',40,0,0),(13,2,2,'33324',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter2',40,0,0),(14,2,3,'3',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter3',40,0,1),(15,2,4,'fd',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter4',40,0,0),(16,2,5,'433',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter5',40,0,0),(17,2,6,'dfds',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter6',40,0,0),(18,2,7,'334',NULL,'https://github.com/chlorinebot/image-comic/tree/main/images/conan/conan_v1/chapter7',40,0,0),(19,1,9,'fasfbbbbcxv','dfasf','https://github.com/chlorinebot/image-comic/tree/main/images/attackontitan/chapter1',44,0,0);
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_replies`
--

DROP TABLE IF EXISTS `comment_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_replies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL,
  `like_count` int DEFAULT '0',
  `dislike_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comment_replies_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `comment_replies_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_replies`
--

LOCK TABLES `comment_replies` WRITE;
/*!40000 ALTER TABLE `comment_replies` DISABLE KEYS */;
INSERT INTO `comment_replies` VALUES (3,3,3,'? mlem mlem','2025-04-07 15:43:08',0,0),(4,4,3,'sàasdfasf','2025-04-07 15:43:15',0,0),(5,3,3,'? mlem mlem','2025-04-07 15:43:27',0,0),(6,3,3,'? mlem mlem','2025-04-07 15:45:01',0,0),(7,3,3,'? mlem mlem','2025-04-07 15:45:49',0,0),(9,4,3,'fasdfasfd','2025-04-07 16:13:48',0,0),(10,4,3,'sdfasdfasdf','2025-04-07 16:13:57',0,0),(11,3,3,'?sdfsadfasd','2025-04-07 16:14:10',0,0),(12,8,3,'fadsfas','2025-04-07 16:40:52',0,0),(13,8,3,'fadsfas','2025-04-07 16:40:59',0,0),(14,7,3,'fadsfasf','2025-04-07 16:41:56',0,0),(15,8,3,'fasdf','2025-04-07 16:55:45',0,0),(16,8,3,'ádfasfasfasfasfasfasfd','2025-04-07 16:55:53',0,0),(17,3,3,'sadfasfasf','2025-04-07 17:05:18',0,0),(18,5,3,'địt mẹ mày','2025-04-07 17:07:51',0,0),(20,5,3,'adsfasfsfasfấdfas','2025-04-07 17:21:58',0,0),(21,4,3,'àasf','2025-04-07 17:22:08',0,0),(24,7,3,'fasfafasfàafsd','2025-04-07 17:27:57',0,0),(28,7,3,'ầdsfasdfasfasffdasfasf','2025-04-08 05:55:40',0,0),(31,8,2,'mày ngu','2025-04-08 06:04:23',0,0),(33,8,2,'thằng ngu','2025-04-08 06:55:10',0,0),(34,9,2,'thawfnng óc','2025-04-08 06:55:18',0,0),(35,9,3,'ầvcxsvcxv','2025-04-08 06:56:02',0,0),(36,10,2,'adfsfasf','2025-04-08 07:05:22',0,0),(37,8,2,'faasfasfsafasf','2025-04-08 07:05:26',0,0),(38,8,3,'bbbb','2025-04-08 07:08:53',0,0),(39,10,3,'ádfasfas333','2025-04-08 07:11:57',0,0),(40,9,3,'ádfas333123','2025-04-08 07:16:08',0,0),(41,10,3,'dsgdsgsdg','2025-04-08 07:18:51',0,0),(42,7,3,'fsadfsfasfsafas','2025-04-08 07:18:57',0,0),(43,8,2,'gfdsgdgf445335','2025-04-08 07:24:07',0,0),(44,2,5,'? lô con cặc','2025-04-13 11:17:30',0,0);
/*!40000 ALTER TABLE `comment_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime NOT NULL,
  `like_count` int DEFAULT '0',
  `dislike_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `chapter_id` (`chapter_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,3,1,'alo','2025-04-07 14:13:23',0,0),(3,3,1,'hello','2025-04-07 14:13:49',0,0),(4,3,1,'thì sao','2025-04-07 15:02:22',0,0),(5,3,1,'t','2025-04-07 15:12:23',0,0),(6,3,1,'gsdgsdfg','2025-04-07 15:12:33',0,0),(7,3,1,'?? heheehdfasdf','2025-04-07 15:33:51',0,0),(8,3,1,'fgsfaafasfd','2025-04-07 15:43:21',0,0),(9,2,1,'gfgsfa','2025-04-08 06:04:12',0,0),(10,2,1,'àasfsafasfd','2025-04-08 06:04:55',0,0),(11,3,6,'dgdgdg','2025-04-10 16:58:12',0,0),(12,3,1,'tẻ233242','2025-04-13 03:34:46',0,0),(13,5,1,'Ý là truyện hay lắm luôn á','2025-04-13 11:17:05',0,0),(14,7,14,'truyện hay quá','2025-04-13 11:26:10',0,0),(15,5,1,'thy dái nè','2025-04-13 14:49:18',0,0);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `card_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`card_id`),
  KEY `idx_card_id` (`card_id`),
  CONSTRAINT `fk_favorites_card_id` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorites_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (2,1),(3,1),(2,2),(3,2),(5,2),(6,7),(5,8),(2,9),(2,10),(5,10),(5,11),(6,11),(7,11),(5,12),(3,13),(6,13),(7,13),(2,14),(6,14),(3,15),(2,17);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(50) NOT NULL,
  PRIMARY KEY (`genre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Hậu tận thế'),(2,'Trinh thám'),(3,'Hành động viễn tưởng'),(4,'Đam mỹ'),(5,'Ẩm thực'),(6,'Khám phá');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `comment_id` int DEFAULT NULL,
  `chapter_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `notification_type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `received_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `user_id` (`user_id`),
  KEY `comment_id` (`comment_id`),
  KEY `chapter_id` (`chapter_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE SET NULL,
  CONSTRAINT `notifications_chk_1` CHECK ((`notification_type` in (_utf8mb4'comment_reply',_utf8mb4'new_chapter')))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `rating` int NOT NULL,
  `rated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_chapter` (`user_id`,`chapter_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_chapter_id` (`chapter_id`),
  CONSTRAINT `fk_ratings_chapter_id` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ratings_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,2,1,5,'2025-04-06 15:24:47'),(9,2,3,5,'2025-04-06 15:31:31'),(13,2,7,1,'2025-04-06 15:41:06'),(18,2,6,1,'2025-04-06 15:32:26'),(19,2,8,4,'2025-04-06 15:41:12'),(20,2,9,5,'2025-04-06 15:34:52'),(23,2,15,3,'2025-04-06 15:42:20'),(24,2,14,1,'2025-04-06 15:42:41'),(25,2,12,3,'2025-04-06 15:42:52'),(26,2,16,3,'2025-04-06 15:43:12'),(30,2,13,2,'2025-04-06 15:46:23'),(31,2,17,4,'2025-04-06 15:48:56'),(32,2,18,3,'2025-04-06 15:49:04'),(33,3,15,4,'2025-04-06 15:53:24'),(34,3,12,2,'2025-04-06 16:14:52'),(35,3,13,3,'2025-04-06 16:14:56'),(36,3,14,2,'2025-04-06 16:15:07'),(37,3,16,1,'2025-04-07 03:30:38'),(38,3,1,5,'2025-04-07 03:52:42'),(39,3,7,2,'2025-04-10 17:56:39'),(40,3,8,3,'2025-04-10 17:56:43'),(41,3,9,4,'2025-04-10 17:56:54'),(42,3,10,5,'2025-04-10 17:56:59'),(43,3,11,5,'2025-04-10 17:57:04'),(44,3,19,4,'2025-04-10 17:57:10'),(45,3,3,4,'2025-04-10 17:57:23'),(46,3,6,5,'2025-04-10 17:57:28'),(47,5,12,2,'2025-04-13 11:13:55'),(48,5,13,5,'2025-04-13 11:14:00'),(49,5,14,4,'2025-04-13 11:14:05'),(50,5,15,2,'2025-04-13 11:14:09'),(51,5,16,3,'2025-04-13 11:14:14'),(52,5,17,5,'2025-04-13 11:14:17'),(53,5,18,4,'2025-04-13 11:14:21'),(54,5,1,2,'2025-04-13 11:14:59'),(55,5,3,5,'2025-04-13 11:15:02'),(56,5,6,5,'2025-04-13 11:15:06'),(57,5,7,3,'2025-04-13 11:15:09'),(58,5,8,5,'2025-04-13 11:15:13'),(59,5,9,3,'2025-04-13 11:15:17'),(60,5,10,4,'2025-04-13 11:15:20'),(61,5,11,5,'2025-04-13 11:15:23'),(62,5,19,1,'2025-04-13 11:15:27'),(63,7,12,4,'2025-04-13 11:25:44'),(64,7,13,2,'2025-04-13 11:25:54'),(65,7,14,3,'2025-04-13 18:02:00'),(66,7,3,4,'2025-04-13 18:01:36'),(67,7,8,5,'2025-04-13 18:01:41'),(68,7,11,4,'2025-04-13 18:01:46'),(69,7,15,4,'2025-04-13 18:02:05');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reading_history`
--

DROP TABLE IF EXISTS `reading_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reading_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `card_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `read_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_card_id` (`card_id`),
  KEY `idx_chapter_id` (`chapter_id`),
  CONSTRAINT `reading_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reading_history_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reading_history_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reading_history`
--

LOCK TABLES `reading_history` WRITE;
/*!40000 ALTER TABLE `reading_history` DISABLE KEYS */;
INSERT INTO `reading_history` VALUES (40,3,1,1,'2025-04-14 00:20:23'),(42,2,1,1,'2025-04-10 12:43:19'),(43,3,1,3,'2025-04-13 04:02:05'),(44,3,1,6,'2025-04-13 04:02:08'),(45,3,1,7,'2025-04-13 04:02:07'),(46,3,1,8,'2025-04-13 04:02:07'),(47,3,1,9,'2025-04-13 04:02:07'),(48,3,1,10,'2025-04-13 04:02:08'),(49,3,1,11,'2025-04-10 17:57:03'),(50,3,1,19,'2025-04-10 17:57:07'),(51,3,2,12,'2025-04-13 17:16:33'),(52,3,2,13,'2025-04-10 19:05:30'),(53,3,2,14,'2025-04-13 17:13:15'),(54,3,2,15,'2025-04-13 17:16:56'),(55,3,2,16,'2025-04-10 19:05:40'),(56,5,2,12,'2025-04-13 14:49:03'),(57,5,2,13,'2025-04-13 11:13:58'),(58,5,2,14,'2025-04-13 11:14:02'),(59,5,2,15,'2025-04-13 11:14:07'),(60,5,2,16,'2025-04-13 11:14:11'),(61,5,2,17,'2025-04-13 11:14:15'),(62,5,2,18,'2025-04-13 11:14:18'),(63,5,1,1,'2025-04-13 14:49:10'),(64,5,1,3,'2025-04-13 11:15:01'),(65,5,1,6,'2025-04-13 11:15:04'),(66,5,1,7,'2025-04-13 11:15:07'),(67,5,1,8,'2025-04-13 11:15:11'),(68,5,1,9,'2025-04-13 11:15:15'),(69,5,1,10,'2025-04-13 11:15:18'),(70,5,1,11,'2025-04-13 11:15:21'),(71,5,1,19,'2025-04-13 11:15:24'),(72,7,2,12,'2025-04-14 00:05:45'),(73,7,2,13,'2025-04-13 11:25:50'),(74,7,2,14,'2025-04-13 18:01:59'),(75,7,1,3,'2025-04-13 18:01:34'),(76,7,1,8,'2025-04-13 18:01:39'),(77,7,1,11,'2025-04-13 18:01:45'),(78,7,2,15,'2025-04-13 18:02:02'),(79,7,1,1,'2025-04-14 00:16:55');
/*!40000 ALTER TABLE `reading_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `reported_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','processed') NOT NULL DEFAULT 'pending',
  `processed_at` datetime DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,'Test','Test content',NULL,'2025-04-10 12:39:50','pending',NULL,NULL),(2,1,'lỗi','lỗi',NULL,'2025-04-10 16:20:00','pending',NULL,NULL),(3,1,'jjkjkaf','jkjlkkjjlksf','kt19.domi@gmail.com','2025-04-10 16:25:48','pending',NULL,NULL),(4,1,'sadfasf','adfafafs','dieuanh.domi@gmail.com','2025-04-10 16:26:46','processed','2025-04-13 13:09:39',NULL),(5,1,'ấd','adfasfdasdf','emyeuanh1l8ve980@gmail.com','2025-04-10 16:30:24','processed','2025-04-13 13:09:34',NULL),(6,1,'dfasfa','vcxvx','kt19.domi@gmail.com','2025-04-10 16:35:06','processed','2025-04-13 13:09:29',NULL),(7,1,'sfsfsd','fsf','dieuanh.domi@gmail.com','2025-04-10 16:56:54','processed','2025-04-13 13:09:19',NULL),(8,1,'fasfas','vcxvx','1honda3hoa@gmail.com','2025-04-10 18:09:15','processed','2025-04-11 05:33:51','hoàn thành'),(9,1,'错误','目前存在一些错误，希望网站更加完善！','1honda3hoa@gmail.com','2025-04-10 18:57:28','processed','2025-04-11 05:33:40','fafasf'),(10,1,'jsfak','jj','nvc@gdfa.cc','2025-04-13 11:27:48','processed','2025-04-13 13:09:10',NULL);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Quản trị viên'),(2,'user','Người dùng thông thường');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shares`
--

DROP TABLE IF EXISTS `shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `card_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `shares_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shares_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shares`
--

LOCK TABLES `shares` WRITE;
/*!40000 ALTER TABLE `shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','kimdominic714@gmail.com','$2b$10$RHmD.YrPI5U7.BakXuAgmOzBIjdF.gOOFXXrEVN7tVFkobQuLDVLW',1,'2025-03-26 09:31:31','/storage/avatars/1744557354679-11503935.gif'),(2,'tuan','tuan@gmail.com','$2b$10$hXSzrYcCgsNZHB6mbK1sfu9oKpySgOE/zwdD1j7APLkcB4pzxSvpy',2,'2025-03-26 09:35:26',NULL),(3,'danchoi','danplay@play.com','$2b$10$VdlUroPWRPsewhW.OLTIDuliDhSElKSDStNZ2KJkpe1CEcqxwl7Ky',2,'2025-04-06 15:50:53','/storage/avatars/1744542668361-45682456.jpg'),(4,'thichnico','thichnico@ditme.com','$2b$10$i6fAwnYbMlAKw8IVD2o5QeLOYfCq.l0BBqsC6qyauLWYt5ZB1lVeK',2,'2025-04-12 18:19:07','/storage/avatars/1744513803583-746610690.gif'),(5,'thydai','thyancut@gmail.com','$2b$10$3fYOojyUxsUV8qi1hLpIbOyEUeCNYgoFXWiXXBcqV1Z5N5l5EtTpW',2,'2025-04-13 11:07:09','/storage/avatars/1744543001722-761784979.gif'),(6,'ninjalangla','bulol@gmail.com','$2b$10$/NKtKibKw7MQEPWxDGWdZerZcHaSqMfuhOODBe.6qVWQuUNjSpGom',2,'2025-04-13 11:20:18','/storage/avatars/1744543257383-566295205.png'),(7,'ngochoangdaide','ngochoang@thiendinh.net','$2b$10$zxSG/MTp4pTr6fUoJ13vF.SvuSobfH.JhoVS9lZVZfnR0Ivp1U7a6',2,'2025-04-13 11:23:20','/storage/avatars/1744543436473-689536597.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-14  7:49:40
