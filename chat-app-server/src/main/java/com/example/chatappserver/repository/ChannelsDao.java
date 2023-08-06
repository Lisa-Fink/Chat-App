package com.example.chatappserver.repository;

import com.example.chatappserver.model.Channel;
import com.example.chatappserver.model.Server;
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

    private static RowMapper<Channel> channelRowMapper() {
        return (resultSet, rowNum) -> new Channel(
                resultSet.getInt("channelID"),
                resultSet.getInt("serverID"),
                resultSet.getInt("roleID"),
                resultSet.getInt("channelTypeID"),
                resultSet.getString("channelName")
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

    // Add users to a channel (Create UserChannels)
    public void addUsersToChannel(List<Integer> userIds, int channelId) {
        String sql = "INSERT INTO UserChannels (userID, channelID) VALUES (?, ?)";

        List<Object[]> batchArgs = new ArrayList<>();
        for (int userId : userIds) {
            batchArgs.add(new Object[]{userId, channelId});
        }

        jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    // Get all channels in a server
    public List<Channel> getChannelsInServer(int serverID) {
        String sql = "SELECT channelID, channelName FROM Channels WHERE serverID = ?";
        return jdbcTemplate.query(sql, channelRowMapper(), serverID);
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

    // Remove a user from a channel (Delete UserChannel) using userID and channelID
    public void removeUserFromChannel(int userID, int channelID) {
        String sql = "DELETE FROM UserChannels WHERE userID = ? and channelID = ?";
        jdbcTemplate.update(sql, userID, channelID);
    }

}
