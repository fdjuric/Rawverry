-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: rawverry
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(20) DEFAULT NULL,
  `user_password` varchar(300) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `account_role` enum('Regular','Editor','Admin') DEFAULT 'Regular',
  `picture_path` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `date_col` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (7,'Cupenzi','$2b$10$KtdSgAz3wVn0QXIjbzEyPOYNNbBYatZpFD1AXzjTgXxDPOGi94WS6','filipdjuric.dev@gmail.com','Admin','images/profile/catalog-cta.png','n06e5q2Rl2Jyi1mya5NICaKjPJiteLGI9dDQkqZssBFk5ykir4DzpfqOPZLqhb1BSWhl6dZWrKfZV411oBlGDgfOIr13GrQ9zGXsX6ym0sHz0hlvR0Wn95SijZZZIt2K','2023-10-22'),(8,'rawverry','$2b$10$v6zK0N9EfrBNzDOh1JNwFOMHK.2K6sAbvk7jnQCVi.WTWwnqkFUeS','herklias@gmail.com','Admin','images/profile/IMG_1340.JPG','KRbHLXGL519rYEQZz1PjGBWoY6AA4AWqXZtxVZatyAWGS5yNxioYdiyIkOIlTDqCM1YXRodbPZIpgoG7jQ3EcBWyxQMS1TlkzhWyi86XFYvewI34bVrM2NAj2rwwInzn','2023-10-22'),(12,'Administrator','$2b$10$fPyBUd8Am5nX2kmrq5SrzuRKJPZd.y6tblOOMmhJ8A0PQ5vtl.S0W','filipcupo123@gmail.com','Admin','images/profile/t/blog-cta.png','EtPGrTQVsOYhB3SD6VNXX0PFiYxhw4ymvzsy15j1Zd3WL9k4DQwsu3UCayarJR8AIgsDDH2LN9tSirJfzoat15DFbjW1csCxjQAt49D9VRjK5uDzZvoHwoDFbEe8AnO8','2024-02-29'),(49,'Editor','$2b$10$O4Ozc5eXJPZV10NfGkcHjeLMEkoz7FLtm5DzErYiGQDLH0e5DMdv2','filip.fit123@gmail.com','Editor',NULL,'yd1KazSJwPC8xPVpgmjvwR4VH9aSdhllhpGCoa3YYiS0hChA3vwynz9DAeeRk91In07Hq7jrnArU2TudZmsEJ2tJCdRSLzrcluhzexLHRBmtPvqLKHPYZSwR88EAfvWv','2024-06-30');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_url` varchar(200) DEFAULT NULL,
  `author_picture` varchar(200) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (10,'Abstract','<p>tt</p>','t','2024-04-06 19:05:43','2024-04-06 19:20:49','1',NULL,'tt'),(11,'test','<p>test</p>','t','2024-04-06 19:21:46','2024-04-06 19:23:25','images/blog/test/hero_background.png',NULL,'test'),(12,'tests','<p>test</p>','t','2024-04-06 19:39:16','2024-04-06 19:46:34','images/blog/tests/catalog-cta.png',NULL,'test');
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `coupon_code` varchar(50) DEFAULT NULL,
  `discount_amount` varchar(50) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `expiration_date` datetime DEFAULT NULL,
  `maximum_uses` int DEFAULT NULL,
  `product_restrictions` varchar(1000) DEFAULT NULL,
  `maximum_order_amount` int DEFAULT NULL,
  `redemption_status` enum('Active','Used') DEFAULT NULL,
  `amount_used` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupon_code` (`coupon_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1,'test1235','20%','2024-03-28 00:00:00','2024-03-28 19:22:50',25,'2024-04-21 20:22:50',55,'Active',0),(3,'test','120','2024-03-28 20:41:54','2024-03-31 21:45:11',55,'asdjfkjasfas',55,'Active',0),(4,'summer2024','299.99','2024-03-28 23:06:10','2024-05-10 00:06:10',10,'TEst/ASDASDASD',10,'Active',0),(5,'asdasd','12','2024-04-13 16:41:29',NULL,2,NULL,NULL,'Active',0),(6,'cyxcycy','12','2024-04-13 16:42:08','2024-04-28 18:42:08',NULL,NULL,NULL,'Active',0);
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `date_col` date NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `isConfirmed` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter`
--

LOCK TABLES `newsletter` WRITE;
/*!40000 ALTER TABLE `newsletter` DISABLE KEYS */;
INSERT INTO `newsletter` VALUES (1,'sadsamurai333@gmail.com','2023-09-24','DbmhK7L419kekXEkahUe2ZiKPVJZPshTv9brmU4EpG5f6rimb09lCUu0X2KVyIm6',1),(2,'filipdjuric.dev@gmail.com','2023-09-24','aDQ9o64Aiv9t6caW8ojZToxwqhU2hKgrEXN66W0aoA3JzWsQZBb7kIMuyucuctLv',1),(20,'filipcupo123@gmail.com','2023-09-26','TkVzB1dZBopuf9l8WdLWzStKoSayn8l8LUZzKDFGBYzn4aLDQR1OrRLEzGgo8B2DfzfUCLFAJztNUHIaNeQ4HYadPiCd6fo1gvQ8TvPB3b3NMx9UEDt1sd8raeHBCjCm',1),(21,'herklias@gmail.com','2024-03-13','KIESjtk6J9GosHLt6DbzSoKogFiVv5FAkTcYv0Exr3WJGMw9vDtRHLFma9McmHAgANxiNSDOHR6n27yxPfW4RcCsAtc2EAeR61OKMvwYOueWTbLHw8eTydPeQQJsGgOt',1);
/*!40000 ALTER TABLE `newsletter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(30) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `postal` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `date_col` datetime DEFAULT NULL,
  `status` enum('Pending','Sent','Refunded') DEFAULT 'Pending',
  `items` varchar(1000) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_id` varchar(500) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `charge_id` varchar(1000) DEFAULT NULL,
  `tracking_id` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (106,'John Doe','Via Roma, 1','Italy','00184','+39 06 1234 5678','2024-06-03 00:00:00','Pending','ASDASDASD(100x50cm)/adshjufuakhfuahfkja(100x50cm)/',1632.00,'11T207172B020612E','1','paypal','0K903762K1519363X',NULL,'johndoe@gmail.com'),(107,'1','1','Croatia','1','1','2024-06-03 00:00:00','Pending','ASDASDASD(100x50cm)/',1233.00,'33N92395NR5257414','1','paypal','9KM37858009003733',NULL,NULL),(109,'t','t','Estonia','t','t','2024-06-03 00:00:00','Refunded','ASDASDASD(100x50cm)/',986.40,'49P730156N210231N','t','paypal','90440798SE214310W',NULL,NULL),(110,'t','t','Estonia','t','t','2024-06-03 00:00:00','Pending','ASDASDASD(100x50cm)/',1233.00,'pi_3PNeIwP1klN1xJaK1mEH0Abq','t','stripe','ch_3PNeIwP1klN1xJaK12K7gqYH',NULL,NULL),(111,'John Doe','123','Cyprus','62701','+41 345 6789','2024-06-05 00:00:00','Sent','adshjufuakhfuahfkja(100x50cm)x3/adshjufuakhfuahfkja(60x60cm)x1/',519.00,'pi_3POMn9P1klN1xJaK1blKn1lA','Springfield','stripe','ch_3POMn9P1klN1xJaK1VEKqhS7','123456789','johndoe@gmail.com'),(112,'Johnny Doe','123 Main St','Denmark','1000','+39 456 7890','2024-06-06 00:00:00','Pending','Working(100x50cm)x1/TEst(100x50cm)x1/',632.00,'pi_3POgsRP1klN1xJaK1Lmw94DC','London','stripe','ch_3POgsRP1klN1xJaK1pamGS8O',NULL,'johnnydoe@gmail.com'),(113,'Jo Do','123 M','Finland','12345','123456789','2024-06-06 00:00:00','Pending','STRE(100x50cm)x1/',399.99,'pi_3POguoP1klN1xJaK00MjliuQ','Test','stripe','ch_3POguoP1klN1xJaK0F3hjdf6',NULL,'jodo@gmail.com'),(114,'John Do','123','Finland','12345','123456769','2024-06-06 00:00:00','Sent','asdjfkjasfas(120x120cm)x1/',120.00,NULL,'Fin',NULL,NULL,'1235234','johndo@gmail.com'),(115,'F D','123','Estonia','12345','12345557456','2024-06-06 00:00:00','Pending','ASDASDASD(100x50cm)x1/',1233.00,'pi_3POh4CP1klN1xJaK1rWrDNfV','Esto','stripe','ch_3POh4CP1klN1xJaK1IRgCBVj',NULL,'fd@gmail.com'),(116,'Test Test','123','Croatia','65244','123456677','2024-06-06 00:00:00','Refunded','adshjufuakhfuahfkja(100x50cm)x1/',399.00,'pi_3POh6GP1klN1xJaK1aCkqbX9','Zagreb','stripe','ch_3POh6GP1klN1xJaK1IbxAZDk',NULL,'testtest@gmail.com'),(117,'John Doe','123','Croatia','12312','1234567890','2024-06-06 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/',399.00,NULL,'Spring',NULL,NULL,NULL,'johndoe@gmail.com'),(118,'John John','123','Cyprus','12314','1234546457','2024-05-06 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/',399.00,NULL,'Sad',NULL,NULL,NULL,'john@gmail.com'),(119,'Test','2151','Ireland','523124','513315354','2024-06-06 00:00:00','Pending','Working(100x50cm)x1/',299.00,'pi_3POim1P1klN1xJaK0bl00NNM','Doboj','stripe','ch_3POim1P1klN1xJaK0j4IFerR',NULL,'test@gmail.com'),(120,'afbafdsb','asdfbasb','Bulgaria','asdbf','adsbf','2024-05-06 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/',399.00,'8VY23195NN1574742','asdfb','paypal','99D26048XX007313A',NULL,'adsfbasbfasb'),(121,'afbafdsb','asdfbasb','Bulgaria','asdbf','adsbf','2024-06-06 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/',399.00,'16144862A7469792H','asdfb','paypal','54955007CN372551U',NULL,'adsfbasbfasb'),(122,'123','123','Bulgaria','123','123','2023-05-09 00:00:00','Pending','ASDASDASD(100x50cm)x1/',1233.00,'6C406081SK0072422','123','paypal','5N253525711210944',NULL,'123'),(123,'1','1','Bulgaria','1','1','2024-06-12 00:00:00','Refunded','adshjufuakhfuahfkja(100x50cm)x3/',1197.00,'57J31385XB1917843','1','paypal','264584286S202842F','12353634','1'),(124,'1','1','Croatia','1','1','2024-06-12 00:00:00','Refunded','adshjufuakhfuahfkja(100x50cm)x3/ASDASDASD(100x50cm)x1/',2430.00,'85A876948W264315X','1','paypal','9JH45396Y4724545W',NULL,'1'),(125,'1','1','Croatia','1','1','2024-06-12 00:00:00','Refunded','ASDASDASD(100x50cm)x1/',1233.00,'55231101F1875491E','1','paypal','3FW584573F141754S',NULL,'1'),(126,'1','1','Czech Republic','1','1','2024-06-12 00:00:00','Refunded','STRE(100x50cm)x1/',399.99,'9GU10752JJ5507842','1','paypal','48S88758D84162115',NULL,'1'),(127,'1','1','Croatia','1','1','2024-06-12 00:00:00','Refunded','ASDASDASD(100x50cm)x1/',1233.00,'1X416142FA361951E','1','paypal','812702760M585284D',NULL,'1'),(128,'1','1','Croatia','1','1','2024-06-12 00:00:00','Refunded','ASDASDASD(100x50cm)x1/',1233.00,'pi_3PQvFnP1klN1xJaK1eRF5n4j','1','stripe','ch_3PQvFnP1klN1xJaK1YBqnMGU',NULL,'1'),(129,'1','1','Croatia','1','1','2024-06-12 00:00:00','Pending','ASDASDASD(100x50cm)x1/',1233.00,'97C69262B8906364F','1','paypal','87F91088J51500746',NULL,'1'),(130,'1','1','Cyprus','1','1','2024-06-12 00:00:00','Refunded','TOOEXP(100x50cm)x1/',122222.00,'pi_3PQvsVP1klN1xJaK05nofj5h','1','stripe','ch_3PQvsVP1klN1xJaK014uSgZx','142361465146','1'),(131,'123','123','Bulgaria','123','123','2024-06-13 00:00:00','Pending','ASDASDASD(100x50cm)x1/',1233.00,'pi_3PRFN4P1klN1xJaK0WtfpAkC','123','stripe','ch_3PRFN4P1klN1xJaK07Llszti',NULL,'123'),(132,'123','123','Bulgaria','123','123','2024-06-13 00:00:00','Pending','ASDASDASD(100x50cm)x1/',1233.00,'pi_3PRFRNP1klN1xJaK0suTboX9','123','stripe','ch_3PRFRNP1klN1xJaK0jK0mpJ9',NULL,'123'),(133,'1','1','Czech Republic','1','1','2024-06-13 00:00:00','Pending','STRE(100x50cm)x1/',399.99,'pi_3PRFSRP1klN1xJaK0OscG288','1','stripe','ch_3PRFSRP1klN1xJaK08QkZxAj',NULL,'1'),(134,'1','1','Czech Republic','1','1','2024-06-13 00:00:00','Pending','STRE(100x50cm)x1/',399.99,'pi_3PRFTrP1klN1xJaK1yF8flvX','1','stripe','ch_3PRFTrP1klN1xJaK1AzYoMTT',NULL,'1'),(135,'1','1','Czech Republic','1','1','2024-06-13 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PRGgSP1klN1xJaK0ozwWMiE','1','stripe','ch_3PRGgSP1klN1xJaK0hrkkDGd',NULL,'1'),(136,'1','1','Croatia','1','1','2024-06-13 00:00:00','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x2/',1632.00,'pi_3PRGhxP1klN1xJaK0Rce7Wr1','1','stripe','ch_3PRGhxP1klN1xJaK0wy51ooy',NULL,'1'),(137,'1','1','Croatia','1','1','2024-06-13 00:00:00','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x2/',1632.00,'pi_3PRH7JP1klN1xJaK0pdrwV4V','1','stripe','ch_3PRH7JP1klN1xJaK0lVhoRST',NULL,'1'),(138,'1','1','Cyprus','1','1','2024-06-13 00:00:00','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x2/',1632.00,'pi_3PRHADP1klN1xJaK1tJUMkfn','1','stripe','ch_3PRHADP1klN1xJaK1O786kIx',NULL,'1'),(139,'1','1','Cyprus','1','1','2024-06-13 00:00:00','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'pi_3PRHDHP1klN1xJaK047ZS82H','1','stripe','ch_3PRHDHP1klN1xJaK0vPL8WUG',NULL,'1'),(140,'1','1','Cyprus','1','1','2024-06-13 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/',798.99,'pi_3PRHG5P1klN1xJaK0RcWdoCu','1','stripe','ch_3PRHG5P1klN1xJaK0AA3DmFv',NULL,'1'),(141,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUW9PP1klN1xJaK1MbFYl3x','123','stripe','ch_3PUW9PP1klN1xJaK1mhtBjLw',NULL,'johndoe@gmail.com'),(142,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUWBUP1klN1xJaK17mc6Xaz','123','stripe','ch_3PUWBUP1klN1xJaK16GSZNZA',NULL,'johndoe@gmail.com'),(143,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUWE2P1klN1xJaK0yBkgSgM','123','stripe','ch_3PUWE2P1klN1xJaK0JApFw05',NULL,'johndoe@gmail.com'),(144,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUWJsP1klN1xJaK1BwLSXhj','123','stripe','ch_3PUWJsP1klN1xJaK1KU292Nm',NULL,'johndoe@gmail.com'),(145,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUWKZP1klN1xJaK04gVUqwN','123','stripe','ch_3PUWKZP1klN1xJaK0fmsJbbC',NULL,'johndoe@gmail.com'),(146,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUWM5P1klN1xJaK10qNK3ZS','123','stripe','ch_3PUWM5P1klN1xJaK1jvhW6TA',NULL,'johndoe@gmail.com'),(147,'john DOe','123','Croatia','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x2/',1632.00,'pi_3PUWPSP1klN1xJaK1EpNyQRo','123','stripe','ch_3PUWPSP1klN1xJaK1gOKhUiV',NULL,'johndoe@gmail.com'),(148,'jo','123','Austria','123','123','2024-06-22 00:00:00','Pending','STRE(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x1/TEst(100x50cm)x1/testest(100x50cm)x1/',4687.99,'pi_3PUWx6P1klN1xJaK0t1wicpZ','123','stripe','ch_3PUWx6P1klN1xJaK0ly9cpUp',NULL,'jo@gmail.com'),(149,'jo','123','Austria','123','123','2024-06-22 00:00:00','Pending','STRE(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x1/TEst(100x50cm)x1/testest(100x50cm)x1/',4687.99,'pi_3PUWxmP1klN1xJaK1iYX8USD','123','stripe','ch_3PUWxmP1klN1xJaK1NacNU7a',NULL,'jo@gmail.com'),(150,'jo','123','Austria','123','123','2024-06-22 00:00:00','Pending','STRE(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x1/TEst(100x50cm)x1/testest(100x50cm)x1/',4687.99,'pi_3PUX0KP1klN1xJaK0Jx6h3m3','123','stripe','ch_3PUX0KP1klN1xJaK0GNt13oI',NULL,'jo@gmail.com'),(151,'jo','123','Austria','123','123','2024-06-22 00:00:00','Pending','STRE(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/ASDASDASD(100x50cm)x1/TEst(100x50cm)x1/testest(100x50cm)x1/',4687.99,'pi_3PUX4NP1klN1xJaK0mYHVB1i','123','stripe','ch_3PUX4NP1klN1xJaK0uTIWYUx',NULL,'jo@gmail.com'),(152,'123','123','Belgium','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUXrvP1klN1xJaK0lgZ9LAd','123','stripe','ch_3PUXrvP1klN1xJaK0EK8N6pC',NULL,'123'),(153,'123','123','Belgium','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUXsOP1klN1xJaK0Z8ORPH2','123','stripe','ch_3PUXsOP1klN1xJaK0mNIgIbd',NULL,'123'),(154,'123','123','Belgium','123','123','2024-06-22 00:00:00','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUXthP1klN1xJaK1tMRmiof','123','stripe','ch_3PUXthP1klN1xJaK1Y3SDCVu',NULL,'123'),(155,'1234','123','Belgium','123','123','2024-06-22 17:43:35','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUXycP1klN1xJaK0loMapuR','123','stripe','ch_3PUXycP1klN1xJaK0oHpzuXG',NULL,'1234'),(156,'1234','123','Belgium','123','123','2024-06-22 17:48:05','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUY2pP1klN1xJaK0hfPJA1A','123','stripe','ch_3PUY2pP1klN1xJaK0Ktf7Jet',NULL,'1234'),(157,'1234','123','Belgium','123','123','2024-06-22 17:49:26','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUY48P1klN1xJaK0tBtvVPz','123','stripe','ch_3PUY48P1klN1xJaK0q38YYe0',NULL,'1234'),(158,'1234','123','Belgium','123','123','2024-06-22 17:52:44','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUY7KP1klN1xJaK0D8eZcWj','123','stripe','ch_3PUY7KP1klN1xJaK0XDY1wLT',NULL,'1234'),(159,'1234','123','Belgium','123','123','2024-06-22 17:53:52','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUY8TP1klN1xJaK1WhBR8l3','123','stripe','ch_3PUY8TP1klN1xJaK1C5lzpy5',NULL,'1234'),(160,'1234','123','Belgium','123','123','2024-06-22 17:57:25','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUYBqP1klN1xJaK0SbH9QmT','123','stripe','ch_3PUYBqP1klN1xJaK0v10oxoV',NULL,'1234'),(161,'1234','123','Belgium','123','123','2024-06-22 18:04:22','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUYIZP1klN1xJaK0S82QxCm','123','stripe','ch_3PUYIZP1klN1xJaK0Rd14yXn',NULL,'1234'),(162,'1234','123','Belgium','123','123','2024-06-22 18:14:12','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUYS5P1klN1xJaK1WzITyQD','123','stripe','ch_3PUYS5P1klN1xJaK1MlkGi0E',NULL,'1234'),(163,'1234','123','Belgium','123','123','2024-06-22 18:15:46','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',3121.99,'pi_3PUYTcP1klN1xJaK1V0A6Y1q','123','stripe','ch_3PUYTcP1klN1xJaK1gW8defA',NULL,'1234'),(164,'1234','123','Belgium','123','123','2024-06-22 18:31:50','Pending','adshjufuakhfuahfkja(100x50cm)x1/STRE(100x50cm)x1/testest(100x50cm)x1/',2497.59,'pi_3PUYjAP1klN1xJaK1VJd1YhJ','123','stripe','ch_3PUYjAP1klN1xJaK1nxZIaMG',NULL,'1234'),(165,'123','123','Bulgaria','123','123','2024-06-22 18:35:38','Pending','adshjufuakhfuahfkja(100x50cm)x2/ASDASDASD(100x50cm)x1/',1632.00,'pi_3PUYmuP1klN1xJaK1yczje9P','123','stripe','ch_3PUYmuP1klN1xJaK13jhkkuK',NULL,'123'),(166,'123','123','Bulgaria','123','123','2024-06-22 18:37:03','Pending','adshjufuakhfuahfkja(100x50cm)x2/ASDASDASD(100x50cm)x1/',1632.00,'pi_3PUYoCP1klN1xJaK1MHUCExO','123','stripe','ch_3PUYoCP1klN1xJaK14GGimCI',NULL,'123'),(167,'123','123','Croatia','123','123','2024-06-22 18:44:49','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x4/',2829.00,'pi_3PUYvuP1klN1xJaK18OB50c8','123','stripe','ch_3PUYvuP1klN1xJaK1malBBIL',NULL,'123'),(168,'123','123','Croatia','123','123','2024-06-22 18:45:51','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x4/',2829.00,'pi_3PUYwjP1klN1xJaK1lsNuox0','123','stripe','ch_3PUYwjP1klN1xJaK1Au9EnVO',NULL,'123'),(169,'1','1','Bulgaria','1','1','2024-06-22 18:49:03','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZ00P1klN1xJaK0GLJ1txQ','1','stripe','ch_3PUZ00P1klN1xJaK0T8fNCfb',NULL,'1'),(170,'1','1','Bulgaria','1','1','2024-06-22 18:49:51','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZ0cP1klN1xJaK0kKYqbCb','1','stripe','ch_3PUZ0cP1klN1xJaK0oBZJN7o',NULL,'1'),(171,'1','1','Bulgaria','1','1','2024-06-22 18:51:54','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZ2aP1klN1xJaK0VLK51fp','1','stripe','ch_3PUZ2aP1klN1xJaK0kQqNOfi',NULL,'1'),(172,'1','1','Bulgaria','1','1','2024-06-22 18:53:23','Pending','ASDASDASD(100x50cm)x2/',2466.00,'pi_3PUZ48P1klN1xJaK15BFw1aU','1','stripe','ch_3PUZ48P1klN1xJaK1WKqvVut',NULL,'1'),(173,'1','1','Bulgaria','1','1','2024-06-22 18:55:14','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZ5nP1klN1xJaK0BtqG0Bm','1','stripe','ch_3PUZ5nP1klN1xJaK0k4GZHGU',NULL,'1'),(174,'1','1','Bulgaria','1','1','2024-06-22 18:57:41','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZ8HP1klN1xJaK059HRnZR','1','stripe','ch_3PUZ8HP1klN1xJaK0Ab7pyPL',NULL,'1'),(175,'1','1','Bulgaria','1','1','2024-06-22 19:01:25','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZBmP1klN1xJaK0mHMlZGM','1','stripe','ch_3PUZBmP1klN1xJaK0VSbxgOo',NULL,'1'),(176,'1','1','Bulgaria','1','1','2024-06-22 19:03:20','Pending','ASDASDASD(100x50cm)x2/',2219.40,'pi_3PUZDeP1klN1xJaK1C3xFJMn','1','stripe','ch_3PUZDeP1klN1xJaK1CTVE35z',NULL,'1'),(177,'1','1','Bulgaria','11','1','2024-06-22 19:06:48','Pending','ASDASDASD(100x50cm)x2/',1972.80,'pi_3PUZH1P1klN1xJaK0h7YOKAy','1','stripe','ch_3PUZH1P1klN1xJaK019MIzZD',NULL,'1'),(178,'1','1','Croatia','1','1','2024-06-22 19:45:28','Pending','adshjufuakhfuahfkja(100x50cm)x2/STRE(100x50cm)x3/',1598.38,'pi_3PUZsQP1klN1xJaK1xSdwK50','1','stripe','ch_3PUZsQP1klN1xJaK1mMCMFdZ',NULL,'1'),(179,'1','1','Belgium','1','1','2024-06-23 12:46:21','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'2BL10383C56337406','1','paypal','243347614X326470N',NULL,'1'),(180,'1','1','Belgium','1','1','2024-06-23 12:48:48','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'8AF86779JB876160U','1','paypal','8GT5862760238612H',NULL,'1'),(181,'1','1','Belgium','1','1','2024-06-23 12:49:27','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'54791748TL1912046','1','paypal','1EY17197FA8878309',NULL,'1'),(182,'1','1','Belgium','1','1','2024-06-23 12:51:27','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'28U04834VD2558717','1','paypal','9RX553010Y3937426',NULL,'1'),(183,'1','1','Belgium','1','1','2024-06-23 13:10:02','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'389085578D194623E','1','paypal','8PJ22006DA345843U',NULL,'1'),(184,'1','1','Belgium','1','1','2024-06-23 13:13:53','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'4WV43528PK384490D','1','paypal','2H760909A9892182B',NULL,'1'),(185,'1','1','Belgium','1','1','2024-06-23 13:15:25','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'25T16106X9771170B','1','paypal','5GG48417UL472064R',NULL,'1'),(186,'1','1','Belgium','1','1','2024-06-23 13:16:08','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'2YB99438H6577515C','1','paypal','27J8752256545911N',NULL,'1'),(187,'1','1','Belgium','1','1','2024-06-23 13:20:17','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'9WN15361DL113360R','1','paypal','8AM807707N704731A',NULL,'1'),(188,'1','1','Belgium','1','1','2024-06-23 13:21:36','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'93L01433M1561792N','1','paypal','1C692385WA574493M',NULL,'1'),(189,'1','1','Bulgaria','1','1','2024-06-23 13:22:55','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'3LH04064EH482960H','1','paypal','7VA190674C0760401',NULL,'1'),(190,'1','1','Bulgaria','1','1','2024-06-23 13:24:58','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'4KD80094KE532625J','1','paypal','11163633XT9019847',NULL,'1'),(191,'1','1','Bulgaria','1','1','2024-06-23 13:26:30','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'7AB54968133939139','1','paypal','4Y521121P1059540H',NULL,'1'),(192,'1','1','Bulgaria','1','1','2024-06-23 13:28:08','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'9GT13938DL417493B','1','paypal','9PL0328731671614P',NULL,'1'),(193,'1','1','Bulgaria','1','1','2024-06-23 13:31:19','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'1X97510151060704G','1','paypal','4NM13486Y8539633Y',NULL,'1'),(194,'1','1','Bulgaria','1','1','2024-06-23 13:32:23','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'4W925711VV369470V','1','paypal','0DD74464BJ7922622',NULL,'1'),(195,'1','1','Bulgaria','1','1','2024-06-23 13:33:38','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'8YR26267320566717','1','paypal','1UX15745MA189701Y',NULL,'1'),(196,'1','1','Bulgaria','1','1','2024-06-23 13:34:16','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'3S5458136K8239254','1','paypal','6V1434503D175172A',NULL,'1'),(197,'1','1','Bulgaria','1','1','2024-06-23 13:35:16','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'09C696027L256391A','1','paypal','8L198604SG2207456',NULL,'1'),(198,'1','1','Bulgaria','1','1','2024-06-23 13:35:51','Pending','ASDASDASD(100x50cm)x1/adshjufuakhfuahfkja(100x50cm)x1/',1632.00,'5HU98965DF861635F','1','paypal','26W170876X208525S',NULL,'1'),(199,'1','1','Bulgaria','1','1','2024-06-23 14:31:42','Pending','ASDASDASD(100x50cm)x2/adshjufuakhfuahfkja(100x50cm)x1/',2865.00,'644501794A3868813','1','paypal','9D898779LD524064N',NULL,'1'),(200,'1','1','Croatia','1','1','2024-06-23 14:33:36','Pending','ASDASDASD(100x50cm)x2/adshjufuakhfuahfkja(100x50cm)x2/',2611.20,'0C48749083023124M','1','paypal','7PY44952YK464773M',NULL,'1'),(201,'1','1','Cyprus','1','1','2024-06-23 14:38:02','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',4186.40,'7RS38365L1696633P','1','paypal','52866922RN6508239',NULL,'1'),(202,'1','1','Cyprus','1','1','2024-06-23 14:38:58','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',4186.40,'0RH057067C9184502','1','paypal','2WP240823S124113U',NULL,'1'),(203,'1','1','Cyprus','1','1','2024-06-23 14:40:01','Pending','ASDASDASD(100x50cm)x1/Example 1(100x50cm)x1/',5233.00,'52N086636M9659531','1','paypal','05T436194P823484P',NULL,'1'),(204,'1','1','Cyprus','1','1','2024-06-23 14:40:42','Refunded','ASDASDASD(100x50cm)x2/',1972.80,'0NG87888SP786782M','1','paypal','208602941G546750F',NULL,'1'),(205,'1','1','Bulgaria','1','1','2024-06-23 14:42:09','Sent','ASDASDASD(100x50cm)x2/',1972.80,'24U00192W77776904','1','paypal','4WE72750FD140184M','12345','1'),(206,'1','1','Cyprus','1','1','2024-06-23 14:52:25','Sent','ASDASDASD(100x50cm)x1/',986.40,'4DM99183RJ419121D','1','paypal','20501667NA831453M','12345','1'),(207,'test','123','Czech Republic','123','123','2024-06-23 16:46:44','Pending','Working(100x50cm)x1/',599.00,'pi_3PUtZLP1klN1xJaK1tyTgvxs','123','stripe','ch_3PUtZLP1klN1xJaK15eXrDv4',NULL,'test@gmail.com'),(208,'123','123','Croatia','123','123123','2024-06-23 16:46:37','Pending','ASDASDASD(100x50cm)x1/',1233.00,'pi_3PUtZKP1klN1xJaK1NriZCia','123','stripe','ch_3PUtZKP1klN1xJaK12lcCsll',NULL,'123@gmail.com');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) DEFAULT NULL,
  `product_amount_bought_total` bigint unsigned DEFAULT NULL,
  `description` text,
  `date_col` datetime DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT '0',
  `details` text,
  `date_edited` datetime DEFAULT NULL,
  `edited_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_name` (`product_name`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (102,'Example 2',11,'<p>sad</p>','2024-03-04 18:34:33',0,'<p>cdas</p>','2024-06-23 15:24:24','t'),(104,'Example 3',5,'<p>asdasda</p>','2024-03-04 19:16:29',0,'<p>asdasda</p>','2024-03-04 19:25:47','Cupenzi'),(105,'Example 4',12,'<p>sad</p>','2024-03-04 19:35:16',0,'<p>asd</p>','2024-03-04 19:35:16','Cupenzi'),(106,'Example 5',89,'<p>asdasd</p>','2024-03-04 19:35:53',0,'<p>sdaasd</p>','2024-03-04 19:35:53','t'),(108,'Example 6',82,'<p>sdadada</p>','2024-03-24 19:30:39',0,'<p>asdasdasd</p>','2024-03-24 19:30:39','t'),(109,'Example 7',29,'<p>test</p>','2024-03-27 19:39:43',0,'<p>asdfbasfbs</p>','2024-03-29 17:16:50','t'),(110,'Example 8',39,'<p>adasda</p>','2024-04-01 13:08:02',0,'<p>asdasdad</p>','2024-04-01 13:08:02','t'),(114,'Example 9',0,'<p>asd</p>','2024-04-13 15:36:27',0,'<p>asd</p>','2024-04-13 15:36:27','t'),(115,'Example 10',1,'<p>dsaasd</p>','2024-06-12 18:26:00',0,'<p>asdadsa</p>','2024-06-12 18:26:00','t'),(116,'Example 1',13,'<p>Test</p>','2024-06-22 19:53:23',0,'<p>Test</p>','2024-06-22 19:53:23','t'),(117,'Example 11',0,'<p>123</p>','2024-06-23 15:36:17',0,'<p>123</p>','2024-06-23 15:36:17','t'),(119,'Example 12',0,'<p>123</p>','2024-06-23 15:39:19',0,'<p>123</p>','2024-06-23 15:39:19','t'),(120,'Example 13',0,'<p>123</p>','2024-06-23 15:43:06',0,'<p>123</p>','2024-06-23 15:43:06','t');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) DEFAULT NULL,
  `category_header` varchar(1000) DEFAULT NULL,
  `category_subheader` varchar(1000) DEFAULT NULL,
  `category_image` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'Abstract Art','Infinite Expressions: Abstract Art Beyond Boundaries','Dive into my unbounded collection, where imagination knows no limits in every artwork.','images/abstractArt.jpg'),(2,'Figure Drawing','Test12','Test','images/categories//Figure%20Drawing/figureDrawing.jpg'),(3,'Favourites',NULL,NULL,'../images/favourites.jpg'),(4,'Fan Art',NULL,NULL,'../images/favourites.jpg'),(7,'Test',NULL,NULL,NULL),(8,'Test1','test1','test1','images/categories/hero-abstract.jpg'),(9,'Test2','test2','test2','images/categories/blog-cta.png'),(10,'testestst','adsad','asdada','images/categories/catalog-cta.png');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category_link`
--

DROP TABLE IF EXISTS `product_category_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category_link` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_category_link_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `product_category_link_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_link`
--

LOCK TABLES `product_category_link` WRITE;
/*!40000 ALTER TABLE `product_category_link` DISABLE KEYS */;
INSERT INTO `product_category_link` VALUES (66,102,1),(68,104,1),(69,105,1),(70,105,2),(71,106,1),(72,106,2),(74,108,1),(75,108,2),(76,109,1),(77,109,2),(78,109,3),(79,110,2),(80,110,7),(84,114,1),(85,115,1),(86,116,3),(87,117,1),(88,119,3),(89,120,3);
/*!40000 ALTER TABLE `product_category_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (79,102,'images/products/Working/hero-abstract.jpg'),(82,104,'images/products/asdjfkjasfas/catalog-cta.png'),(83,104,'images/products/asdjfkjasfas/hero_background.png'),(84,105,'images/products/TEst/catalog-cta.png'),(85,106,'images/products/ASDASDASD/catalog-cta.png'),(86,106,'images/products/ASDASDASD/hero_background.png'),(88,108,'images/products/adshjufuakhfuahfkja/abstractArt.jpg'),(89,108,'images/products/adshjufuakhfuahfkja/catalog-cta.png'),(90,108,'images/products/adshjufuakhfuahfkja/hero_background.png'),(91,108,'images/products/adshjufuakhfuahfkja/hero-abstract.jpg'),(92,108,'images/products/adshjufuakhfuahfkja/hero-favourites.jpg'),(93,109,'images/products/STRE/hero_background.png'),(94,110,'images/products/testest/hero_background.png'),(95,110,'images/products/testest/hero-abstract.jpg'),(96,114,'images/products/asdas/hero_background.png'),(97,115,'images/products/TOOEXP/hero-abstract.jpg'),(98,116,'images/products/Example 1/hero-favourites.jpg'),(99,117,'images/products/123/hero_background.png'),(100,119,'images/products/Test12/hero-abstract.jpg'),(101,120,'images/products/12131231/hero_background.png');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_size`
--

DROP TABLE IF EXISTS `product_size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_size` (
  `size_id` int NOT NULL AUTO_INCREMENT,
  `size_value` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `size_value` (`size_value`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_size`
--

LOCK TABLES `product_size` WRITE;
/*!40000 ALTER TABLE `product_size` DISABLE KEYS */;
INSERT INTO `product_size` VALUES (14,'100x50cm'),(18,'10x10cm'),(17,'120x120cm'),(19,'15x15cm'),(15,'50x50cm'),(16,'60x60cm'),(20,'75x75cm'),(22,'80x80cm');
/*!40000 ALTER TABLE `product_size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_size_link`
--

DROP TABLE IF EXISTS `product_size_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_size_link` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `size_id` int DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  `product_price_reduced` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `size_id` (`size_id`),
  CONSTRAINT `product_size_link_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `product_size_link_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `product_size` (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_size_link`
--

LOCK TABLES `product_size_link` WRITE;
/*!40000 ALTER TABLE `product_size_link` DISABLE KEYS */;
INSERT INTO `product_size_link` VALUES (76,102,14,299.00,599.00),(78,104,17,123.00,120.00),(79,105,14,333.00,0.00),(80,106,14,1233.00,0.00),(82,108,14,399.00,0.00),(83,108,16,299.00,120.00),(84,109,14,399.99,NULL),(85,110,14,133.00,2323.00),(89,114,14,123.00,NULL),(90,115,14,122222.00,NULL),(91,116,14,399.99,300.00),(92,117,14,123.00,124.00),(93,119,14,123.00,122.00),(94,120,14,123.00,122.00);
/*!40000 ALTER TABLE `product_size_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `transaction_id` int DEFAULT NULL,
  `items` varchar(1000) DEFAULT NULL,
  `total_spent` decimal(10,2) DEFAULT NULL,
  `status` enum('Success','Refunded') DEFAULT NULL,
  `date_col` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-02 15:37:11
