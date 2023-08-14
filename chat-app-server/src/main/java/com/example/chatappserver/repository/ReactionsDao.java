package com.example.chatappserver.repository;

import com.example.chatappserver.model.Reaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Objects;

@Repository
public class ReactionsDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ReactionsDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    // Add a reaction to a message using a given emojiID, userID and messageID
    // Updates the Reaction with the new reactionID
    public void create(Reaction reaction) {
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


    public void deleteMessagesReactions(int messageID) {
        String sql = "DELETE FROM Reactions WHERE messageID = ?";
        jdbcTemplate.update(sql, messageID);
    }

    public void deleteReaction(int reactionID) {
        String sql = "DELETE FROM Reactions WHERE reactionID = ?";
        jdbcTemplate.update(sql, reactionID);
    }
}
