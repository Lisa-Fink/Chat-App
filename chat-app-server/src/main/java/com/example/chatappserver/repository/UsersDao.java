package com.example.chatappserver.repository;

import com.example.chatappserver.model.User;
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
    public List<User> getUsersInChannel(int channelID, int serverID, int roleID) {
        String sql = """
                SELECT u.userID, u.username
                FROM Users u 
                LEFT JOIN UserChannels uc ON u.userID = uc.userID 
                LEFT JOIN UserServers us ON u.userID = us.userID 
                WHERE uc.channelID = ?
                OR (us.serverID = ? AND us.roleID <= ?)""";

        return jdbcTemplate.query(sql, userRowMapper(), channelID, serverID, roleID);
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
