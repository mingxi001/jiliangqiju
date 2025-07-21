package com.metrology.controller;

import com.metrology.entity.User;
import com.metrology.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 获取所有用户
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    /**
     * 获取单个用户
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 创建用户
     */
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.findById(id)
                .map(existingUser -> {
                    user.setId(id);
                    return ResponseEntity.ok(userService.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> {
                    userService.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 根据用户名查找用户
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> findByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }
}