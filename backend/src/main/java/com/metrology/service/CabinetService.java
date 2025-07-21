package com.metrology.service;

import com.metrology.entity.Cabinet;

import java.util.List;
import java.util.Optional;

public interface CabinetService {
    List<Cabinet> findAll();
    Optional<Cabinet> findById(Long id);
    Cabinet save(Cabinet cabinet);
    void deleteById(Long id);
    List<Cabinet> findByStatus(String status);
    List<Cabinet> findByNameContaining(String name);
}