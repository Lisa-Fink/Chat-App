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

- `POST /channels/{channelID}/{userID}`: Add a user to a channel.

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

- `PUT /channels/{channelID}/role`: Update the channel's role.
- `PUT /channels/{channelID}/name`: Update the channel's name.
- `PUT /channels/{channelID}`: Update the channel's role and name.
- `DELETE /channels/{channelID}`: Delete a channel.
- `DELETE /channels/{channelID}/users`: Remove multiple users from a channel.
- `DELETE /channels/{channelID}/{userID}`: Remove a user from a channel.


## Emojis
-`GET /emojis`: Get all emojis.


## Invites
- `POST /invites`: Create an invite.
    - Response:
    ```json
    "invitecode"
    ```
- `GET /invites/{inviteCode}`: Get an invite using the invite code.


## Messages

### Create a Message

- `POST /messages`: Create a new message without attachments.
    - Request:
      ```json
      {
        "userID": 123,
        "channelID": 456,
        "text": "Hello, world!",
        "time": "2023-07-30T14:30:00Z",
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
        "userID": 123,
        "channelID": 456,
        "text": "Message with attachments",
        "time": "2023-07-30T14:30:00Z",
        "attachments": [
          {
            "attachmentID": 101,
            "attachmentUrl": "https://example.com/file1.png",
            "filename": "file1.png"
          },
          {
            "attachmentID": 102,
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

- `PUT /messages`: Edit a message without changing attachments.
- `PUT /messages/attachments/{messageID}`: Edit a message by removing attachment(s).
- `DELETE /messages/attachments-reactions/{messageID}`: Delete a message, removing all attachments and reactions.
- `DELETE /messages/attachments/{messageID}`: Delete a message, removing all attachments.
- `DELETE /messages/reactions/{messageID}`: Delete a message, removing all reactions.
- `DELETE /messages/{messageID}`: Delete a message with no attachments or reactions.



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

- `PUT /servers/{serverID}/image`: Update the server's image.
- `PUT /servers/{serverID}/description`: Update the server's description.
- `PUT /servers/{serverID}/{userID}/role`: Update the role of a user in the server.

### Delete Server

- `DELETE /servers/{serverID}`: Delete a server.
    - Note: This operation requires the user sending the request to have the role of creator.


## Users

### Create a User

- `POST /users`: Create a new user.
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
        - Status: 201 Created
      ```json
      { "userID": 123 }
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

- `GET /users/{serverID}/{channelID}/{maxRoleID}`: Get all users in a channel.
    - Response:
      ```json
      [
        {
          "userID": 123,
          "username": "user123",
          "email": "user123@example.com",
          "imageURL": "https://example.com/user-image.png"
        },
        {
          "userID": 124,
          "username": "user124",
          "email": "user124@example.com",
          "imageURL": "https://example.com/user124-image.png"
        }
      ]
      ```

### Update User Password

- `PUT /users/{userID}/password`: Update a user's password.
    - Request:
      ```json
      "newpassword"
      ```


### Update User Image

- `PUT /users/{userID}/image`: Update a user's image.
    - Request:
      ```json
      "https://example.com/new-user-image.png"
      ```


### Delete User

- `DELETE /users/{userID}/delete`: Delete a user.
