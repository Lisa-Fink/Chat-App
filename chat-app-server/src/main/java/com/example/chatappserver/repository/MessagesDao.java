package com.example.chatappserver.repository;

import com.example.chatappserver.model.Attachment;
import com.example.chatappserver.model.Emoji;
import com.example.chatappserver.model.Message;
import com.example.chatappserver.model.Reaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class MessagesDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public MessagesDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    // CRUD operations

    // Create a new Message
    // Updates the Message with the new messageID
    public void create(Message message) {
        // message will have a default edited value of false
        String sql = "INSERT INTO Messages (text, time, userID, channelID) " +
                "VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, message.getText());
            ps.setTimestamp(2, message.getTime());
            ps.setInt(3, message.getUserID());
            ps.setInt(4, message.getChannelID());
            return ps;
        }, keyHolder);

        // Get and set the userID
        int messageID = Objects.requireNonNull(keyHolder.getKey()).intValue();
        message.setMessageID(messageID);
    }

    // Add a reaction to a message using a given emojiID, userID and messageID
    // Updates the Reaction with the new reactionID
    public void addReaction(Reaction reaction) {
        String sql = "INSERT INTO Reactions (emojiID, userID, messageID) VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, reaction.getEmojiID());
            ps.setInt(2, reaction.getUserID());
            ps.setInt(3, reaction.getMessageID());
            return ps;
        }, keyHolder);

        // Get and set the userID
        int reactionID = Objects.requireNonNull(keyHolder.getKey()).intValue();
        reaction.setMessageID(reactionID);
    }

    // Add an attachment to a message
    // Updates the Attachment with the new attachmentID
    public void addAttachment(Attachment attachment) {
        String sql = "INSERT INTO Attachments (filename, attachmentUrl, messageID) VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, attachment.getFilename());
            ps.setString(2, attachment.getAttachmentUrl());
            ps.setInt(3, attachment.getMessageID());
            return ps;
        }, keyHolder);

        // Get and set the attachmentID
        int attachmentID = Objects.requireNonNull(keyHolder.getKey()).intValue();
        attachment.setAttachmentID(attachmentID);
    }

    // Create a new Message, and a new Attachment for each attachment
    // Updates the Message and each Attachment with the new id
    public void createWithAttachments(Message message, List<Attachment> attachments) {
        create(message);
        for (Attachment attachment: attachments) {
            // attachments will have a max of 3 attachments
            attachment.setMessageID(message.getMessageID());
            addAttachment(attachment);
        }
    }


    // Get all Messages in a channel, and all Reactions to each message including the emojiCode, emojiName, and username
    public List<Message> getMessagesInChannel(int channelID) {
        String sql = "SELECT m.messageID, m.text, m.time, m.edited, u.userID, u.username, " +
                "r.reactionID, e.emojiCode, e.emojiName " +
                "FROM Messages m " +
                "LEFT JOIN Users u ON m.userID = u.userID " +
                "LEFT JOIN Reactions r ON m.messageID = r.messageID " +
                "LEFT JOIN Emojis e ON r.emojiID = e.emojiID " +
                "WHERE m.channelID = ?";

        return jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setInt(1, channelID);
        }, resultSet -> {
            List<Message> messages = new ArrayList<>();
            Message currentMessage = null;

            while (resultSet.next()) {
                int messageID = resultSet.getInt("messageID");
                String text = resultSet.getString("text");
                Timestamp time = resultSet.getTimestamp("time");
                boolean edited = resultSet.getBoolean("edited");
                int userID = resultSet.getInt("userID");
                String username = resultSet.getString("username");
                int reactionID = resultSet.getInt("reactionID");
                String emojiCode = resultSet.getString("emojiCode");
                String emojiName = resultSet.getString("emojiName");

                if (currentMessage == null || currentMessage.getMessageID() != messageID) {
                    currentMessage = new Message(messageID, text, time, userID, username, channelID, edited);
                    if (currentMessage.getMessageID() != messageID) {
                        messages.add(currentMessage);
                    }
                }

                if (reactionID != 0) { // Check if reactionID is not null
                    Reaction reaction = new Reaction(reactionID, emojiCode, emojiName, userID, username);
                    currentMessage.addReaction(reaction);
                }
            }
            return messages;
        });
    }

    // Get all Emojis, including its emojiID, emojiCode, and emojiName
    public List<Emoji> getEmojis() {
        String sql = "SELECT emojiID, emojiCode, emojiName FROM Emojis";

        return jdbcTemplate.query(sql, (resultSet, rowNum) ->
                new Emoji(resultSet.getInt("emojiID"),
                        resultSet.getString("emojiCode"),
                        resultSet.getString("emojiName"))
        );
    }

    // Edit a message text, time, set edited to true using a given messageID
    public void editMessage(Message message) {
        String sql = "UPDATE Messages SET text = ?, time = ?, edited = true WHERE messageID = ?";
        jdbcTemplate.update(sql, message.getText(), message.getTime(), message.getMessageID());
    }

    // Edit a message time, set edited to true using a given messageID
    // (use if deleting an attachment)
    public void editMessageTime(int messageID, Timestamp time) {
        String sql = "UPDATE Messages SET time = ?, edited = true WHERE messageID = ?";
        jdbcTemplate.update(sql, time, messageID);
    }

    public void deleteMessage(int messageID) {
        String sql = "DELETE FROM Messages WHERE messageID = ?";
        jdbcTemplate.update(sql, messageID);
    }

    public void deleteReaction(int reactionID) {
        String sql = "DELETE FROM Reactions WHERE reactionID = ?";
        jdbcTemplate.update(sql, reactionID);
    }

    public void deleteAttachment(int attachmentID) {
        String sql = "DELETE FROM Attachments WHERE attachmentID = ?";
        jdbcTemplate.update(sql, attachmentID);
    }
}
