-- Data Manipulation Language
-- DML commands for Chat App Database

-- --------------------------------------------------------------------------------------
-- Servers

-- Get all Servers that a user belongs to, selecting the server name, server image and id
SELECT s.serverID, s.serverName, s.serverImageUrl FROM Servers s
	INNER JOIN UserServers us on s.serverID = us.serverID
    WHERE us.userID = :userID

-- Add a server using a given server name and optional serverImageUrl
INSERT INTO Servers (serverName, serverImageUrl) VALUES (:newServerName, :newServerImageUrl);

-- Add a user to the server (create UserServers) using the userID, serverID and roleID
INSERT INTO UserServers (userID, serverID, roleID) VALUES (:newUserID, :newServerID, :newRoleID);

-- Update serverImageUrl
UPDATE Servers SET serverImageUrl = :newServerImageUrl WHERE serverID = :serverID;

-- Update serverDescription
UPDATE Servers SET serverDescription = :newServerDescription WHERE serverID = :serverID;

-- Delete a Server using a given serverID
DELETE FROM Servers WHERE serverID = :delServerID;

-- --------------------------------------------------------------------------------------
-- Invites

-- Create Invite using a given serverID, inviteCode, and expirationTime
INSERT INTO Invites (serverID, inviteCode, expirationTime) VALUES (:newServerID, :newInviteCode, :newExpirationTime);


-- --------------------------------------------------------------------------------------
-- Channels

-- Get all Channels in a particular server
SELECT channelID, channelName FROM Channels WHERE serverID = :serverID;

-- Get all ChannelTypes including the channelTypeID and channelType
SELECT channelTypeID, channelType FROM ChannelTypes;

-- Add a channel using a given serverID, roleID, channelTypeID, and channelName
INSERT INTO Channels (serverID, roleID, channelTypeID, channelName) VALUES (:newServerID, :newRoleID, :newChannelTypeID, :newChannelName);

-- Add a user to a channel (Create UserChannels) using a given userID and channelID
INSERT INTO UserChannels (userID, channelID) VALUES (:newUserID, :newChannelID)

-- Remove a user from a channel (Delete UserChannels) using a given userID and channelID
DELETE FROM UserChannels WHERE userID = :userID and channelID = :delChannelID;

-- Delete a Channel using a given channelID
DELETE FROM Channels WHERE channelID = :delChannelID

-- Edit the channel roleID using the channelID
UPDATE Channels SET roldID = :newRoldID WHERE channelID = updateChannelID;

-- Edit the channel channelName using the channelID
UPDATE Channels SET channelName = :newChannelName WHERE channelID = updateChannelID;

-- Edit the channel roleID and channelName using the channelID
UPDATE Channels SET channelName = :newChannelName, roldID = :newRoldID WHERE channelID = updateChannelID;

-- --------------------------------------------------------------------------------------
-- Messages

-- Get all Messages in a particular channel, get all Reactions to each message including the emojiCode, emojiName, and username
SELECT m.messageID, m.text, m.time, m.edited, u.username,
       r.reactionID, e.emojiCode, e.emojiName
FROM Messages m
LEFT JOIN Users u ON m.userID = u.userID
LEFT JOIN Reactions r ON m.messageID = r.messageID
LEFT JOIN Emojis e ON r.emojiID = e.emojiID
WHERE m.channelID = :channelID;

-- Get all Emojis, including its emojiID, emojiCode, and emojiName
SELECT emojiID, emojiCode, emojiName FROM Emojis;

-- Get all FileTypes including the fileTypeID and fileTypeName
SELECT fileTypeID, fileTypeName FROM FileTypes;

-- Add a message using a given text, time, userID, and channelID
INSERT INTO Messages (text, time, userID, channelID) VALUES (:newText, :newTime, :newUserID, :newChannelID);

-- Add a reaction to a message using a given emojiID, userID and messageID
INSERT INTO Reactions (emojiID, userID, messageID) VALUES (:newEmojiID, :newUserID, :newMessageID);

-- Add an attachment to a message using a given filename, url, messageID, and fileTypeID
INSERT INTO Attachments (filename, attachmentUrl, messageID, fileTypeID) VALUES (:newFileName, :newAttachmentUrl, :newMessageID, :newFileTypeID);

-- Delete a message using a given messageID
DELETE FROM Messages WHERE messageID = :delMessageID;

-- Delete a reaction using a given reactionID
DELETE FROM Reactions WHERE reactionID = :delReactionID;

-- Delete an attachment using a given attachmentID
DELETE FROM Attachments WHERE attachmentID = :delAttachmentID;

-- Edit a message text, time, set edited to true using a given messageID
UPDATE Messages SET text = :newText, time = :newTime, edited = true WHERE messageID = :messageID

-- Edit a message time, set edited to true using a given messageID (use if deleting an attachment)
UPDATE Messages SET time = :newTime, edited = true WHERE messageID = :messageID

-- --------------------------------------------------------------------------------------
-- Users

-- Get a User by userID
SELECT * FROM Users WHERE userID = :userID;

-- Get a User by email
SELECT * FROM Users WHERE email = :email

-- Get all Users in a channel, either they are listed in UserChannels or they are listed in UserServers with a high enough roleID
SELECT u.userID, u.username
FROM Users u
LEFT JOIN UserChannels uc ON u.userID = uc.userID
LEFT JOIN UserServers us ON u.userID = us.userID
WHERE uc.channelID = :channelID
   OR (us.serverID = :serverID AND us.roleID <= :channelRoleID);


-- Add a user using a given username, email, password, and userImageUrl
INSERT INTO Users (username, email, password, userImageUrl) VALUES (:newUsername, :newEmail, :newPassword, :newUserImageUrl);

-- Edit a user password using a given userID
UPDATE Users SET password =:newPassword WHERE userID = :userID;

-- Edit a user userImageUrl using a given userID
UPDATE Users SET userImageURL = :newUserImageUrl WHERE userID = :userID;

-- Delete a User using a given userID
DELETE FROM Users WHERE userID = :delUserID;

