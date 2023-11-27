# SportsBet API

Welcome to the SportsBet API repository! This API provides functionality for handling sports betting operations.

### Installation

# 1: Clone the repository

git clone https://github.com/your-username/sportsbet-api.git

# 2: Install dependencies:

npm install

or

npm install --legacy-peer-deps (Frontend Only)

# 3: Start the server (Frontend):

npm start

# 4: Start the server (Backend):

npm run dev

### Database Configurations

# Make sure to create a `.env` file in the backend directory of your project with the following configurations:

```
PORT=

DB_NAME=

DB_USERNAME=

DB_PASSWORD=

DB_PORT=

JWT_SECRET_KEY=

ACCOUNT_SID=

AUTH_TOKEN=

TWILIO_NUMBER=

Avatar_Base_URL=

ADMIN_METAMASK_WALLET=

COMMISION_PERCENTAGE=
```

### Commands for Database

```
CREATE DATABASE sportsbet;
```

### Commands for Tables

```
CREATE TABLE `UserWallets` (
  `walletAddress` varchar(255) NOT NULL,
  `walletToken` text NOT NULL,
  `virtualBalance` varchar(255) DEFAULT '100',
  `deposits` json DEFAULT NULL,
  `claims` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`walletAddress`),
  UNIQUE KEY `walletAddress` (`walletAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Applications` (
  `walletAddress` varchar(255) NOT NULL,
  `amount` decimal(10,2) DEFAULT '0.00',
  `timestamp` bigint DEFAULT NULL,
  PRIMARY KEY (`walletAddress`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`walletAddress`) REFERENCES `UserWallets` (`walletAddress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `source` int DEFAULT NULL,
  `dialing_code` varchar(255) NOT NULL,
  `mobilenumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `virtualBalance` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobilenumber` (`mobilenumber`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci



CREATE TABLE `UserProfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `idnumber` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `document_type` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`),
  KEY `userId` (`userId`),
  CONSTRAINT `userprofiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `otp` varchar(255) NOT NULL,
  `isUsed` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `Tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SelectionId` bigint DEFAULT NULL,
  `SelectionName` varchar(255) DEFAULT NULL,
  `MarketTypeId` bigint DEFAULT NULL,
  `MarketName` varchar(255) DEFAULT NULL,
  `MatchId` bigint DEFAULT NULL,
  `MatchName` varchar(255) DEFAULT NULL,
  `RegionId` bigint DEFAULT NULL,
  `RegionName` varchar(255) DEFAULT NULL,
  `CompetitionId` bigint DEFAULT NULL,
  `CompetitionName` varchar(255) DEFAULT NULL,
  `SportId` bigint DEFAULT NULL,
  `SportName` varchar(255) DEFAULT NULL,
  `SportFullName` varchar(255) DEFAULT NULL,
  `Price` decimal(10,0) DEFAULT NULL,
  `IsLive` int DEFAULT NULL,
  `Basis` int DEFAULT NULL,
  `MatchInfo` varchar(255) DEFAULT NULL,
  `singleStake` int DEFAULT NULL,
  `MatchStartDate` datetime DEFAULT NULL,
  `EventEndDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `Bets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `walletAddress` varchar(255) NOT NULL,
  `tournamentId` int NOT NULL,
  `command` varchar(255) DEFAULT NULL,
  `BetType` int DEFAULT NULL,
  `AcceptMode` int DEFAULT NULL,
  `Source` int DEFAULT NULL,
  `TotalPrice` decimal(10,2) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `rid` int DEFAULT NULL,
  `isLive` tinyint(1) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `currency` varchar(255) DEFAULT '$',
  `SelectionName` varchar(255) DEFAULT NULL,
  `MarketName` varchar(255) DEFAULT NULL,
  `MatchId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `walletAddress` (`walletAddress`),
  KEY `tournamentId` (`tournamentId`),
  CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`walletAddress`) REFERENCES `UserWallets` (`walletAddress`),
  CONSTRAINT `bets_ibfk_2` FOREIGN KEY (`tournamentId`) REFERENCES `Tournaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

```
