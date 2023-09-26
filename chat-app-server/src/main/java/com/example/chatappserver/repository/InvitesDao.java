package com.example.chatappserver.repository;

import com.example.chatappserver.model.Invite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class InvitesDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public InvitesDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private static RowMapper<Invite> inviteRowMapper(String inviteCode) {
        return (resultSet, rowNum) -> new Invite(
                resultSet.getInt("serverID"),
                inviteCode,
                resultSet.getDate("createdDate")
        );
    }

    // CRUD operations
    // Create an invitation to a server using the serverID
    public void createInvite(Invite invite, int userID) {
        String sql = "INSERT INTO Invites (serverID, inviteCode, createdDate, userID) " +
                "VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, invite.getServerID(),
                invite.getInviteCode(), invite.getCreatedDate(), userID);
    }

    // Get the invitation that matches the code
    public Invite getInviteByCode(String inviteCode) {
        String sql = "SELECT serverID, createdDate FROM Invites WHERE inviteCode = ? AND " +
                "createdDate >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        return jdbcTemplate.queryForObject(sql, inviteRowMapper(inviteCode), inviteCode);
    }

    // Check if the user already created an invitation today
    public String getInviteForUserServerToday(int userID, int serverID) {
        String sql = "SELECT inviteCode FROM Invites " +
                "WHERE userID = ? AND serverID = ? AND " +
                "DATE(createdDate) = DATE(NOW())";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, userID, serverID);
        } catch (EmptyResultDataAccessException e) {
            // returns null if the row doesn't exist
            return null;
        }
    }

    //  Delete Invite by inviteID
    public void deleteInvite(int inviteID) {
        String sql = "DELETE FROM Invites WHERE inviteID = ?";
        jdbcTemplate.update(sql,  inviteID);
    }

}
