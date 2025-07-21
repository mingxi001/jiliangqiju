package com.metrology.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 计量柜实体类
 */
@Entity
@Table(name = "cabinet")
public class Cabinet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // getter和setter方法省略
}