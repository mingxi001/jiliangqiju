package com.metrology.controller;

import com.metrology.entity.Cabinet;
import com.metrology.service.CabinetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 计量柜控制器
 */
@RestController
@RequestMapping("/api/cabinets")
public class CabinetController {

    @Autowired
    private CabinetService cabinetService;

    /**
     * 获取所有计量柜
     */
    @GetMapping
    public List<Cabinet> getAllCabinets() {
        return cabinetService.findAll();
    }

    /**
     * 获取单个计量柜
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cabinet> getCabinetById(@PathVariable Long id) {
        return cabinetService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 创建计量柜 (仅管理员)
     */
    @PostMapping
    public Cabinet createCabinet(@RequestBody Cabinet cabinet) {
        return cabinetService.save(cabinet);
    }

    /**
     * 更新计量柜 (仅管理员)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cabinet> updateCabinet(@PathVariable Long id, @RequestBody Cabinet cabinet) {
        return cabinetService.findById(id)
                .map(existingCabinet -> {
                    cabinet.setId(id);
                    return ResponseEntity.ok(cabinetService.save(cabinet));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 删除计量柜 (仅管理员)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCabinet(@PathVariable Long id) {
        return cabinetService.findById(id)
                .map(cabinet -> {
                    cabinetService.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}