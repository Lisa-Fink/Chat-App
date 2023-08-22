package com.example.chatappserver.service;

import com.example.chatappserver.model.*;
import com.example.chatappserver.repository.UsersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UsersDao usersDao;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public UserService(UsersDao usersDao, PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, 
                       JwtTokenProvider jwtTokenProvider) {
        this.usersDao = usersDao;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public boolean checkAvailableUsername(String username) {
        return usersDao.isUsernameUnique(username);
    }

    public boolean checkAvailableEmail(String email) {
        return usersDao.isEmailUnique(email);
    }

    public String registerUser(User userRequest) {
        String rawPassword = userRequest.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        userRequest.setPassword(encodedPassword);
        usersDao.create(userRequest);
        return jwtTokenProvider.generateToken(userRequest.getEmail(), userRequest.getUserID(), null, userRequest.getUsername());
    }


    public JwtLoginResponse loginUser(UserLoginRequest userLoginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginRequest.getEmail(),
                        userLoginRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            System.out.println("auth");
            CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
            JwtAuthResponse jwtAuthResponse  =
                    new JwtAuthResponse(jwtTokenProvider.generateToken(
                            user.getUsername(), user.getUserId(), user.getUserImageUrl(), user.getDbUsername()));

            return new JwtLoginResponse(jwtAuthResponse, user.getUsername(), user.getUserId(), user.getUserImageUrl(), user.getDbUsername());
        }
        return null;
    }

    public void updateUserPassword(int userID, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        usersDao.editPassword(userID, encodedPassword);
    }


}





