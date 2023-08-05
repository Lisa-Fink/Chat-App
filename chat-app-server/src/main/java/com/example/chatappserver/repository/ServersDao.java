package com.example.chatappserver.repository;

import com.example.chatappserver.model.Server;
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
public class ServersDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ServersDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private static RowMapper<Server> serverRowMapper() {
        return (resultSet, rowNum) -> new Server(
                resultSet.getInt("serverID"),
                resultSet.getString("serverName"),
                resultSet.getString("serverDescription"),
                resultSet.getString("serverImageUrl")
        );
    }


    // CRUD operations

    // Create a new Server
    public void create(Server server) {
        String sql = "INSERT INTO Servers (serverName, serverImageUrl) " +
                "VALUES (?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, server.getServerName());
            ps.setString(2, server.getServerImageUrl());
            return ps;
        }, keyHolder);

        // Get and set the userID
        int serverId = Objects.requireNonNull(keyHolder.getKey()).intValue();
        server.setServerID(serverId);
    }

    // Create a new UserServer, adds a user to a server using userID and serverID
    public void addUser(int userID, int serverID, int roleID) {
        String sql = "INSERT INTO UserServers (userID, serverID, roleID) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, userID, serverID, roleID);
    }

    // Get all Servers that a user belongs to, selecting server name, server image and id
    public List<Server> getAllUserServers(int userID) {
        String sql = "SELECT s.serverID, s.serverName, s.serverImageUrl FROM Servers s " +
                "INNER JOIN UserServers us on s.serverID = us.serverID " +
                "WHERE us.userID = :userID";

        return jdbcTemplate.query(sql, serverRowMapper(), userID);
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

    // Delete a server using the serverID
    public void deleteServer(int serverID) {
        String sql = "DELETE FROM Servers WHERE serverID = ?";
        jdbcTemplate.update(sql,  serverID);
    }

}
