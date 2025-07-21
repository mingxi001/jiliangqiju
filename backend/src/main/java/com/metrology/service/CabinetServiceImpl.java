package com.metrology.service;

import com.metrology.entity.Cabinet;
import com.metrology.repository.CabinetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CabinetServiceImpl implements CabinetService {

    private static final Logger logger = LoggerFactory.getLogger(CabinetServiceImpl.class);

    @Autowired
    private CabinetRepository cabinetRepository;

    @Override
    public List<Cabinet> findAll() {
        logger.info("查询所有计量柜");
        return cabinetRepository.findAll();
    }

    @Override
    public Optional<Cabinet> findById(Long id) {
        logger.info("查询ID为{}的计量柜", id);
        return cabinetRepository.findById(id);
    }

    @Override
    public Cabinet save(Cabinet cabinet) {
        logger.info("保存计量柜: {}", cabinet.getName());
        LocalDateTime now = LocalDateTime.now();
        if (cabinet.getId() == null) {
            cabinet.setCreatedAt(now);
            logger.info("创建新计量柜");
        } else {
            logger.info("更新计量柜ID: {}", cabinet.getId());
        }
        cabinet.setUpdatedAt(now);
        return cabinetRepository.save(cabinet);
    }

    @Override
    public void deleteById(Long id) {
        logger.info("删除ID为{}的计量柜", id);
        cabinetRepository.deleteById(id);
    }

    @Override
    public List<Cabinet> findByStatus(String status) {
        logger.info("查询状态为{}的计量柜", status);
        return cabinetRepository.findByStatus(status);
    }

    @Override
    public List<Cabinet> findByNameContaining(String name) {
        logger.info("查询名称包含{}的计量柜", name);
        return cabinetRepository.findByNameContaining(name);
    }
}