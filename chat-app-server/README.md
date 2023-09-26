# ChatApp Server API Documentation

Welcome to the ChatApp Server API Documentation! This guide provides detailed information about the API endpoints available for interacting with the ChatApp server. Below you'll find information on how to make requests, what each endpoint does, and example request and response structures.

## Table of Contents

- [Channels](#channels)
- [Emojis](#emojis)
- [Invites](#invites)
- [Messages](#messages)
- [Reactions](#reactions)
- [Servers](#servers)
- [Users](#users)

## Channels

### Create Channel/UserChannel

- `POST /servers/{serverID}/channels`: Create a new channel.

  - Request:
    ```json
    {
      "serverID": 123,
      "roleID": 456,
      "channelTypeID": 789,
      "channelName": "General"
    }
    ```
  - Response:
    - Status: 201 Created
      ```json
      { "channelID": 123 }
      ```

- `POST /servers/{serverID}/channels/{channelID}/users/{userID}`:
  Add a user to a channel.
  (User sending request must be an admin in the Server)
- `POST /servers/{serverID}/channels/{channelID}/users`:
  Add multiple users to a channel
  (User sending request must be an admin in the Server)
  - Request (list of usersIDs):
    ```json
    [1, 3, 6, 2]
    ```

### Get Channels

- `GET /servers/{serverID}/channels/`: Get all channels in a server for the user sending the request.
  - Response:
    ```json
    [
      {
        "channelID": 123,
        "serverID": 123,
        "roleID": 456,
        "channelTypeID": 789,
        "channelName": "General"
      }
    ]
    ```

### Update Channel

(User sending request must be an admin in the Server)

- `PUT /servers/{serverID}/channels/{channelID}/role`: Update the channel's role. (Request text)
- `PUT /servers/{serverID}/channels/{channelID}/name`: Update the channel's name. (Request text)
- `PUT /servers/{serverID}/channels/{channelID}`: Update the channel's role and name. (Request json with roleID and channelName)

### Delete Channel/UserChannel

(User sending request must be an admin in the Server)

- `DELETE /servers/{serverID}/channels/{channelID}`: Delete a channel.
- `DELETE /servers/{serverID}/channels/{channelID}/users`: Remove multiple users from a channel. (Request json list)
- `DELETE /servers/{serverID}/channels/{channelID}/users/{userID}`: Remove a user from a channel.

## Emojis

-`GET /emojis`: Get all emojis.

## Invites

- `POST /invites`: Create an invite.
  - Request:
  ```json
  { "serverID": 1 }
  ```
  - Response:
  ```json
  "invitecode"
  ```

- `POST /invites/{inviteCode}/join`: Use invite code to join a server
  (invite code must be valid, and user must not be in server)
  - Response:
  ```json
  {
    "serverID": 15,
    "serverName": "The Best Server",
    "serverDescription": "A place for the best server",
    "serverImageUrl": null,
    "roleID": 4
  }
  ```

- `GET /invites/{inviteCode}`: Get an invite using the invite code.
  - Response:
  ```json
  {
    "serverID": 1,
    "inviteCode": "11911010385761221692637972572",
    "createdDate": "2199-08-17"
  }
  ```


## Messages

### Create a Message

(user sending request must be in the channel)

- `POST /servers/{serverID}/channels/{channelID}/messages`: Create a new message without attachments.

  - Request:
    ```json
    {
      "userID": 123,
      "channelID": 456,
      "text": "Hello, world!",
      "time": "2023-07-30T14:30:00Z"
    }
    ```
  - Response:
    - Status: 201 Created
    ```json
    { "messageID": 789 }
    ```

- `POST /servers/{serverID}/channels/{channelID}/messages/attachments`: Create a new message with 1-3 attachments.
  - Request:
    ```json
    {
      "userID": 1,
      "channelID": 1,
      "text": "Message with attachments",
      "time": "2023-07-30T14:30:00Z",
      "attachments": [
        {
          "attachmentUrl": "https://example.com/file1.png",
          "filename": "file1.png"
        },
        {
          "attachmentUrl": "https://example.com/file2.png",
          "filename": "file2.png"
        }
      ]
    }
    ```
  - Response:
    - Status: 201 Created
    ```json
    {
      "messageID": 789,
      "attachmentIDs": [101, 102]
    }
    ```

### Get Messages

(user sending request must be in the channel)

- `GET /servers/{serverID}/channels/{channelID}/messages`: Get all messages in a channel.
  - Response:
    ```json
    [
      {
        "messageID": 789,
        "userID": 123,
        "channelID": 456,
        "text": "Hello, world!",
        "time": "2023-07-30T14:30:00Z",
        "edited": true,
        "reactions": [
          {
            "messageID": 789,
            "reactionID": 1,
            "emojiCode": 2,
            "emojiName": "Smile"
          }
        ],
        "attachments": [
          {
            "attachmentID": 4,
            "filename": "image.jpg",
            "attachmentUrl": "https://image.jpg",
            "messageID": 789
          }
        ]
      },
      {
        "messageID": 790,
        "userID": 124,
        "channelID": 456,
        "text": "Another message",
        "time": "2023-07-30T14:35:00Z",
        "edited": false,
        "reactions": null,
        "attachments": null
      }
    ]
    ```

### Edit and Delete Messages

(user sending request must be the creator of the message, or a moderator if deleting a message)

- `PUT /servers/{serverID}/channels/{channelID}/messages/{messageID}`: Edit a messages text without changing attachments.
  - Request:
  ```json
  { "text": "New Text" }
  ```
- `PUT /servers/{serverID}/channels/{channelID}/messages/attachments/{messageID}`: Edit a message by removing attachment(s).
  - Request (list of attachmentIDs):
  ```json
  [1, 2, 3]
  ```
- `DELETE /servers/{serverID}/channels/{channelID}/messages/{messageID}`: Delete a message, removing all attachments and reactions (CASCADE).

## Servers

### Create a Server

- `POST /servers`: Create a new server. Also creates a UserServer for the user sending the request, with a role of Creator (1) and a General Channel.
  - Request:
    ```json
    {
      "serverName": "My Server",
      "serverDescription": "A Minecraft Gaming Group",
      "serverImageUrl": "https://example.com/image.jpg"
    }
    ```
  - Response:
    - Status: 201 Created
    ```json
    { 
    "serverID": 456,
    "channelID": 140 
    }
    ```

### Get User Servers

- `GET /servers/`: Get a list of servers that a user belongs to.
  - Response:
    ```json
    [
      {
        "serverID": 456,
        "serverName": "My Server",
        "serverImageUrl": "https://example.com/server-image.png",
        "serverDescription": "A description of the server",
        "roleID": 1
      },
      {
        "serverID": 457,
        "serverName": "Another Server",
        "serverImageUrl": "https://example.com/another-server-image.png",
        "serverDescription": "Another server description",
        "roleID": 4
      }
    ]
    ```

### Update Server Details

(Request sent as text. User sending request must have role of Admin or above: 1 or 2)

- `PUT /servers/{serverID}/image`: Update the server's image.
- `PUT /servers/{serverID}/description`: Update the server's description.
- `PUT /servers/{serverID}/{userID}/role`: Update the role of a user in the server.

### Delete Server

(User sending request must have role of Creator: 0)

- `DELETE /servers/{serverID}`: Delete a server.

## Users

### Create a User

- `POST /users/signup`: Create a new user. (username and email must be unique)
  - Request:
    ```json
    {
      "username": "new_user",
      "email": "newuser@example.com",
      "password": "securepassword",
      "userImageUrl": "http://example.com/user-image.jpg"
    }
    ```
  - Response:
    - Status: 201 Created (userID returned)
    ```json
    123
    ```
    - Status: 400 Bad Request
    ```json
    { "error": "Email address is already in use" }
    ```

### User Login

- `POST /users/login`: Login using email and password.
  - Request:
    ```json
    {
      "email": "user@example.com",
      "password": "userpassword"
    }
    ```
  - Response:
  ```json
  {
    "jwtAuthResponse": {
      "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbjFAZXhhbXBsZS5jb20iLCJ1c2VySUQiOjEyLCJ1c2VySW1hZ2VVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vdXNlci1pbWFnZS5qcGciLCJkYlVzZXJuYW1lIjoiYWRtaW4xIiwiaWF0IjoxNjkzMjQ2NzQ2LCJleHAiOjE2OTM4NTE1NDZ9.bI-pbuzsH6fR0RrzG7xOcGRt4fKG_H8HPOQ71jc-rG61rRCd2iZlyebPZyceUGKy"
    },
    "email": "admin1@example.com",
    "userID": 12,
    "userImageUrl": "http://example.com/user-image.jpg",
    "username": "admin1"
  }
  ```

### Get Users in a Channel

(user sending request must be in the channel)

- `GET /users/{serverID}/{channelID}`: Get all users in a channel.
  - Response:
    ```json
    [
      {
        "userID": 123,
        "username": "user123",
        "imageURL": "https://example.com/user-image.png",
        "roleID": 1
      },
      {
        "userID": 124,
        "username": "user124",
        "imageURL": "https://example.com/user124-image.png",
        "roleID": 4
      }
    ]
    ```

### Update User Password

- `PUT /users/password`: Update a user's password.
  - Request:
    ```text
    newpassword
    ```

### Update User Image

- `PUT /users/image`: Update a user's image.
  - Request:
    ```text
    https://example.com/new-user-image.png
    ```

### Delete User

- `DELETE /users`: Delete a user.
