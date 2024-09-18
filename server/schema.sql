-- Table for storing users
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "verification_token" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "isVerified" BOOLEAN DEFAULT FALSE,
    "isOnline" BOOLEAN DEFAULT FALSE,
    "code" VARCHAR(255),
    "gender" VARCHAR(50),
    "sexualPreferences" VARCHAR(255),
    "biography" TEXT,
    "profilePictureUrl" VARCHAR(255),
    "location" VARCHAR(255),
    "fameRating" FLOAT,
    "gpsLatitude" FLOAT,
    "gpsLongitude" FLOAT,
    "lastSeen" TIMESTAMPTZ DEFAULT NOW(),
    "birthDate" DATE NOT NULL
    "interests" VARCHAR(255)[] DEFAULT '{}',
);

-- Table for reporting users as fake accounts
CREATE TABLE "Report" (
    "id" SERIAL PRIMARY KEY,
    "reportedAt" TIMESTAMPTZ DEFAULT NOW(),
    "reporterId" INT REFERENCES "User" ("id") ON DELETE CASCADE,  -- User who reports
    "reportedUserId" INT REFERENCES "User" ("id") ON DELETE CASCADE,  -- Reported user
    "reason" TEXT NOT NULL  -- Reason for reporting
);



-- Table for storing pictures
CREATE TABLE "Picture" (
    "id" SERIAL PRIMARY KEY,
    "url" VARCHAR(255) NOT NULL,
    "userId" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "isProfile" BOOLEAN DEFAULT FALSE
);

-- Table for storing visits
CREATE TABLE "Visit" (
    "id" SERIAL PRIMARY KEY,
    "visitedAt" TIMESTAMPTZ DEFAULT NOW(),
    "userId" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "visitedBy" INT REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Table for storing likes
CREATE TABLE "Like" (
    "id" SERIAL PRIMARY KEY,
    "likedAt" TIMESTAMPTZ DEFAULT NOW(),
    "userId" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "likedUserId" INT REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Table for storing blocks
CREATE TABLE "Block" (
    "id" SERIAL PRIMARY KEY,
    "blockedAt" TIMESTAMPTZ DEFAULT NOW(),
    "blockerId" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "blockedId" INT REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Table for storing connections
CREATE TABLE "Connection" (
    "id" SERIAL PRIMARY KEY,
    "connectedAt" TIMESTAMPTZ DEFAULT NOW(),
    "userId" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "connectionId" INT REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Table for storing messages
CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMPTZ DEFAULT NOW(),
    "dmId" INT REFERENCES "Dm" ("id") ON DELETE CASCADE
);

-- Table for storing direct messages (DMs)
CREATE TABLE "Dm" (
    "id" SERIAL PRIMARY KEY,
    "sentAt" TIMESTAMPTZ DEFAULT NOW(),
    "senderId" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "receiverId" INT REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Table for storing notifications
CREATE TABLE "Notification" (
    "id" SERIAL PRIMARY KEY,
    "type" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "userId" INT REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Many-to-many relationships

-- User to Picture
CREATE TABLE "_UserToPicture" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Picture" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Visit (visits)
CREATE TABLE "_UserToVisit" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Visit" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Visit (visitors)
CREATE TABLE "_UserToVisitor" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Visit" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Like (sent likes)
CREATE TABLE "_UserToSentLike" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Like" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Like (received likes)
CREATE TABLE "_UserToReceivedLike" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Like" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Blocker
CREATE TABLE "_UserToBlocker" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Block" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Blocked
CREATE TABLE "_UserToBlocked" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Block" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Connection (sent connections)
CREATE TABLE "_UserToSentConnection" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Connection" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Connection (received connections)
CREATE TABLE "_UserToReceivedConnection" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Connection" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- User to Notification
CREATE TABLE "_UserToNotification" (
    "A" INT REFERENCES "User" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Notification" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

-- Dm to Message
CREATE TABLE "_DmToMessage" (
    "A" INT REFERENCES "Dm" ("id") ON DELETE CASCADE,
    "B" INT REFERENCES "Message" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);
