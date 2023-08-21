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
- `POST /channels`: Create a new channel.
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

- `POST /channels/{channelID}/users/{userID}`: Add a user to a channel.
- `POST /channels/{channelID}/users`: Add multiple users to a channel
  - Request (list of usersIDs):
    ```json
    [1,3,6,2,]
### Get Channels
- `GET /channels/{serverID}`: Get all channels in a server.
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
(Request json string/int)
- `PUT /channels/{channelID}/role`: Update the channel's role.
- `PUT /channels/{channelID}/name`: Update the channel's name.
- `PUT /channels/{channelID}`: Update the channel's role and name.

### Delete Channel/UserChannel
- `DELETE /channels/{channelID}`: Delete a channel.
- `DELETE /channels/{channelID}/users`: Remove multiple users from a channel. (Request json list)
- `DELETE /channels/{channelID}/users/{userID}`: Remove a user from a channel.


## Emojis
-`GET /emojis`: Get all emojis.


## Invites
- `POST /invites`: Create an invite.
    - Request:
    ```json
  { "serverID":  1, "expirationTime":  "2199-08-17T14:30:00.000Z" }
  ```
    - Response:
    ```json
    "invitecode"
    ```
- `GET /invites/{inviteCode}`: Get an invite using the invite code.
  - Response:
  ```json
  {
  "serverID": 1,
    "inviteCode": "11911010385761221692637972572",
    "expirationTime": "2199-08-17"
  }
  ```


## Messages

### Create a Message

- `POST /messages`: Create a new message without attachments.
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

- `POST /messages/attachments`: Create a new message with 1-3 attachments.
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

- `GET /messages/{channelID}`: Get all messages in a channel.
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
          "reactions": [{
            "messageID": 789,
            "reactionID": 1,
            "emojiCode": 2,
            "emojiName": "Smile"
          }],
          "attachments": [{
            "attachmentID": 4,
            "filename": "image.jpg",
            "attachmentUrl": "https://image.jpg",
            "messageID": 789
          }]
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

- `PUT /messages/{messageID}`: Edit a messages text without changing attachments.
  - Request:
  ```json
    { "text": "New Text", "time": "2023-08-22T18:38:34.000+00:00"}
    ```
- `PUT /messages/attachments/{messageID}`: Edit a message by removing attachment(s).
  - Request (list of attachmentIDs):
  ```json
    [1, 2, 3]
    ```
- `DELETE /messages/{messageID}`: Delete a message, removing all attachments and reactions (CASCADE).

## Servers

### Create a Server

- `POST /servers`: Create a new server.
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
      { "serverID": 456 }
      ```

### Get User Servers

- `GET /servers/{userID}`: Get a list of servers that a user belongs to.
    - Response:
      ```json
      [
        {
          "serverID": 456,
          "serverName": "My Server",
          "serverImageUrl": "https://example.com/server-image.png",
          "serverDescription": "A description of the server"
        },
        {
          "serverID": 457,
          "serverName": "Another Server",
          "serverImageUrl": "https://example.com/another-server-image.png",
          "serverDescription": "Another server description"
        }
      ]
      ```

### Update Server Details
(Request sent as text)
- `PUT /servers/{serverID}/image`: Update the server's image.
- `PUT /servers/{serverID}/description`: Update the server's description.
- `PUT /servers/{serverID}/{userID}/role`: Update the role of a user in the server.

### Delete Server

- `DELETE /servers/{serverID}`: Delete a server.
    - Note: This operation requires the user sending the request to have the role of creator.


## Users

### Create a User

- `POST /users`: Create a new user. (username and email must be unique)
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
        { "error": "Email address is already in use"}
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
       

### Get Users in a Channel

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

- `PUT /users/{userID}/password`: Update a user's password.
    - Request:
      ```text
      newpassword
      ```


### Update User Image

- `PUT /users/{userID}/image`: Update a user's image.
    - Request:
      ```text
      https://example.com/new-user-image.png
      ```


### Delete User

- `DELETE /users/{userID}`: Delete a user.
