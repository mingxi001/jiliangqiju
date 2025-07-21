package com.metrology.service;

import com.metrology.entity.Instrument;

import java.util.List;
import java.util.Optional;

public interface InstrumentService {
    List<Instrument> findAll();
    Optional<Instrument> findById(Long id);
    Instrument save(Instrument instrument);
    void deleteById(Long id);
    List<Instrument> findByCabinetId(Long cabinetId);
    List<Instrument> findByStatus(String status);
}