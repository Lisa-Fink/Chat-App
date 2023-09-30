package com.example.chatappserver.repository;

import com.example.chatappserver.model.Reaction;
import com.example.chatappserver.model.ReactionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
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
    public void create(ReactionRequest reaction) {
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
        reaction.setReactionID(reactionID);
    }

    public boolean isUser(int reactionID, int userID) {
        String sql = """
                SELECT COUNT(*) FROM Reactions
                	WHERE reactionID = ? AND userID = ?;
                """;
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, reactionID, userID);
        return count != null && count > 0;
    }

    public ReactionRequest getReactionChannel(int reactionID) {
        String sql = """
                SELECT r.reactionID, r.userID, r.emojiID, r.messageID, c.channelID FROM Reactions r
                	JOIN Messages m ON r.messageID = m.messageID
                    JOIN Channels c ON m.channelID = c.channelID
                    WHERE r.reactionID = ?;
                """;

        return jdbcTemplate.queryForObject(sql, (resultSet, rowNum) -> {
            int fetchedReactionID = resultSet.getInt("reactionID");
            int fetchedUserID = resultSet.getInt("userID");
            int fetchedEmojiID = resultSet.getInt("emojiID");
            int fetchedMessageID = resultSet.getInt("messageID");
            int fetchedChannelID = resultSet.getInt("channelID");

            // Create a new instance of ReactionRequest
            return new ReactionRequest(fetchedEmojiID, fetchedUserID, fetchedMessageID, fetchedReactionID, fetchedChannelID);
        }, reactionID);

    }

    public boolean senderIsAdminInReactionServer(int reactionID, int userID) {
        String sql = """
                SELECT us.roleID FROM Reactions r
                	JOIN Messages m ON r.messageID = m.messageID
                    JOIN Channels c ON m.channelID = c.channelID
                    JOIN Servers s ON c.serverID = s.serverID
                    JOIN UserServers us ON s.serverID = us.serverID
                        AND ? = us.userID
                    WHERE r.reactionID = ?;
                """;
        try {
            Integer roleID = jdbcTemplate.queryForObject(sql, Integer.class,
                    userID, reactionID);
            return roleID != null && roleID <= 2;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
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
