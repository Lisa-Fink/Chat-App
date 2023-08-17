package com.example.chatappserver.repository;

import com.example.chatappserver.model.Attachment;
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
    private final AttachmentsDao attachmentsDao;
    private final ReactionsDao reactionsDao;

    @Autowired
    public MessagesDao(JdbcTemplate jdbcTemplate, AttachmentsDao attachmentsDao,
                       ReactionsDao reactionsDao) {
        this.jdbcTemplate = jdbcTemplate;
        this.attachmentsDao = attachmentsDao;
        this.reactionsDao = reactionsDao;
    }

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

    // Create a new Message, and a new Attachment for each attachment
    // Updates the Message and each Attachment with the new id
    public void createWithAttachments(Message message) {
        create(message);
        for (Attachment attachment: message.getAttachments()) {
            // attachments will have a max of 3 attachments
            attachmentsDao.addAttachment(attachment);
        }
    }


    // Get all Messages in a channel, and all Reactions to each message including the emojiCode, emojiName, and username
    public List<Message> getMessagesInChannel(int channelID) {
        String sql = "SELECT m.messageID, m.text, m.time, m.edited, u.username, " +
                "       r.reactionID, e.emojiCode, e.emojiName, " +
                "       a.attachmentID, a.attachmentUrl, a.filename " +
                "FROM Messages m " +
                "LEFT JOIN Users u ON m.userID = u.userID " +
                "LEFT JOIN Reactions r ON m.messageID = r.messageID " +
                "LEFT JOIN Emojis e ON r.emojiID = e.emojiID " +
                "LEFT JOIN Attachments a ON m.messageID = a.messageID " +
                "WHERE m.channelID = :channelID;";

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

                Integer reactionID = resultSet.getInt("reactionID");
                String emojiCode = resultSet.getString("emojiCode");
                String emojiName = resultSet.getString("emojiName");

                Integer attachmentID = resultSet.getInt("attachmentID");
                String filename = resultSet.getString("filename");
                String attachmentUrl = resultSet.getString("attachmentUrl");


                if (currentMessage == null || currentMessage.getMessageID() != messageID) {
                    currentMessage = new Message(messageID, text, time, userID, username, channelID, edited);
                    messages.add(currentMessage);
                }

                if (reactionID != null) { // Check if reactionID is not null
                    Reaction reaction = new Reaction(messageID, reactionID, emojiCode, emojiName, userID, username);
                    currentMessage.addReaction(reaction);
                }

                if (attachmentID != null) { // Check if reactionID is not null
                    Attachment attachment = new Attachment(attachmentID, filename, attachmentUrl, messageID);
                    currentMessage.addAttachment(attachment);
                }

            }
            return messages;
        });
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

    // Edit a message by removing attachments
    public void editRemoveAttachments(int messageID, List<Integer> attachmentIDs) {
        editMessageTime(messageID, new Timestamp(System.currentTimeMillis()));
        attachmentsDao.deleteAttachments(attachmentIDs);
    }

    public void deleteMessageOnly(int messageID) {
        String sql = "DELETE FROM Messages WHERE messageID = ?";
        jdbcTemplate.update(sql, messageID);
    }
    public void deleteMessageAttachmentsReactions(int messageID) {
        deleteMessageOnly(messageID);
        attachmentsDao.deleteMessagesAttachments(messageID);
        reactionsDao.deleteMessagesReactions(messageID);
    }

    public void deleteMessageAttachments(int messageID) {
        deleteMessageOnly(messageID);
        attachmentsDao.deleteMessagesAttachments(messageID);
    }

    public void deleteMessageReactions(int messageID) {
        deleteMessageOnly(messageID);
        reactionsDao.deleteMessagesReactions(messageID);
    }
}


