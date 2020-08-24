-- MySQL dump 10.13  Distrib 8.0.17, for Linux (x86_64)
--
-- Host: localhost    Database: eatHealthy_SC
-- ------------------------------------------------------
-- Server version	8.0.17

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
-- Table structure for table `Users_SC`
--

DROP TABLE IF EXISTS `Users_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(70) NOT NULL,
  `reputation` int(11) DEFAULT '50',
  `token_number` int(11) DEFAULT '5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users_SC`
--

LOCK TABLES `Users_SC` WRITE;
/*!40000 ALTER TABLE `Users_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Voters_SC`
--

DROP TABLE IF EXISTS `Voters_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Voters_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(70) NOT NULL,
  `product_code` bigint(20) NOT NULL,
  `all_hash` varchar(70) NOT NULL,
  `type` enum('Product','Alternative') NOT NULL,
  `opinion` tinyint(1) DEFAULT NULL,
  `product_code_alternative` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Voters_SC`
--

LOCK TABLES `Voters_SC` WRITE;
/*!40000 ALTER TABLE `Voters_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `Voters_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `additives_SC`
--

DROP TABLE IF EXISTS `additives_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `additives_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `additives_hash` varchar(70) NOT NULL,
  `additives` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `additives_SC`
--

LOCK TABLES `additives_SC` WRITE;
/*!40000 ALTER TABLE `additives_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `additives_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alternatives_SC`
--

DROP TABLE IF EXISTS `alternatives_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alternatives_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_code_target` bigint(20) NOT NULL,
  `product_code_alternative` bigint(20) NOT NULL,
  `for_votes` smallint(6) NOT NULL DEFAULT '0',
  `against_votes` smallint(6) NOT NULL DEFAULT '0',
  `new_votes_today` tinyint(1) NOT NULL DEFAULT '0',
  `proposition_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternatives_SC`
--

LOCK TABLES `alternatives_SC` WRITE;
/*!40000 ALTER TABLE `alternatives_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `alternatives_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients_SC`
--

DROP TABLE IF EXISTS `ingredients_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ingredients_hash` varchar(70) NOT NULL,
  `ingredients` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_SC`
--

LOCK TABLES `ingredients_SC` WRITE;
/*!40000 ALTER TABLE `ingredients_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingredients_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labels_SC`
--

DROP TABLE IF EXISTS `labels_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labels_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `labels_hash` varchar(70) NOT NULL,
  `labels` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labels_SC`
--

LOCK TABLES `labels_SC` WRITE;
/*!40000 ALTER TABLE `labels_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `labels_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutriments_SC`
--

DROP TABLE IF EXISTS `nutriments_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutriments_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nutriments_hash` varchar(70) NOT NULL,
  `energy` double(6,1) NOT NULL,
  `energy_kcal` double(6,1) NOT NULL,
  `carbohydrates` double(3,1) NOT NULL,
  `salt` double(3,1) NOT NULL,
  `sugar` double(3,1) NOT NULL,
  `fat` double(3,1) NOT NULL,
  `saturated_fat` double(3,1) NOT NULL,
  `fiber` double(3,1) NOT NULL,
  `sodium` double(3,1) NOT NULL,
  `proteines` double(3,1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutriments_SC`
--

LOCK TABLES `nutriments_SC` WRITE;
/*!40000 ALTER TABLE `nutriments_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `nutriments_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productInfos_SC`
--

DROP TABLE IF EXISTS `productInfos_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productInfos_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `all_hash` varchar(70) NOT NULL,
  `address_proposer` varchar(70) NOT NULL,
  `for_votes` smallint(6) DEFAULT '0',
  `against_votes` smallint(6) NOT NULL DEFAULT '0',
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `lastVerificationDate` timestamp NULL DEFAULT NULL,
  `status` enum('NEW','IN_MODIFICATION','ACCEPTED','MODIFIED','CORRUPTED','REFUSED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `productInfos_SC_ibfk_1` FOREIGN KEY (`id`) REFERENCES `labels_SC` (`id`),
  CONSTRAINT `productInfos_SC_ibfk_2` FOREIGN KEY (`id`) REFERENCES `additives_SC` (`id`),
  CONSTRAINT `productInfos_SC_ibfk_3` FOREIGN KEY (`id`) REFERENCES `nutriments_SC` (`id`),
  CONSTRAINT `productInfos_SC_ibfk_4` FOREIGN KEY (`id`) REFERENCES `ingredients_SC` (`id`),
  CONSTRAINT `productInfos_SC_ibfk_5` FOREIGN KEY (`id`) REFERENCES `variousDatas_SC` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productInfos_SC`
--

LOCK TABLES `productInfos_SC` WRITE;
/*!40000 ALTER TABLE `productInfos_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `productInfos_SC` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variousDatas_SC`
--

DROP TABLE IF EXISTS `variousDatas_SC`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variousDatas_SC` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `variousDatas_hash` varchar(70) NOT NULL,
  `product_code` bigint(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_type` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `packaging` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variousDatas_SC`
--

LOCK TABLES `variousDatas_SC` WRITE;
/*!40000 ALTER TABLE `variousDatas_SC` DISABLE KEYS */;
/*!40000 ALTER TABLE `variousDatas_SC` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-24  3:25:17
