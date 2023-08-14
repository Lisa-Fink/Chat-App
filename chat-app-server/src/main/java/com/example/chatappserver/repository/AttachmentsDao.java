package com.example.chatappserver.repository;

import com.example.chatappserver.model.Attachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;

@Repository
public class AttachmentsDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AttachmentsDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

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


    public void deleteAttachment(int attachmentID) {
        String sql = "DELETE FROM Attachments WHERE attachmentID = ?";
        jdbcTemplate.update(sql, attachmentID);
    }

    public void deleteAttachments(List<Integer> attachmentIDs) {
        // allows only up to 3 attachments, so using a loop
        for (int attachmentID: attachmentIDs) {
            deleteAttachment(attachmentID);
        }
    }

    public void deleteMessagesAttachments(int messageID) {
        String sql = "DELETE FROM Attachments WHERE messageID = ?";
        jdbcTemplate.update(sql, messageID);
    }
}
