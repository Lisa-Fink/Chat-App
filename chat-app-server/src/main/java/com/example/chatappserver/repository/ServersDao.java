package com.example.chatappserver.repository;

import com.example.chatappserver.model.Server;
import com.example.chatappserver.model.ServerResponse;
import com.example.chatappserver.model.UserServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
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
public class ServersDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ServersDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private static RowMapper<ServerResponse> serverResponseRowMapper() {
        return (resultSet, rowNum) -> new ServerResponse(
                resultSet.getInt("serverID"),
                resultSet.getString("serverName"),
                resultSet.getString("serverDescription"),
                resultSet.getString("serverImageUrl"),
                resultSet.getInt("roleID")
        );
    }

    private static RowMapper<UserServer> userServerRowMapper() {
        return (resultSet, rowNum) -> new UserServer(
                resultSet.getInt("userServerID"),
                resultSet.getInt("serverID"),
                resultSet.getInt("userID"),
                resultSet.getInt("roleID")
        );
    }


    // CRUD operations

    // Create a new Server
    // Updates the Server with the new serverID
    public void create(Server server) {
        String sql = "INSERT INTO Servers (serverName, serverDescription, serverImageUrl) " +
                "VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, server.getServerName());
            ps.setString(2, server.getServerDescription());
            ps.setString(3, server.getServerImageUrl());
            return ps;
        }, keyHolder);

        // Get and set the serverID
        int serverId = Objects.requireNonNull(keyHolder.getKey()).intValue();
        server.setServerID(serverId);
    }

    // Create a new UserServer, adds a user to a server using userID and serverID
    public void addUser(int userID, int serverID, int roleID) {
        String sql = "INSERT INTO UserServers (userID, serverID, roleID) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, userID, serverID, roleID);
    }

    // Get all Servers that a user belongs to, selecting server name, server image and id
    public List<ServerResponse> getAllUserServers(int userID) {
        String sql = "SELECT s.serverID, s.serverName, s.serverDescription, s.serverImageUrl, us.roleID FROM Servers s " +
                "INNER JOIN UserServers us on s.serverID = us.serverID " +
                "WHERE us.userID = ?";

        return jdbcTemplate.query(sql, serverResponseRowMapper(), userID);
    }

    // Get a Server for User by serverID and userID
    public Server getServerByID(int serverID, int userID) {
        String sql = "SELECT s.serverID, s.serverName, s.serverDescription, s.serverImageUrl, us.roleID FROM Servers s " +
                "INNER JOIN UserServers us on s.serverID = us.serverID " +
                "WHERE s.serverID = ? AND us.userID = ?";
        return jdbcTemplate.queryForObject(sql, serverResponseRowMapper(), serverID, userID);
    }

    // Update the server image
    public void updateImage(int serverID, String serverImageUrl) {
        String sql = "UPDATE Servers SET serverImageUrl = ? " +
                "WHERE serverID = ?";

        jdbcTemplate.update(sql, serverImageUrl, serverID);
    }

    // Update the server description
    public void updateDescription(int serverID, String serverDescription) {
        String sql = "UPDATE Servers SET serverDescription = ? " +
                "WHERE serverID = ?";

        jdbcTemplate.update(sql, serverDescription, serverID);
    }

    // Update a Users role in the server
    public void updateUserRole(int userID, int roleID, int serverID) {
        String sql = "UPDATE UserServers SET roleID = ? WHERE serverID = ? AND userID = ?";
        jdbcTemplate.update(sql, roleID, serverID, userID);
    }

    // Delete a server using the serverID
    public void deleteServer(int serverID) {
        String sql = "DELETE FROM Servers WHERE serverID = ?";
        jdbcTemplate.update(sql,  serverID);
    }

    // Deletes a UserServer
    public void deleteUserServer(int serverID, int userID) {
        String sql = "DELETE FROM UserServers WHERE serverID = ? AND userID = ?";
        jdbcTemplate.update(sql, serverID, userID);
    }

    // Get UserServer using userID and serverID
    public UserServer getUserServer(int userID, int serverID)  {
        String sql = "SELECT * FROM UserServers WHERE userID = ? AND serverID = ?";
        try {
            return jdbcTemplate.queryForObject(sql, userServerRowMapper(), userID, serverID);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    // Check for UserServer using userID and serverID
    public boolean inServer(int userID, int serverID) {
        String sql = "SELECT COUNT(*) FROM UserServers WHERE userID = ? and serverID = ?";

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userID, serverID);
            return count != null && count > 0;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    // Check for UserServer with specific role
    public boolean inServerAsRole(int userID, int serverID, int roleID) {
        if (userID < 0 || roleID < 0) { throw new IllegalArgumentException("Invalid ID"); };
        String sql = "SELECT COUNT(*) FROM UserServers WHERE userID = ? AND serverID = ? AND roleID <= ?";

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userID, serverID, roleID);
            return count != null && count > 0;
        } catch (DataAccessException e) {
            return false;
        }
    }

}
