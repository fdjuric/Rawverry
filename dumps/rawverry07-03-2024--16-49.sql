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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (7,'Cupenzi','$2b$10$KtdSgAz3wVn0QXIjbzEyPOYNNbBYatZpFD1AXzjTgXxDPOGi94WS6','filipdjuric.dev@gmail.com','Admin','images/profile/catalog-cta.png','n06e5q2Rl2Jyi1mya5NICaKjPJiteLGI9dDQkqZssBFk5ykir4DzpfqOPZLqhb1BSWhl6dZWrKfZV411oBlGDgfOIr13GrQ9zGXsX6ym0sHz0hlvR0Wn95SijZZZIt2K','2023-10-22'),(8,'rawverry','$2b$10$v6zK0N9EfrBNzDOh1JNwFOMHK.2K6sAbvk7jnQCVi.WTWwnqkFUeS','herklias@gmail.com','Admin','images/profile/IMG_1340.JPG','KRbHLXGL519rYEQZz1PjGBWoY6AA4AWqXZtxVZatyAWGS5yNxioYdiyIkOIlTDqCM1YXRodbPZIpgoG7jQ3EcBWyxQMS1TlkzhWyi86XFYvewI34bVrM2NAj2rwwInzn','2023-10-22'),(9,'testEditor','$2b$10$IE3LFfU5/o31e.RuQvYDke.Llbxq6AXlgS7Hol1brHBMzezq2./oG','filipcupo123@gmail.com','Editor','images/profile/gigachad-chad.gif','N6W2tvkO155XyJG5FAkz8aO9jkCKMCVFfGZgtzLnmalF4Gb45I3w4X6k8LYvC5nGGgnr8B8lVxBRJc3MfWt8xYWeVlts59EWsK9iNF0VsnGRQhOzVLAcGX1DoZEpxZmq','2023-11-17'),(12,'t','$2b$10$fPyBUd8Am5nX2kmrq5SrzuRKJPZd.y6tblOOMmhJ8A0PQ5vtl.S0W','filipcupo123@gmail.com','Admin',NULL,'1DcM5qrXEhW4yYeezmALzzINEN8nmmqbTf3haCg4ufTVKQRsX0L4Oe89rdjXvpM35Dd42FS8XVvT2z2VQ5r1zQCKnynCRpTjWh0DSSgL8MSGRgsbfNPC1lr7LrfsHEKn','2024-02-29'),(13,'filip.djuric.fit','$2b$10$Vw1IU/2jpinx2Fm6944nwe98mxRcOKT/WWokvXBZ2c/D9V5QAl.0S','sad@das.com','Regular',NULL,'yOZdsCoJC1ZjLKe3N40sZDbsiS1u6US7q0wvoZrcxrAVPb1faz6ituQmgB6FY84EsN0Zd11JOWyLTid5gO3bxf1cNQ1sx8QYkVsc68PvChnIDsvN9hH5VdnTGZ3zAJP3','2024-03-06');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
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
  `discount_type` varchar(50) DEFAULT NULL,
  `discount_amount` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `maximum_users` int DEFAULT NULL,
  `product_restrictions` varchar(1000) DEFAULT NULL,
  `minimum_order_amount` decimal(10,2) DEFAULT NULL,
  `redemption_status` enum('Active','Used') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter`
--

LOCK TABLES `newsletter` WRITE;
/*!40000 ALTER TABLE `newsletter` DISABLE KEYS */;
INSERT INTO `newsletter` VALUES (1,'sadsamurai333@gmail.com','2023-09-24','DbmhK7L419kekXEkahUe2ZiKPVJZPshTv9brmU4EpG5f6rimb09lCUu0X2KVyIm6',1),(2,'filipdjuric.dev@gmail.com','2023-09-24','aDQ9o64Aiv9t6caW8ojZToxwqhU2hKgrEXN66W0aoA3JzWsQZBb7kIMuyucuctLv',1),(20,'filipcupo123@gmail.com','2023-09-26','TkVzB1dZBopuf9l8WdLWzStKoSayn8l8LUZzKDFGBYzn4aLDQR1OrRLEzGgo8B2DfzfUCLFAJztNUHIaNeQ4HYadPiCd6fo1gvQ8TvPB3b3NMx9UEDt1sd8raeHBCjCm',1);
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
  `name` varchar(30) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `postal` int DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `date_col` date DEFAULT NULL,
  `status` enum('Pending','Success','Refunded') DEFAULT NULL,
  `items` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
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
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (102,'Working',0,'<p>sad</p>','2024-03-04 18:34:33',0,'<p>cdas</p>','2024-03-04 18:42:46','Cupenzi'),(104,'asdjfkjasfas',0,'<p>asdasda</p>','2024-03-04 19:16:29',0,'<p>asdasda</p>','2024-03-04 19:25:47','Cupenzi'),(105,'TEst',0,'<p>sad</p>','2024-03-04 19:35:16',0,'<p>asd</p>','2024-03-04 19:35:16','Cupenzi'),(106,'ASDASDASD',0,'<p>asdasd</p>','2024-03-04 19:35:53',0,'<p>sdaasd</p>','2024-03-04 19:35:53','t'),(107,'ASDBYVXC',0,'<p>ads</p>','2024-03-04 19:37:27',0,'<p>asd</p>','2024-03-04 19:37:27','t');
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
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,'Abstract Art'),(2,'Figure Drawing'),(3,'Favourites'),(4,'Fan Art');
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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_link`
--

LOCK TABLES `product_category_link` WRITE;
/*!40000 ALTER TABLE `product_category_link` DISABLE KEYS */;
INSERT INTO `product_category_link` VALUES (66,102,1),(68,104,1),(69,105,1),(70,105,2),(71,106,1),(72,106,2),(73,107,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (79,102,'images/products/Working/hero-abstract.jpg'),(82,104,'images/products/asdjfkjasfas/catalog-cta.png'),(83,104,'images/products/asdjfkjasfas/hero_background.png'),(84,105,'images/products/TEst/catalog-cta.png'),(85,106,'images/products/ASDASDASD/catalog-cta.png'),(86,106,'images/products/ASDASDASD/hero_background.png'),(87,107,'images/products/ASDBYVXC/catalog-cta.png');
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
  PRIMARY KEY (`size_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_size`
--

LOCK TABLES `product_size` WRITE;
/*!40000 ALTER TABLE `product_size` DISABLE KEYS */;
INSERT INTO `product_size` VALUES (14,'100x50cm'),(15,'50x50cm'),(16,'60x60cm'),(17,'120x120cm'),(18,'10x10cm'),(19,'15x15cm'),(20,'75x75cm'),(22,'80x80cm');
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
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_size_link`
--

LOCK TABLES `product_size_link` WRITE;
/*!40000 ALTER TABLE `product_size_link` DISABLE KEYS */;
INSERT INTO `product_size_link` VALUES (76,102,14,299.00,0.00),(78,104,17,123.00,120.00),(79,105,14,333.00,0.00),(80,106,14,1233.00,0.00),(81,107,14,333.00,0.00);
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

-- Dump completed on 2024-03-07 16:49:27
