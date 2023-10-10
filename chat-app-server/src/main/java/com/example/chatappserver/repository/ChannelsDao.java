package com.example.chatappserver.repository;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.ChannelResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class ChannelsDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ChannelsDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private static RowMapper<Channel> channelRowMapper(int serverID) {
        return (resultSet, rowNum) -> new Channel(
                resultSet.getInt("channelID"),
                serverID,
                resultSet.getInt("roleID"),
                resultSet.getInt("channelTypeID"),
                resultSet.getString("channelName")
        );
    }

    private static RowMapper<ChannelResponse> channelResponseRowMapper() {
        return (resultSet, rowNum) -> new ChannelResponse(
                resultSet.getInt("channelID"),
                resultSet.getInt("serverID"),
                resultSet.getInt("roleID"),
                resultSet.getInt("channelTypeID"),
                resultSet.getString("channelName"),
                resultSet.getTimestamp("channelTime"),
                resultSet.getTimestamp("userRead")
        );
    }

    // CRUD operations

    // Create a new Channel
    public void create(Channel channel) {
        String sql = "INSERT INTO Channels (serverID, roleID, channelTypeID, channelName) " +
                "VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, channel.getServerID());
            ps.setInt(2, channel.getRoleID());
            ps.setInt(3, channel.getChannelTypeID());
            ps.setString(4, channel.getChannelName());
            return ps;
        }, keyHolder);

        // Get and set the userID
        int channelID = Objects.requireNonNull(keyHolder.getKey()).intValue();
        channel.setChannelID(channelID);
    }

    // Create a General Channel (used when creating a new server)
    public int createGeneral(int serverID) {
        String sql =
                "INSERT INTO Channels " +
                        "(serverID, roleID, channelTypeID, channelName) " +
                "VALUES (?, 4, 1, 'General')";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, serverID);
            return ps;
        }, keyHolder);

        // Retrieve the generated key
        return Objects.requireNonNull(keyHolder.getKey()).intValue();
    }

    // Add users to a channel (Create UserChannels)
    public void addUsersToChannel(List<Integer> userIds, int channelId) {
        String sql = "INSERT INTO UserChannels (userID, channelID) VALUES (?, ?)";

        List<Object[]> batchArgs = new ArrayList<>();
        for (int userId : userIds) {
            batchArgs.add(new Object[]{userId, channelId});
        }

        jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    // Add/Update ReadChannel
    public void addChannelRead(int userID, int channelID, String lastRead) {
        String sql = """
                INSERT INTO ChannelRead (userID, channelID, lastRead)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE lastRead = ?;
                """;
        jdbcTemplate.update(sql, userID, channelID, lastRead, lastRead);
    }

    public void addUserToChannel(int userID, int channelID) {
        String sql = "INSERT INTO UserChannels (userID, channelID) VALUES (?, ?)";
        jdbcTemplate.update(sql, userID, channelID);
    }

    // Get all channels in a server for a userID
    public List<ChannelResponse> getChannelsInServer(int serverID, int userID) {
        String sql = """
            SELECT c.channelID, c.roleID, c.channelTypeID, c.channelName, c.serverID, cr.lastRead as userRead,
                (SELECT MAX(m.time) FROM Messages m
                    WHERE m.channelID = c.channelID)
                        AS channelTime
            FROM Channels c
            LEFT JOIN UserChannels uc ON c.channelID = uc.channelID AND uc.userID = ?
            LEFT JOIN UserServers us ON us.serverID = c.serverID AND us.userID = ?
            LEFT JOIN ChannelRead cr ON cr.channelID = c.channelID AND cr.userID = ?
            WHERE (uc.channelID IS NOT NULL OR us.roleID <= c.roleID) AND
                c.serverID = ?
            """;
        return jdbcTemplate.query(sql, channelResponseRowMapper(),
                userID, userID, userID, serverID);
    }

    // Get all channels for a user
    public List<ChannelResponse> getAllUserChannels(int userID) {
        String sql = """
            SELECT c.channelID, c.roleID, c.channelTypeID, c.channelName, c.serverID, cr.lastRead as userRead,
                (SELECT MAX(m.time) FROM Messages m
                    WHERE m.channelID = c.channelID)
                        AS channelTime
            FROM Channels c
            LEFT JOIN UserChannels uc ON c.channelID = uc.channelID AND uc.userID = ?
            LEFT JOIN UserServers us ON us.serverID = c.serverID AND us.userID = ?
            LEFT JOIN ChannelRead cr ON cr.channelID = c.channelID AND cr.userID = ?
            WHERE (uc.channelID IS NOT NULL OR us.roleID <= c.roleID);
            """;
        return jdbcTemplate.query(sql, channelResponseRowMapper(),
                userID, userID, userID);
    }

    public Channel getChannelByID(int serverID, int userID, int channelID) {
        String sql = """
                SELECT c.channelID, c.roleID, c.channelTypeID, c.channelName
            FROM Channels c
            LEFT JOIN UserChannels uc ON c.channelID = uc.channelID AND uc.userID = ?
            LEFT JOIN UserServers us ON us.serverID = c.serverID AND us.userID = ?
            WHERE c.channelID = ?
                AND ((uc.channelID IS NOT NULL OR us.roleID <= c.roleID)
                AND c.serverID = ?)
                """;
        return jdbcTemplate.queryForObject(sql, channelRowMapper(serverID), userID, userID, channelID, serverID);
    }

    // Check if a Channel with the serverID and channelName exists
    public boolean isChannelExists(int serverID, String channelName) {
        String sql = "SELECT COUNT(*) FROM Channels WHERE serverID = ? AND channelName = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, serverID, channelName);
        return count != null && count > 0;
    }

    // Check if a user is in a Channel using either UserChannels or compares UserServers.roleID and Channels.roleID
    public boolean inChannel(int userID, int channelID) {
        String sql = """
                SELECT 1 FROM UserChannels
                WHERE userID = ? AND channelID = ?
                UNION ALL
                SELECT 1 FROM UserServers us
                INNER JOIN Channels c ON us.serverID = c.serverID
                WHERE us.userID = ? AND c.channelID = ?
                  AND us.roleID <= c.roleID
                LIMIT 1
                """;
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userID, channelID, userID, channelID);
        return count != null && count > 0;
    }

    // Edit the roleID using the channelID
    public void updateRole(int roleID, int channelID) {
        String sql = "UPDATE Channels SET roleID = ? WHERE channelID = ?";
        jdbcTemplate.update(sql, roleID, channelID);
    }
    //Edit the channelName using the channelID
    public void updateChannelName(String channelName, int channelID) {
        String sql = "UPDATE Channels SET channelName = ? WHERE channelID = ?";
        jdbcTemplate.update(sql, channelName, channelID);
    }
    // Edit the roleID and channelName using the channelID
    public void updateRoleAndChannelName(int roleID, String channelName,
                                         int channelID) {
        String sql = "UPDATE Channels SET channelName = ?, roleID = ? " +
                "WHERE channelID = ?";
        jdbcTemplate.update(sql, channelName, roleID, channelID);
    }

    // Delete a channel using channelID
    public void deleteChannel(int channelID) {
        String sql = "DELETE FROM Channels WHERE channelID = ?";
        jdbcTemplate.update(sql, channelID);
    }

    // Remove multiple users from a channel (Delete UserChannel) using userIDs and channelID
    public void removeUsersFromChannel(List<Integer> userIDs, int channelID) {
        String sql = "DELETE FROM UserChannels WHERE userID = ? AND channelID = ?";

        List<Object[]> batchArgs = new ArrayList<>();
        for (int userID : userIDs) {
            batchArgs.add(new Object[]{userID, channelID});
        }

        jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    // Remove a user from a channel (Delete UserChannel) using userID and channelID
    public void removeUserFromChannel(int userID, int channelID) {
        String sql = "DELETE FROM UserChannels WHERE userID = ? and channelID = ?";
        jdbcTemplate.update(sql, userID, channelID);
    }
}
