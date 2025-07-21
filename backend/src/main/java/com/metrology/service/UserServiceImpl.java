package com.metrology.service;

import com.metrology.entity.User;
import com.metrology.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> findAll() {
        logger.info("查询所有用户");
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        logger.info("查询ID为{}的用户", id);
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        logger.info("保存用户: {}", user.getUsername());
        LocalDateTime now = LocalDateTime.now();
        if (user.getId() == null) {
            user.setCreatedAt(now);
            logger.info("创建新用户");
            // 加密密码
            user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        } else {
            logger.info("更新用户ID: {}", user.getId());
            // 如果密码被修改，则加密新密码
            if (user.getPassword() != null && !user.getPassword().equals(findById(user.getId()).get().getPassword())) {
                user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
            }
        }
        user.setUpdatedAt(now);
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        logger.info("删除ID为{}的用户", id);
        userRepository.deleteById(id);
    }

    @Override
    public User findByUsername(String username) {
        logger.info("查询用户名为{}的用户", username);
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean existsByUsername(String username) {
        logger.info("检查用户名{}是否存在", username);
        return userRepository.existsByUsername(username);
    }

    @Override
    public User login(String username, String password) {
        logger.info("用户{}登录", username);
        User user = userRepository.findByUsername(username);
        if (user != null) {
            // 验证密码
            String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());
            if (user.getPassword().equals(encryptedPassword)) {
                logger.info("用户{}登录成功", username);
                return user;
            } else {
                logger.warn("用户{}密码错误", username);
            }
        } else {
            logger.warn("用户{}不存在", username);
        }
        return null;
    }
}