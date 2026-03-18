package com.TaskManager.LetsGo.service;

import com.TaskManager.LetsGo.DTO.Requests.LoginRequest;
import com.TaskManager.LetsGo.DTO.Requests.RegisterRequest;
import com.TaskManager.LetsGo.model.User;
import com.TaskManager.LetsGo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String register(RegisterRequest registerRequest) {
        //Check if Email Already Exists in DB
        User user = userRepository.findByEmail(registerRequest.getEmail());
        if (user != null) {
            throw new RuntimeException("User already exists");
        }
        //Save User
        User saveduser = new User();
        saveduser.setName(registerRequest.getName());
        saveduser.setEmail(registerRequest.getEmail());
        saveduser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userRepository.save(saveduser);
        //Return Message to User
        return "User registered successfully";
    }

    public String login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if(user == null) {
            throw new RuntimeException("User not found");
        }

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        String s = jwtService.generateToken(loginRequest.getEmail());
        return s;
    }
}
