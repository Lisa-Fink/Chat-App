package com.example.chatappserver.repository;

import com.example.chatappserver.model.Emoji;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmojisDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public EmojisDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
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
}
