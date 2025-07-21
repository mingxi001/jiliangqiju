package com.metrology.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 计量器具实体类
 */
@Entity
@Table(name = "instrument")
public class Instrument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "model", length = 50)
    private String model;

    @Column(name = "specification", length = 100)
    private String specification;

    @ManyToOne
    @JoinColumn(name = "cabinet_id", nullable = false)
    private Cabinet cabinet;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 枚举定义
    public enum Status {
        IN_STOCK, BORROWED, CALIBRATION
    }

    // getter和setter方法省略
}