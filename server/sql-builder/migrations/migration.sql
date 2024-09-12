-- Create User Table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(50),
    "sexualPreferences" VARCHAR(50),
    "biography" TEXT,
    "profilePictureUrl" VARCHAR(255),
    "location" VARCHAR(255),
    "fameRating" FLOAT CHECK ("fameRating" >= 0.0 AND "fameRating" <= 5.0),
    "gpsLatitude" FLOAT,
    "gpsLongitude" FLOAT,
    "lastSeen" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "birthDate" DATE NOT NULL
);

-- Create Interest Table
CREATE TABLE "Interest" (
    "id" SERIAL PRIMARY KEY,
    "tag" VARCHAR(255) UNIQUE NOT NULL
);

-- Create Picture Table
CREATE TABLE "Picture" (
    "id" SERIAL PRIMARY KEY,
    "url" VARCHAR(255) NOT NULL,
    "userId" INTEGER NOT NULL,
    "isProfile" BOOLEAN DEFAULT FALSE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
);

-- Create Visit Table
CREATE TABLE "Visit" (
    "id" SERIAL PRIMARY KEY,
    "visitedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "visitedBy" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("visitedBy") REFERENCES "User" ("id")
);

-- Create Like Table
CREATE TABLE "Like" (
    "id" SERIAL PRIMARY KEY,
    "likedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "likedUserId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("likedUserId") REFERENCES "User" ("id")
);

-- Create Block Table
CREATE TABLE "Block" (
    "id" SERIAL PRIMARY KEY,
    "blockedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "blockerId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,
    FOREIGN KEY ("blockerId") REFERENCES "User" ("id"),
    FOREIGN KEY ("blockedId") REFERENCES "User" ("id")
);

-- Create Connection Table
CREATE TABLE "Connection" (
    "id" SERIAL PRIMARY KEY,
    "connectedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "connectionId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("connectionId") REFERENCES "User" ("id")
);

-- Create Dm Table
CREATE TABLE "Dm" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Message Table
CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "dmId" INTEGER NOT NULL,
    FOREIGN KEY ("senderId") REFERENCES "User" ("id"),
    FOREIGN KEY ("receiverId") REFERENCES "User" ("id"),
    FOREIGN KEY ("dmId") REFERENCES "Dm" ("id")
);

-- Create Notification Table
CREATE TABLE "Notification" (
    "id" SERIAL PRIMARY KEY,
    "type" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
);

-- Create Many-to-Many Relationship Tables

CREATE TABLE "User_Interests" (
    "userId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "interestId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("interestId") REFERENCES "Interest" ("id")
);

CREATE TABLE "Received_Likes" (
    "userId" INTEGER NOT NULL,
    "likeId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "likeId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("likeId") REFERENCES "Like" ("id")
);

CREATE TABLE "Sent_Likes" (
    "userId" INTEGER NOT NULL,
    "likeId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "likeId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("likeId") REFERENCES "Like" ("id")
);

CREATE TABLE "Sent_Messages" (
    "userId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "messageId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("messageId") REFERENCES "Message" ("id")
);

CREATE TABLE "Received_Messages" (
    "userId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "messageId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("messageId") REFERENCES "Message" ("id")
);

CREATE TABLE "User_Connections" (
    "userId" INTEGER NOT NULL,
    "connectionId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "connectionId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("connectionId") REFERENCES "User" ("id")
);

CREATE TABLE "Connection_Users" (
    "userId" INTEGER NOT NULL,
    "connectionId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "connectionId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("connectionId") REFERENCES "User" ("id")
);

CREATE TABLE "Blocked" (
    "userId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "blockId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("blockId") REFERENCES "Block" ("id")
);

CREATE TABLE "Blocker" (
    "userId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "blockId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id"),
    FOREIGN KEY ("blockId") REFERENCES "Block" ("id")
);
