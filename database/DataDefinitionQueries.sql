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
DROP TABLE IF EXISTS FileTypes;

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
    FOREIGN KEY (roleID) REFERENCES Roles(roleID)
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
    FOREIGN KEY (channelTypeID) REFERENCES ChannelTypes(channelTypeID)
);

-- Create the UserChannels table (for M:M relationship between Users and Channels)
CREATE TABLE UserChannels (
    userChannelID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID INT NOT NULL,
    channelID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (channelID) REFERENCES Channels(channelID) ON DELETE CASCADE
);

-- Create the FileTypes table
CREATE TABLE FileTypes (
    fileTypeID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    fileTypeName VARCHAR(100) NOT NULL
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
    fileTypeID INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    attachmentUrl VARCHAR(255) NOT NULL,
    FOREIGN KEY (messageID) REFERENCES Messages(messageID) ON DELETE CASCADE,
    FOREIGN KEY (fileTypeID) REFERENCES FileTypes(fileTypeID)
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
