-- Data Manipulation Language
-- DML commands for Chat App Database

-- --------------------------------------------------------------------------------------
-- Servers

-- Get all Servers that a user belongs to, selecting the server name, server image and id
SELECT s.serverID, s.serverName, s.serverDescription, s.serverImageUrl FROM Servers s
	INNER JOIN UserServers us on s.serverID = us.serverID
    WHERE us.userID = :userID;
    
-- Get a Server for a User using serverID and userID
SELECT s.serverID, s.serverName, s.serverDescription, s.serverImageUrl, us.roleID FROM Servers s 
	INNER JOIN UserServers us on s.serverID = us.serverID 
	WHERE s.serverID = ? AND us.userID = ?;

-- Get UserServer using userID and serverID
SELECT * FROM UserServers WHERE userID = :userID AND serverID = :serverID

-- Checks if there is a UserServer with userID and serverID
SELECT COUNT(*) FROM UserServers WHERE userID = :userID and serverID = :serverID

-- Checks if there is a UserServer with userID, serverID, and greater than or equal to a specifc roleID
SELECT COUNT(*) FROM UserServers WHERE userID = :userID AND serverID = :serverID AND roleID <= :roleID

-- Add a server using a given server name and optional serverImageUrl
INSERT INTO Servers (serverName, serverImageUrl, serverDescription) VALUES (:newServerName, :newServerImageUrl, :newServerDescription);

-- Add a user to the server (create UserServers) using the userID, serverID and roleID
INSERT INTO UserServers (userID, serverID, roleID) VALUES (:newUserID, :newServerID, :newRoleID);

-- Update serverImageUrl
UPDATE Servers SET serverImageUrl = :newServerImageUrl WHERE serverID = :serverID;

-- Update serverDescription
UPDATE Servers SET serverDescription = :newServerDescription WHERE serverID = :serverID;

-- Edit a users role in a server
UPDATE UserServers SET roleID = :newRoleID WHERE serverID = :serverID AND userID = :userID;

-- Delete a Server using a given serverID
DELETE FROM Servers WHERE serverID = :delServerID;

-- Delete a User From a Server given a userID and serverID
DELETE FROM UserServers WHERE serverID = :delServerID AND userID = :userID;

-- --------------------------------------------------------------------------------------
-- Invites

-- Create Invite using a given serverID, inviteCode, and expirationTime
INSERT INTO Invites (serverID, inviteCode, expirationTime) VALUES (:newServerID, :newInviteCode, :newExpirationTime);

-- Get Invite by InviteCode
SELECT serverID, expirationTime FROM Invites WHERE inviteCode = :inviteCode;

-- Delete Invite by inviteID
DELETE FROM Invites WHERE inviteID = :inviteID;

-- --------------------------------------------------------------------------------------
-- ChannelTypes

-- Get all ChannelTypes including the channelTypeID and channelType
SELECT channelTypeID, channelType FROM ChannelTypes;

-- --------------------------------------------------------------------------------------
-- Channels

-- Get all Channels in a particular server for a user
SELECT c.channelID, c.roleID, c.channelTypeID, c.channelName
            FROM Channels c
            LEFT JOIN UserChannels uc ON c.channelID = uc.channelID AND uc.userID = ?
            LEFT JOIN UserServers us ON us.serverID = c.serverID AND us.userID = ?
            WHERE (uc.channelID IS NOT NULL OR us.roleID <= c.roleID) AND
                c.serverID = ?;
                
-- Get all Channels for a user
            SELECT c.channelID, c.roleID, c.channelTypeID, c.channelName, c.serverID, cr.lastRead as userRead,
                (SELECT MAX(m.time) FROM Messages m
                    WHERE m.channelID = c.channelID)
                        AS channelTime
            FROM Channels c
            LEFT JOIN UserChannels uc ON c.channelID = uc.channelID AND uc.userID = ?
            LEFT JOIN UserServers us ON us.serverID = c.serverID AND us.userID = ?
            LEFT JOIN ChannelRead cr ON cr.channelID = c.channelID AND cr.userID = ?
            WHERE (uc.channelID IS NOT NULL OR us.roleID <= c.roleID);

-- Get data for a Channel by id, only if the user has the correct user channel or role
SELECT c.channelID, c.roleID, c.channelTypeID, c.channelName
            FROM Channels c
            LEFT JOIN UserChannels uc ON c.channelID = uc.channelID AND uc.userID = ?
            LEFT JOIN UserServers us ON us.serverID = c.serverID AND us.userID = ?
            WHERE c.channelID = ?
                AND ((uc.channelID IS NOT NULL OR us.roleID <= c.roleID)
                AND c.serverID = ?)
                
-- Check if there is already a Channel in the Server with the same name
SELECT COUNT(*) FROM Channels WHERE serverID = :serverID AND channelName = :channelName

-- Check if a User is in a Channel using both UserChannels and UserServers.roleID
SELECT 1 FROM UserChannels
                WHERE userID = :userID AND channelID = :channelID
                UNION ALL
                SELECT 1 FROM UserServers us
                INNER JOIN Channels c ON us.serverID = c.serverID
                WHERE us.userID = :userID AND c.channelID = :channelID
                  AND us.roleID <= c.roleID
                LIMIT 1;
                
-- Add a channel using a given serverID, roleID, channelTypeID, and channelName
INSERT INTO Channels (serverID, roleID, channelTypeID, channelName) VALUES (:newServerID, :newRoleID, :newChannelTypeID, :newChannelName);

-- Add a user to a channel (Create UserChannels) using a given userID and channelID
INSERT INTO UserChannels (userID, channelID) VALUES (:newUserID, :newChannelID);

-- Add/Update ChannelRead
INSERT INTO ChannelRead (userID, channelID, lastRead)
VALUES (:userID, :channelID, :lastRead)
ON DUPLICATE KEY UPDATE lastRead = :lastRead;

-- Remove a user from a channel (Delete UserChannels) using a given userID and channelID
DELETE FROM UserChannels WHERE userID = :userID and channelID = :delChannelID;

-- Delete a Channel using a given channelID
DELETE FROM Channels WHERE channelID = :delChannelID;

-- Edit the channel roleID using the channelID
UPDATE Channels SET roleID = :newRoleID WHERE channelID = :updateChannelID;

-- Edit the channel channelName using the channelID
UPDATE Channels SET channelName = :newChannelName WHERE channelID = :updateChannelID;

-- Edit the channel roleID and channelName using the channelID
UPDATE Channels SET channelName = :newChannelName, roleID = :newRoleID WHERE channelID = :updateChannelID;

-- --------------------------------------------------------------------------------------
-- Messages

-- Get all Messages in a particular channel, get all Reactions to each message, get all Attachments to each message
-- including the attachmentUrl, filename, attachmentID
SELECT m.messageID, m.text, m.time, m.edited, u.username, u.userID,
       r.reactionID, r.userID as reactionUserID, r.emojiID,
       a.attachmentID, a.attachmentUrl, a.filename
FROM Messages m
LEFT JOIN Users u ON m.userID = u.userID
LEFT JOIN Reactions r ON m.messageID = r.messageID
LEFT JOIN Attachments a ON m.messageID = a.messageID
WHERE m.channelID = :channelID;

-- Checks if a message with the messageID and userID exists
SELECT COUNT(*) FROM Messages WHERE messageID = :messageID AND userID = :userID;

-- Get all Emojis, including its emojiID, emojiCode, and emojiName
SELECT emojiID, emojiCode, emojiName FROM Emojis;

-- Add a message using a given text, time, userID, and channelID
INSERT INTO Messages (text, time, userID, channelID) VALUES (:newText, :newTime, :newUserID, :newChannelID);

-- Add a reaction to a message using a given emojiID, userID and messageID
INSERT INTO Reactions (emojiID, userID, messageID) VALUES (:newEmojiID, :newUserID, :newMessageID);

-- Add an attachment to a message using a given filename, url, messageID
INSERT INTO Attachments (filename, attachmentUrl, messageID) VALUES (:newFileName, :newAttachmentUrl, :newMessageID);

-- Delete a message using a given messageID
DELETE FROM Messages WHERE messageID = :delMessageID;

-- Check if the userID and reactionID match, used to verify delete auth
SELECT COUNT(*) FROM Reactions
	WHERE reactionID = ? AND userID = ?;

-- Check the role of the user in the server for the reaction, based on userID and reactionID
SELECT us.roleID FROM Reactions r
	JOIN Messages m ON r.messageID = m.messageID
    JOIN Channels c ON m.channelID = c.channelID
    JOIN Servers s ON c.serverID = s.serverID
    JOIN UserServers us ON s.serverID = us.serverID AND :userID = us.userID
    WHERE r.reactionID = :reactionID;
    
-- Gets the reaction with channelID based on reactionID (used to broadcast the data when deleting)
SELECT r.reactionID, r.userID, r.emojiID, r.messageID, c.channelID FROM Reactions r
	JOIN Messages m ON r.messageID = m.messageID
	JOIN Channels c ON m.channelID = c.channelID
	WHERE r.reactionID = ?;

-- Delete a reaction using a given reactionID
DELETE FROM Reactions WHERE reactionID = :delReactionID;

-- Delete an attachment using a given attachmentID
DELETE FROM Attachments WHERE attachmentID = :delAttachmentID;

-- Edit a message text, time, set edited to true using a given messageID
UPDATE Messages SET text = :newText, time = :newTime, edited = true WHERE messageID = :messageID;

-- Edit a message time, set edited to true using a given messageID (use if deleting an attachment)
UPDATE Messages SET time = :newTime, edited = true WHERE messageID = :messageID;

-- --------------------------------------------------------------------------------------
-- Users

-- Get a User by userID
SELECT * FROM Users WHERE userID = :userID;

-- Get a User by email
SELECT * FROM Users WHERE email = :email;

-- Get all Users in a channel, either they are listed in UserChannels or they are listed in UserServers with a high enough roleID
SELECT us.userID FROM UserServers us, Channels c 
WHERE us.serverID = :serverID AND c.channelID = :channelID AND us.roleID <= c.roleID
UNION 
SELECT uc.userID FROM UserChannels uc WHERE uc.channelID = :channelID;

-- Get all users in a Server
SELECT us.userID, u.username, u.userImageUrl, us.roleID FROM UserServers us
	LEFT JOIN Users u ON us.userID = u.userID
	WHERE us.serverID = :serverID;

-- Add a user using a given username, email, password, and userImageUrl
INSERT INTO Users (username, email, password, userImageUrl) VALUES (:newUsername, :newEmail, :newPassword, :newUserImageUrl);

-- Edit a user password using a given userID
UPDATE Users SET password =:newPassword WHERE userID = :userID;

-- Edit a user userImageUrl using a given userID
UPDATE Users SET userImageURL = :newUserImageUrl WHERE userID = :userID;

-- Delete a User using a given userID
DELETE FROM Users WHERE userID = :delUserID;

