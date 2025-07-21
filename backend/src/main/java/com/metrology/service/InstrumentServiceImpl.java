package com.metrology.service;

import com.metrology.entity.Instrument;
import com.metrology.repository.InstrumentRepository;
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
public class InstrumentServiceImpl implements InstrumentService {

    private static final Logger logger = LoggerFactory.getLogger(InstrumentServiceImpl.class);

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Override
    public List<Instrument> findAll() {
        logger.info("查询所有计量器具");
        return instrumentRepository.findAll();
    }

    @Override
    public Optional<Instrument> findById(Long id) {
        logger.info("查询ID为{}的计量器具", id);
        return instrumentRepository.findById(id);
    }

    @Override
    public Instrument save(Instrument instrument) {
        logger.info("保存计量器具: {}", instrument.getName());
        LocalDateTime now = LocalDateTime.now();
        if (instrument.getId() == null) {
            instrument.setCreatedAt(now);
            logger.info("创建新计量器具");
        } else {
            logger.info("更新计量器具ID: {}", instrument.getId());
        }
        instrument.setUpdatedAt(now);
        return instrumentRepository.save(instrument);
    }

    @Override
    public void deleteById(Long id) {
        logger.info("删除ID为{}的计量器具", id);
        instrumentRepository.deleteById(id);
    }

    @Override
    public List<Instrument> findByCabinetId(Long cabinetId) {
        logger.info("查询计量柜ID为{}的计量器具", cabinetId);
        return instrumentRepository.findByCabinetId(cabinetId);
    }

    @Override
    public List<Instrument> findByStatus(String status) {
        logger.info("查询状态为{}的计量器具", status);
        return instrumentRepository.findByStatus(status);
    }
}