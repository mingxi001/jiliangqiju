package com.metrology.service;

import com.metrology.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    void deleteById(Long id);
    User findByUsername(String username);
    boolean existsByUsername(String username);
    User login(String username, String password);
}