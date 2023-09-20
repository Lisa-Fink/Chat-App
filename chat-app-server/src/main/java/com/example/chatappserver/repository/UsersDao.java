package com.example.chatappserver.repository;

import com.example.chatappserver.model.User;
import com.example.chatappserver.model.UserChannelResponse;
import com.example.chatappserver.model.UserLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;

@Repository
public class UsersDao {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UsersDao(JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    private static RowMapper<User> userRowMapper() {
        return (resultSet, rowNum) -> {
            User user = new User();
            user.setUserID(resultSet.getInt("userID"));
            user.setUsername(resultSet.getString("username"));
            user.setEmail(resultSet.getString("email"));
            user.setPassword(resultSet.getString("password"));
            user.setUserImageUrl(resultSet.getString("userImageUrl"));
            return user;
        };
    }

    private static RowMapper<UserChannelResponse> userChannelRowMapper() {
        return (resultSet, rowNum) -> {
            UserChannelResponse user = new UserChannelResponse();
            user.setUserID(resultSet.getInt("userID"));
            user.setUsername(resultSet.getString("username"));
            user.setUserImageUrl(resultSet.getString("userImageUrl"));
            user.setRoleID(resultSet.getInt("roleID"));
            return user;
        };
    }


    // CRUD operations

    // Create a new User and set the userID to the generated userID in the DB
    public void create(User user) {
        String sql = "INSERT INTO Users (username, email, password, userImageUrl) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getUserImageUrl());
            return ps;
        }, keyHolder);

        // Get and set the userID
        int userId = Objects.requireNonNull(keyHolder.getKey()).intValue();
        user.setUserID(userId);
    }

    // Check for unique username/email
    public boolean isUsernameUnique(String username) {
        String sql = "SELECT COUNT(*) FROM Users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count == 0;
    }
    public boolean isEmailUnique(String email) {
        String sql = "SELECT COUNT(*) FROM Users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count == 0;
    }

//    // Get a User by userID
//    public User getById(int userId) {
//        String sql = "SELECT * FROM Users WHERE userID = ?";
//        return jdbcTemplate.queryForObject(sql, userRowMapper(), userId);
//    }

    // Get a User by email
    public User getByEmail(String email) {
        String sql = "SELECT * FROM Users WHERE email = ?";
        return jdbcTemplate.queryForObject(sql, userRowMapper(), email);
    }


    // Get a List of all Users in a channel by channelID
    public List<Integer> getUsersInChannel(int channelID, int serverID) {
        String sql = """
        
                SELECT us.userID FROM UserServers us, Channels c
                    WHERE us.serverID = ? AND c.channelID = ? AND us.roleID <= c.roleID
                    UNION
                SELECT uc.userID FROM UserChannels uc WHERE uc.channelID = ?;
                """;
        return jdbcTemplate.queryForList(sql, Integer.class, serverID, channelID, channelID);
    }

    // Get a List of all Users in a Server by serverID
    public List<UserChannelResponse> getUsersInServer(int serverID) {
        String sql = "SELECT us.userID, u.username, u.userImageUrl, us.roleID FROM UserServers us " +
                "LEFT JOIN Users u ON us.userID = u.userID " +
                "WHERE us.serverID = ?";
        return jdbcTemplate.query(sql, userChannelRowMapper(), serverID);
    }

   // Edit a user password using a given userID
    public void editPassword(int userID, String password) {
        String sql = "UPDATE Users SET password = ? WHERE userID = ?";
        jdbcTemplate.update(sql, password, userID);
    }

    // Edit a user userImageUrl using a given userID
    public void editUserImage(int userID, String userImageUrl) {
        String sql = "UPDATE Users SET userImageURL = ? WHERE userID = ?";
        jdbcTemplate.update(sql, userImageUrl, userID);
    }

    // Delete a User using a given userID
    public void deleteUser(int userID) {
        String sql = "DELETE FROM Users WHERE userID = ?";
        jdbcTemplate.update(sql, userID);
    }

}
