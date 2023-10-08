-- Data Definition Queries for Chat App

-- Creates the following tables for the Chat App database:
--    Users, Servers, UserServers, Roles, Channels, UserChannels, 
--    ChannelTypes, FileTypes, Attachments, Messages, Reactions, Emojis, Invites, ChannelRead

-- Drop tables if they exist
DROP TABLE IF EXISTS Reactions;
DROP TABLE IF EXISTS Emojis;
DROP TABLE IF EXISTS Attachments;
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Invites;
DROP TABLE IF EXISTS UserChannels;
DROP TABLE IF EXISTS UserServers;
DROP TABLE IF EXISTS ChannelRead;
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
    createdDate DATE NOT NULL,
    userID INT NOT NULL,
    FOREIGN KEY (serverID) REFERENCES Servers(serverID) ON DELETE CASCADE
);

-- Create the ChannelRead Table
CREATE TABLE ChannelRead (
    userID INT,
    channelID INT,
    lastRead DATETIME,
    PRIMARY KEY (userID, channelID),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (channelID) REFERENCES Channels(channelID) ON DELETE CASCADE
);


-- Populate the db with sample data
-- Insert sample data for Chat App

-- Users
INSERT INTO Users (username, email, password, userImageUrl)
VALUES
    ('Tinker', 'tinker@example.com', '$2a$10$x1pkkIxb.bnGa7ydDpFou.P.m8uHHhesjuiaD/36BT1rHYEGlwKGe', './images/dog1.jpg'),
    ('Layla', 'layla@example.com', '$2a$10$x1pkkIxb.bnGa7ydDpFou.P.m8uHHhesjuiaD/36BT1rHYEGlwKGe', './images/cat1.jpg'),
    ('Bella', 'bella@example.com', '$2a$10$x1pkkIxb.bnGa7ydDpFou.P.m8uHHhesjuiaD/36BT1rHYEGlwKGe', './images/cat2.jpg'),
	('Lisa', 'lisa@example.com', '$2a$10$x1pkkIxb.bnGa7ydDpFou.P.m8uHHhesjuiaD/36BT1rHYEGlwKGe', './images/lisa.jpg'),
	('Guest1', 'guest1@example.com', '$2a$10$x1pkkIxb.bnGa7ydDpFou.P.m8uHHhesjuiaD/36BT1rHYEGlwKGe', null),
    ('Guest2', 'guest2@example.com', '$2a$10$x1pkkIxb.bnGa7ydDpFou.P.m8uHHhesjuiaD/36BT1rHYEGlwKGe', './images/cat-drawing.jpg');

-- Servers
INSERT INTO Servers (serverName, serverDescription, serverImageUrl)
VALUES
	('Gaming Guild', 'WOW Group', './images/cat1.jpg'),
    ('Tech Talk', 'All about tech', null),
    ('Foodies', 'All about food', null),
    ('Bookworms Haven', 'Book talks', './images/dog1.jpg'),
    ('Movie Buffs', 'Movie Talk', './images/cat2.jpg'),
    ('Sport Fanatics', 'Sports', null),
    ('Study Group', 'Study group', './images/lisa.jpg'),
    ('The Hangout', 'A place to hangout', null),
    ('Cat Talk', 'For people that like cats', './images/cat2.jpg');
	
    
-- Roles
INSERT INTO Roles (roleName)
VALUES
    ('Creator'),
    ('Admin'),
    ('Moderator'),
    ('Member');

-- UserServers
-- For 'Tinker' (userID 1)
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (1, 1, 1),  -- 'Gaming Guild' - Creator role
    (2, 1, 2),  -- 'Tech Talk' - Admin role
    (3, 1, 3),  -- 'Foodies' - Moderator role
    (4, 1, 4),  -- 'Bookworms Haven' - Member role
    (5, 1, 4),  -- 'Movie Buffs' - Member role
    (6, 1, 4),  -- 'Sport Fanatics' - Member role
    (7, 1, 2),  -- 'Study Group' - Admin role
    (8, 1, 2),  -- 'The Hangout' - Admin role
    (9, 1, 3);  -- 'Cat Talk' - Moderator role

-- For 'Layla' (userID 2)
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (2, 2, 1),  -- 'Tech Talk' - Creator role
    (7, 2, 2),  -- 'Study Group' - Member role
    (8, 2, 4),  -- 'The Hangout' - Member role
    (9, 2, 4);  -- 'Cat Talk' - Member role

-- For 'Bella' (userID 3)
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (1, 3, 4),  -- 'Gaming Guild' - Member role
    (2, 3, 4),  -- 'Tech Talk' - Member role
    (3, 3, 1),  -- 'Foodies' - Creator role
    (4, 3, 4),  -- 'Bookworms Haven' - Member role
    (7, 3, 4),  -- 'Study Group' - Member role
    (9, 3, 4);  -- 'Cat Talk' - Member role

-- For 'Lisa' (userID 4)
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (1, 4, 4),  -- 'Gaming Guild' - Member role
    (2, 4, 4),  -- 'Tech Talk' - Member role
    (3, 4, 4),  -- 'Foodies' - Member role
    (4, 4, 1),  -- 'Bookworms Haven' - Creator role
    (5, 4, 4),  -- 'Movie Buffs' - Member role
    (6, 4, 4),  -- 'Sport Fanatics' - Member role
    (7, 4, 1),  -- 'Study Group' - Creator role
    (8, 4, 2),  -- 'The Hangout' - Admin role
    (9, 4, 4);  -- 'Cat Talk' - Member role
    
-- For 'Guest1' (userID 5)
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (1, 5, 2),  -- 'Gaming Guild' - Admin role
    (2, 5, 2),  -- 'Tech Talk' - Admin role
    (3, 5, 3),  -- 'Foodies' - Moderator role
    (4, 5, 4),  -- 'Bookworms Haven' - Member role
    (5, 5, 1),  -- 'Movie Buffs' - Creator role
    (6, 5, 4),  -- 'Sport Fanatics' - Member role
    (7, 5, 4),  -- 'Study Group' - Member role
    (8, 5, 1),  -- 'The Hangout' - Creator role
    (9, 5, 3);  -- 'Cat Talk' - Moderator role

-- For 'Guest2' (userID 6)
INSERT INTO UserServers (serverID, userID, roleID)
VALUES
    (1, 6, 4),  -- 'Gaming Guild' - Member role
    (2, 6, 4),  -- 'Tech Talk' - Member role
    (3, 6, 3),  -- 'Foodies' - Moderator role
    (4, 6, 4),  -- 'Bookworms Haven' - Member role
    (5, 6, 2),  -- 'Movie Buffs' - Admin role
    (6, 6, 1),  -- 'Sport Fanatics' - Creator role
    (7, 6, 4),  -- 'Study Group' - Member role
    (8, 6, 4),  -- 'The Hangout' - Member role
    (9, 6, 1);  -- 'Cat Talk' - Creator role


-- ChannelTypes
INSERT INTO ChannelTypes (channelType)
VALUES
    ('Text Channel'),
    ('Voice Channel');


INSERT INTO Channels (serverID, roleID, channelTypeID, channelName)
VALUES
  (1, 4, 1, 'General'),
  (1, 2, 1, 'Admins'),
  (1, 4, 1, 'Game Recommendations'),
  (1, 4, 1, 'League of Legends Strategies'),
  (1, 4, 1, 'Speedrunning Challenges'),
  
  (2, 4, 1, 'General'),
  (2, 4, 1, 'Software Development'),
  (2, 4, 1, 'Coding Help'),
  (2, 4, 1, 'Tech News'),
  (2, 4, 1, 'Mobile Apps'),
  (2, 4, 1, 'Web Development'),
  
  (3, 4, 1, 'General'),
  (3, 4, 1, 'Recipes Exchange'),
  (3, 4, 1, 'Restaurant Reviews'),
  (3, 4, 1, 'Cooking Tips'),
  (3, 4, 1, 'Vegetarian Delights'),
  (3, 4, 1, 'Wine and Spirits'),
  
  (4, 4, 1, 'General'),
  (4, 2, 1, 'Book Recommendations'),
  (4, 4, 1, 'Fantasy Novels'),
  (4, 4, 1, 'Mystery Thrillers'),
  (4, 4, 1, 'Reading Challenges'),
  
  (5, 4, 1, 'General'),
  (5, 2, 1, 'Movie Recommendations'),
  (5, 4, 1, 'Hollywood Gossip'),
  (5, 4, 1, 'Film Analysis'),
  (5, 4, 1, 'Oscars Discussion'),
  (5, 4, 1, 'Movie Night Planning'),
  
  (6, 2, 1, 'General'),
  (6, 4, 1, 'Sports News'),
  (6, 3, 1, 'Sports Betting'),
  (6, 4, 1, 'Fitness and Health'),
  
  (7, 4, 1, 'General'),
  (7, 4, 1, 'Study Resources'),
  (7, 4, 1, 'Exam Prep'),
  (7, 4, 1, 'Language Learning'),
  (7, 4, 1, 'Study Breaks'),
  
  (8, 4, 1, 'General'),
  (8, 4, 1, 'Music Lovers'),
  (8, 4, 1, 'Movie Night'),
  (8, 4, 1, 'Memes and Funny Stuff'),
  
  (9, 4, 1, 'General Cat Chat'),
  (9, 4, 1, 'Cat Memes'),
  (9, 4, 1, 'Cat Toys and Accessories');

-- UserChannels
-- INSERT INTO UserChannels (userID, channelID)
-- VALUES
    

-- Messages
-- Messages in Channel 1 (General)
-- Messages
-- Messages
INSERT INTO Messages (userID, channelID, text, time)
VALUES
    -- Channel 1 (General)
    (1, 1, 'Hello, everyone!', '2023-10-06 12:00:00'),
    (4, 1, 'Hey there!', '2023-10-06 12:05:00'),
    (3, 1, 'Good afternoon!', '2023-10-06 12:10:00'),

    -- Channel 2 (Admins)
    (1, 2, 'Admins, we have a new member!', '2023-10-06 13:00:00'),
    (5, 2, 'Welcome!', '2023-10-06 13:05:00'),
    (1, 2, 'Let me know if you need anything.', '2023-10-06 13:10:00'),

    -- Channel 3 (Game Recommendations)
    (1, 3, 'Has anyone played the latest RPG?', '2023-10-06 14:00:00'),
    (6, 3, 'I heard it\'s fantastic!', '2023-10-06 14:05:00'),

    -- Channel 4 (League of Legends Strategies)
    (1, 4, 'Looking for a good ADC for my team.', '2023-10-06 15:00:00'),
    (6, 4, 'I recommend Jinx!', '2023-10-06 15:05:00'),

    -- Channel 13 (Recipes Exchange)
    (3, 13, 'Just made a delicious lasagna!', '2023-10-06 16:00:00'),
    (4, 13, 'I\'d love the recipe!', '2023-10-06 16:05:00'),

    -- Channel 15 (Cooking Tips)
    (3, 15, 'How do you make the perfect omelette?', '2023-10-06 17:00:00'),
    (4, 15, 'Here are some tips: ...', '2023-10-06 17:05:00'),

    -- Channel 19 (Book Recommendations)
    (2, 19, 'I just finished a great book!', '2023-10-06 18:00:00'),
    (4, 19, 'What\'s the title?', '2023-10-06 18:05:00'),

    -- Channel 20 (Fantasy Novels)
    (1, 20, 'I love reading fantasy novels!', '2023-10-06 19:00:00'),
    (4, 20, 'Me too! Have you read...', '2023-10-06 19:05:00'),

    -- Channel 25 (Hollywood Gossip)
    (5, 25, 'Did you hear about the new movie coming out?', '2023-10-06 20:00:00'),
    (6, 25, 'Yes, it looks amazing!', '2023-10-06 20:05:00'),

    -- Channel 26 (Film Analysis)
    (5, 26, 'Let\'s analyze the latest film!', '2023-10-06 21:00:00'),
    (6, 26, 'I noticed some interesting themes...', '2023-10-06 21:05:00'),

    -- Channel 27 (Oscars Discussion)
    (5, 27, 'Who do you think will win Best Actor?', '2023-10-06 22:00:00'),
    (6, 27, 'It\'s a tough category this year!', '2023-10-06 22:05:00'),

    -- Channel 30 (Sports News)
    (6, 30, 'Any big sports news today?', '2023-10-06 23:00:00'),
    (1, 30, 'I heard there was a major upset!', '2023-10-06 23:05:00'),

    -- Channel 31 (Sports Betting)
    (6, 31, 'I placed a bet on the game tomorrow.', '2023-10-07 00:00:00'),
    (1, 31, 'Good luck! What are the odds?', '2023-10-07 00:05:00'),

    -- Channel 34 (Study Resources)
    (1, 34, 'Anyone have good study materials for math?', '2023-10-07 01:00:00'),
    (6, 34, 'I can recommend some websites.', '2023-10-07 01:05:00'),

    -- Channel 35: Exam Prep
    (1, 35, 'Anyone have tips for the upcoming exams?', '2023-10-07 02:00:00'),
    (6, 35, 'Let\'s create a study group!', '2023-10-07 02:05:00'),

    -- Channel 36: Language Learning
    (1, 36, 'I\'m learning C++. Any recommendations?', '2023-10-07 03:00:00'),
    (2, 36, 'I like udemy', '2023-10-07 03:05:00'),

    -- Channel 37: Study Breaks
    (1, 37, 'Taking a break from studying. What\'s up?', '2023-10-07 04:00:00'),
    (3, 37, 'I just watched a funny video.', '2023-10-07 04:05:00'),

    -- Channel 38: General
    (4, 38, 'Hello, everyone in the server!', '2023-10-07 05:00:00'),
    (6, 38, 'Any plans for the weekend?', '2023-10-07 05:05:00'),

    -- Channel 39: Music Lovers
    (4, 39, 'What\'s your favorite music genre?', '2023-10-07 06:00:00'),
    (5, 39, 'I love rock music!', '2023-10-07 06:05:00'),

    -- Channel 40: Movie Night
    (4, 40, 'Let\'s plan a movie night this Friday.', '2023-10-07 07:00:00'),
    (6, 40, 'I\'m in! What movie should we watch?', '2023-10-07 07:05:00'),

    -- Channel 41: Memes and Funny Stuff
    (4, 41, 'Share your favorite memes here!', '2023-10-07 08:00:00'),
    (5, 41, 'This one always cracks me up.', '2023-10-07 08:05:00'),

    -- Channel 42: General Cat Chat
    (5, 42, 'Meow! Cat lovers unite!', '2023-10-07 09:00:00'),
    (6, 42, 'My cat just did the funniest thing.', '2023-10-07 09:05:00'),

    -- Channel 29: Cat Memes
    (5, 29, 'Post your favorite cat memes here.', '2023-10-07 10:00:00'),
    (6, 29, 'Cats are the best meme material!', '2023-10-07 10:05:00'),

    -- Channel 43: Cat Toys and Accessories
    (5, 43, 'What are the best toys for cats?', '2023-10-07 11:00:00'),
    (6, 43, 'I recommend interactive toys.', '2023-10-07 11:05:00');

-- Emojis
INSERT INTO Emojis (emojiCode, emojiName)
VALUES
   ('😊', 'Happy'),
   ('❤️', 'Love'),
   ('😂', 'Laugh'),
   ('👍', 'ThumbsUp'),
   ('🙏', 'Prayer'),
   ('😍', 'Admire'),
   ('😎', 'Cool'),
   ('🎉', 'Party');

-- Reactions

INSERT INTO Reactions (emojiID, userID, messageID)
VALUES
    (1, 1, 1),  -- '😊' reaction by 'Tinker' to the first message
    (3, 3, 2),  -- '😂' reaction by 'Bella' to the second message
    (4, 4, 3),  -- '👍' reaction by 'Lisa' to the third message
    (5, 1, 4),  -- '🙏' reaction by 'Tinker' to the fourth message
    (1, 1, 7),  -- '😊' reaction by 'Tinker' to the seventh message
    (3, 3, 8),  -- '😂' reaction by 'Bella' to the eighth message
    (4, 4, 9),  -- '👍' reaction by 'Lisa' to the ninth message
    (5, 1, 10),  -- '🙏' reaction by 'Tinker' to the tenth message
    (7, 3, 11),  -- '😎' reaction by 'Bella' to the eleventh message
    (8, 4, 12),  -- '🎉' reaction by 'Lisa' to the twelfth message
    (1, 1, 13),  -- '😊' reaction by 'Tinker' to the thirteenth message
    (6, 6, 13),  -- '❤️' reaction by 'Guest2' to the thirteenth message
    (3, 3, 14),  -- '😂' reaction by 'Bella' to the fourteenth message
    (4, 4, 15),  -- '👍' reaction by 'Lisa' to the fifteenth message
    (5, 1, 16),  -- '🙏' reaction by 'Tinker' to the sixteenth message
    (6, 2, 16),  -- '😍' reaction by 'Layla' to the sixteenth message
    (7, 3, 17),  -- '😎' reaction by 'Bella' to the seventeenth message
    (8, 4, 18),  -- '🎉' reaction by 'Lisa' to the eighteenth message;
    (1, 1, 19),  -- '😊' reaction by 'Tinker' to the nineteenth message
    (2, 5, 19),  -- '❤️' reaction by 'Guest1' to the nineteenth message
    (3, 6, 20),  -- '😂' reaction by 'Guest2' to the twentieth message
    (4, 4, 20),  -- '👍' reaction by 'Lisa' to the twentieth message
    (1, 1, 21),  -- '😊' reaction by 'Tinker' to the twenty-first message
    (2, 2, 21),  -- '❤️' reaction by 'Layla' to the twenty-first message
    (3, 3, 22),  -- '😂' reaction by 'Bella' to the twenty-second message
    (4, 4, 23),  -- '👍' reaction by 'Lisa' to the twenty-third message
    (5, 1, 24),  -- '🙏' reaction by 'Tinker' to the twenty-fourth message
    (6, 4, 24),  -- '😍' reaction by 'Lisa' to the twenty-fourth message
    (7, 1, 25),  -- '😎' reaction by 'Tinker' to the twenty-fifth message
    (8, 4, 26),  -- '🎉' reaction by 'Lisa' to the twenty-sixth message
    (1, 1, 27),  -- '😊' reaction by 'Tinker' to the twenty-seventh message
    (2, 2, 27),  -- '❤️' reaction by 'Layla' to the twenty-seventh message
    (3, 3, 28),  -- '😂' reaction by 'Bella' to the twenty-eighth message
    (4, 4, 29),  -- '👍' reaction by 'Lisa' to the twenty-ninth message
    (5, 1, 30),  -- '🙏' reaction by 'Tinker' to the thirtieth message
    (6, 2, 30),  -- '😍' reaction by 'Layla' to the thirtieth message
    (7, 3, 31),  -- '😎' reaction by 'Bella' to the thirty-first message
    (8, 4, 32),  -- '🎉' reaction by 'Lisa' to the thirty-second message
    (1, 1, 33),  -- '😊' reaction by 'Tinker' to the thirty-third message
    (2, 2, 33),  -- '❤️' reaction by 'Layla' to the thirty-third message
    (3, 3, 34),  -- '😂' reaction by 'Bella' to the thirty-fourth message
    (4, 4, 35),  -- '👍' reaction by 'Lisa' to the thirty-fifth message
    (5, 1, 36),  -- '🙏' reaction by 'Tinker' to the thirty-sixth message
    (6, 2, 36),  -- '😍' reaction by 'Layla' to the thirty-sixth message
    (8, 4, 38),  -- '🎉' reaction by 'Lisa' to the thirty-eighth message
    (1, 1, 39),  -- '😊' reaction by 'Tinker' to the thirty-ninth message
    (2, 2, 39),  -- '❤️' reaction by 'Layla' to the thirty-ninth message
    (4, 4, 41),  -- '👍' reaction by 'Lisa' to the forty-first message
    (5, 1, 42),  -- '🙏' reaction by 'Tinker' to the forty-second message
    (6, 2, 42),  -- '😍' reaction by 'Layla' to the forty-second message
    (7, 1, 43),  -- '😎' reaction by 'Tinker' to the forty-third message
    (8, 4, 44),  -- '🎉' reaction by 'Lisa' to the forty-fourth message
    (1, 1, 45),  -- '😊' reaction by 'Tinker' to the forty-fifth message
    (2, 2, 45),  -- '❤️' reaction by 'Layla' to the forty-fifth message
    (3, 3, 46),  -- '😂' reaction by 'Bella' to the forty-sixth message
    (4, 4, 47),  -- '👍' reaction by 'Lisa' to the forty-seventh message
    (5, 1, 48),  -- '🙏' reaction by 'Tinker' to the forty-eighth message
    (6, 2, 48),  -- '😍' reaction by 'Layla' to the forty-eighth message
    (7, 3, 49),  -- '😎' reaction by 'Bella' to the forty-ninth message
    (8, 4, 50);  -- '🎉' reaction by 'Lisa' to the fiftieth message

-- Invites
-- INSERT INTO Invites (serverID, inviteCode, expirationTime)
-- VALUES
    

-- Attachments
-- INSERT INTO Attachments (messageID, filename, attachmentUrl)
-- VALUES
--     (1, 'test.zip', 'http://example.com/test.zip');

