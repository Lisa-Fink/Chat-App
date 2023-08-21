package com.example.chatappserver.repository;

import com.example.chatappserver.model.Invite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;

@Repository
public class InvitesDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public InvitesDao(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private static RowMapper<Invite> inviteRowMapper(String inviteCode) {
        return (resultSet, rowNum) -> new Invite(
                resultSet.getInt("serverID"),
                inviteCode,
                resultSet.getDate("expirationTime")
        );
    }

    // CRUD operations
    // Create an invitation to a server using the serverID
    public void createInvite(Invite invite) {
        String sql = "INSERT INTO Invites (serverID, inviteCode, expirationTime) " +
                "VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, invite.getServerID(),
                invite.getInviteCode(), invite.getExpirationTime());
    }

    // Get the invitation that matches the code
    public Invite getInviteByCode(String inviteCode) {
        String sql = "SELECT serverID, expirationTime FROM Invites WHERE inviteCode = ?";
        return jdbcTemplate.queryForObject(sql, inviteRowMapper(inviteCode), inviteCode);
    }

    //  Delete Invite by inviteID
    public void deleteInvite(int inviteID) {
        String sql = "DELETE FROM Invites WHERE inviteID = ?";
        jdbcTemplate.update(sql,  inviteID);
    }
}
