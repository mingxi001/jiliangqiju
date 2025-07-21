package com.metrology.repository;

import com.metrology.entity.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, Long> {
}