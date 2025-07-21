package com.metrology.controller;

import com.metrology.entity.Instrument;
import com.metrology.service.InstrumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 计量器具控制器
 */
@RestController
@RequestMapping("/api/instruments")
public class InstrumentController {

    @Autowired
    private InstrumentService instrumentService;

    /**
     * 获取所有计量器具
     */
    @GetMapping
    public List<Instrument> getAllInstruments() {
        return instrumentService.findAll();
    }

    /**
     * 获取单个计量器具
     */
    @GetMapping("/{id}")
    public ResponseEntity<Instrument> getInstrumentById(@PathVariable Long id) {
        return instrumentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 创建计量器具
     */
    @PostMapping
    public Instrument createInstrument(@RequestBody Instrument instrument) {
        return instrumentService.save(instrument);
    }

    /**
     * 更新计量器具
     */
    @PutMapping("/{id}")
    public ResponseEntity<Instrument> updateInstrument(@PathVariable Long id, @RequestBody Instrument instrument) {
        return instrumentService.findById(id)
                .map(existingInstrument -> {
                    instrument.setId(id);
                    return ResponseEntity.ok(instrumentService.save(instrument));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 删除计量器具
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstrument(@PathVariable Long id) {
        return instrumentService.findById(id)
                .map(instrument -> {
                    instrumentService.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 领用计量器具
     */
    @PutMapping("/{id}/borrow")
    public ResponseEntity<Instrument> borrowInstrument(@PathVariable Long id) {
        return instrumentService.findById(id)
                .map(instrument -> {
                    instrument.setStatus(Instrument.Status.BORROWED);
                    return ResponseEntity.ok(instrumentService.save(instrument));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 归还计量器具
     */
    @PutMapping("/{id}/return")
    public ResponseEntity<Instrument> returnInstrument(@PathVariable Long id) {
        return instrumentService.findById(id)
                .map(instrument -> {
                    instrument.setStatus(Instrument.Status.IN_STOCK);
                    return ResponseEntity.ok(instrumentService.save(instrument));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 送检计量器具
     */
    @PutMapping("/{id}/calibrate")
    public ResponseEntity<Instrument> calibrateInstrument(@PathVariable Long id) {
        return instrumentService.findById(id)
                .map(instrument -> {
                    instrument.setStatus(Instrument.Status.CALIBRATION);
                    return ResponseEntity.ok(instrumentService.save(instrument));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}