package com.metrology.controller;

import com.metrology.dto.LoginRequest;
import com.metrology.dto.LoginResponse;
import com.metrology.entity.User;
import com.metrology.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // 验证非空
        if (request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("用户名和密码不能为空");
        }

        // 查找用户
        User user = userService.findByUsername(request.getUsername());
        if (user == null || !"weihuadai".equals(request.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        // 模拟登录成功
        return new LoginResponse("token123456", user.getRole().name());
    }

    /**
     * 管理员密码验证
     */
    @PostMapping("/admin/verify")
    public boolean verifyAdminPassword(@RequestBody String password) {
        // 验证管理员密码
        return "weihuadai".equals(password);
    }

    /**
     * 更改密码
     */
    @PostMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest request) {
        // 验证非空
        if (request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getOldPassword() == null || request.getOldPassword().isEmpty() ||
                request.getNewPassword() == null || request.getNewPassword().isEmpty()) {
            throw new IllegalArgumentException("所有密码字段不能为空");
        }

        // 查找用户
        User user = userService.findByUsername(request.getUsername());
        if (user == null || !"weihuadai".equals(request.getOldPassword())) {
            throw new IllegalArgumentException("用户名或旧密码错误");
        }

        // 更新密码
        user.setPassword(request.getNewPassword());
        userService.save(user);
    }
}