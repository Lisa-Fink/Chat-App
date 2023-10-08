# Chat App Web Application

Welcome to the Chat Web Application repository! This real-time chat application is inspired by Discord and offers a feature-rich chat experience with real-time updates, customizable user profiles, channels, and servers.

## Features

- **Real-Time Communication**: Enjoy real-time chat with instant message delivery and synchronization across all connected clients.
- **User Personalization**: Customize your user profile, create channels, and manage servers for a personalized experience.
- **Robust Security**: User registration and login are secured using Spring Security and JWT tokens, ensuring safe interactions.
- **Emoji Support**: Express yourself with emoji support, allowing you to add emojis to your messages.
- **Message Reactions**: Engage in expressive conversations by viewing reactions from other users.
- **Unread Message Notifications**: Receive real-time notifications for unread messages in servers and channels.

## Technologies Used

- JavaScript
- React
- Redux
- Java
- Spring
- Websocket
- MySQL

## Local Setup

To run this project locally, follow these steps:

### Frontend

1. Navigate to the frontend directory:

```bash
cd chat-app-client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The application will run on http://localhost:5173.

### Database

Set up a MySQL database using the DataDefinitionQueries.sql file located in the ./database directory. This file creates the tables and populates them with sample data.

### Backend

Navigate to the backend directory

```bash
cd chat-app-server
```

Create a file named application.properties in ./src/main/resources/.
In application.properties, define the following variables:

spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.password=YOUR_DATABASE_PASSWORD
spring.datasource.username=YOUR_DATABASE_USERNAME
app.jwt-secret=YOUR_JWT_SECRET
app-jwt-expiration-milliseconds=YOUR_JWT_EXPIRATION_TIME
Replace YOUR_DATABASE_URL, YOUR_DATABASE_PASSWORD, YOUR_DATABASE_USERNAME, YOUR_JWT_SECRET, and YOUR_JWT_EXPIRATION_TIME with your specific configuration.

Install Java and Spring dependencies.

Once both the frontend and backend are set up, you can access the application locally.
