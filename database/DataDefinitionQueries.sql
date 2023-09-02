-- Data Definition Queries for Chat App

-- Creates the following tables for the Chat App database:
--    Users, Servers, UserServers, Roles, Channels, UserChannels, 
--    ChannelTypes, FileTypes, Attachments, Messages, Reactions, Emojis, Invites

-- Drop tables if they exist
DROP TABLE IF EXISTS Reactions;
DROP TABLE IF EXISTS Emojis;
DROP TABLE IF EXISTS Attachments;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Invites;
DROP TABLE IF EXISTS UserChannels;
DROP TABLE IF EXISTS UserServers;
DROP TABLE IF EXISTS Channels;
DROP TABLE IF EXISTS ChannelTypes;
DROP TABLE IF EXISTS Servers;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Users;

-- Create the Users table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    userImageUrl VARCHAR(255)
);

-- Create the Servers table (previously Channels)
CREATE TABLE Servers (
    serverID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    serverName VARCHAR(100) NOT NULL,
    serverDescription VARCHAR(255),
    serverImageUrl VARCHAR(255)
);

-- Create the Roles table
CREATE TABLE Roles (
    roleID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    roleName VARCHAR(100) NOT NULL UNIQUE
);

-- Create the UserServers table (previously UserChannels)
CREATE TABLE UserServers (
    userServerID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    serverID INT NOT NULL,
    userID INT NOT NULL,
    roleID INT NOT NULL,
    FOREIGN KEY (serverID) REFERENCES Servers(serverID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID),
    CONSTRAINT uq_user_server UNIQUE (userID, serverID)
);

-- Create the ChannelTypes table (previously SubchannelTypes)
CREATE TABLE ChannelTypes (
    channelTypeID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    channelType VARCHAR(100) NOT NULL UNIQUE
);

-- Create the Channels table (previously Subchannels)
CREATE TABLE Channels (
    channelID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    serverID INT NOT NULL,
    roleID INT NOT NULL,
    channelTypeID INT NOT NULL,
    channelName VARCHAR(100) NOT NULL,
    FOREIGN KEY (serverID) REFERENCES Servers(serverID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID),
    FOREIGN KEY (channelTypeID) REFERENCES ChannelTypes(channelTypeID),
    CONSTRAINT unique_server_channel_name UNIQUE (serverID, channelName)
);

-- Create the UserChannels table (for M:M relationship between Users and Channels)
CREATE TABLE UserChannels (
    userChannelID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID INT NOT NULL,
    channelID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (channelID) REFERENCES Channels(channelID) ON DELETE CASCADE
);

-- Create the Messages table
CREATE TABLE Messages (
    messageID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID INT,
    channelID INT NOT NULL,
    text VARCHAR(1024) NOT NULL,
    time DATETIME NOT NULL,
    edited BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE SET NULL,
    FOREIGN KEY (channelID) REFERENCES Channels(channelID) ON DELETE CASCADE
);

-- Create the Attachments table
CREATE TABLE Attachments (
    attachmentID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    messageID INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    attachmentUrl VARCHAR(255) NOT NULL,
    FOREIGN KEY (messageID) REFERENCES Messages(messageID) ON DELETE CASCADE
);

-- Create the Emojis table
CREATE TABLE Emojis (
    emojiID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    emojiCode VARCHAR(255) NOT NULL UNIQUE,
    emojiName VARCHAR(100) NOT NULL
);

-- Create the Reactions table
CREATE TABLE Reactions (
    reactionID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    emojiID INT NOT NULL,
    userID INT NOT NULL,
    messageID INT NOT NULL,
    FOREIGN KEY (emojiID) REFERENCES Emojis(emojiID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (messageID) REFERENCES Messages(messageID) ON DELETE CASCADE
);

-- Create the Invites table
CREATE TABLE Invites (
    inviteID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    serverID INT NOT NULL,
    inviteCode VARCHAR(255) NOT NULL UNIQUE,
    expirationTime DATETIME NOT NULL,
    FOREIGN KEY (serverID) REFERENCES Servers(serverID) ON DELETE CASCADE
);


-- Populate the db with sample data
-- Insert sample data for Chat App

-- Users
INSERT INTO Users (username, email, password, userImageUrl)
VALUES
    ('user1', 'user1@example.com', 'password1', 'https://example.com/user-image.jpg'),
    ('user2', 'user2@example.com', 'password2', 'https://example.com/user-image.jpg'),
    ('user3', 'user3@example.com', 'password3', 'https://example.com/user-image.jpg'),
    ('user4', 'user4@example.com', 'password4', 'https://example.com/user-image.jpg'),
    ('user5', 'user5@example.com', 'password5', 'https://example.com/user-image.jpg'),
    ('user6', 'user6@example.com', 'password6', 'https://example.com/user-image.jpg');

-- Servers
INSERT INTO Servers (serverName, serverDescription, serverImageUrl)
VALUES
    ('server1', 'server 1 description', './images/cat-drawing.jpg'),
    ('server2', 'server 2 description', './images/cat1.jpg'),
    ('server3', 'server 3 description', './images/cat2.jpg');

-- Roles
INSERT INTO Roles (roleName)
VALUES
    ('Creator'),
    ('Admin'),
    ('Moderator'),
    ('Member');

-- UserServers
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 4),
    (2, 2, 1),
    (2, 1, 4),
    (2, 4, 4),
    (3, 5, 1),
    (3, 6, 2);

-- ChannelTypes
INSERT INTO ChannelTypes (channelType)
VALUES
    ('Text Channel'),
    ('Voice Channel');


-- Channels
INSERT INTO Channels (serverID, roleID, channelTypeID, channelName)
VALUES
    (1, 4, 1, 'General'),
    (2, 4, 1, 'General'),
    (3, 4, 1, 'General'),
    (1, 1, 1, 'Pokemon Champions Chat'),
    (2, 4, 1, 'Minecraft Chat'),
    (3, 4, 1, 'DND Chat'),
    (2, 4, 1, 'Leetcode'),
    (3, 4, 1, 'Personal Projects'),
    (1, 2, 1, 'Admin Only'),
    (1, 4, 2, 'Voice Chat');
    

-- UserChannels
INSERT INTO UserChannels (userID, channelID)
VALUES
    (3, 4);

-- Messages
INSERT INTO Messages (userID, channelID, text, time)
VALUES
    (1, 1, 'Hello World!', '2023-08-16 15:30:00'),
    (2, 1, 'Hello World Again!', '2023-08-16 15:31:00'),
    (3, 1, 'Whatup Dog!', '2023-08-16 15:33:00'),
    (2, 2, 'Hello Server 2 General!', '2023-08-16 15:30:00'),
    (1, 2, 'Hi there!', '2023-08-16 15:31:00'),
    (4, 2, 'Hello to you!', '2023-08-16 15:33:00'),
    (5, 3, 'Hello Server 3 General', '2023-08-16 15:31:00'),
    (6, 3, 'I also say hello!', '2023-08-16 15:33:00'),
    (3, 4, 'Gengar Rocks!', '2023-08-16 17:33:00'),
    (1, 7, 'I solved two sum!', '2023-08-16 15:33:00'),
    (2, 7, 'I solved three sum!', '2023-08-16 15:35:00'),
    (1, 9, 'Hello Admins!', '2023-08-16 15:31:00');

-- Emojis
INSERT INTO Emojis (emojiCode, emojiName)
VALUES
    ('U+1F604', 'Smile'),
    ('U+2764', 'Heart'),
    ('U+1F389', 'Party');

-- Reactions
INSERT INTO Reactions (emojiID, userID, messageID)
VALUES
    (1, 2, 10),
    (2, 1, 9),
    (3, 4, 5);

-- Invites
INSERT INTO Invites (serverID, inviteCode, expirationTime)
VALUES
    (1, 'abc123', '2023-09-15 00:00:00');

-- Attachments
INSERT INTO Attachments (messageID, filename, attachmentUrl)
VALUES
    (1, 'test.zip', 'http://example.com/test.zip');

