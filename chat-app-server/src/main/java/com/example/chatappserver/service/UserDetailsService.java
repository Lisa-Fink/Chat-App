package com.example.chatappserver.service;

import com.example.chatappserver.model.CustomUserDetails;
import com.example.chatappserver.model.User;
import com.example.chatappserver.repository.UsersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UsersDao usersDao;

    @Autowired
    public UserDetailsService(UsersDao usersDao) {

        this.usersDao = usersDao;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("load by username");
        User user = usersDao.getByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("No user found with email");
        }
        System.out.println("load by username");
        CustomUserDetails cuser = new CustomUserDetails(user.getUserID(), user.getUserImageUrl(),
                user.getEmail(), user.getPassword(), user.getUsername());
        System.out.println(cuser.getDbUsername());
        return cuser;
    }
}
