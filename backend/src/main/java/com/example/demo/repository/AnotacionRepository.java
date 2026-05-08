package com.example.demo.repository;

import com.example.demo.entity.AnotacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnotacionRepository extends JpaRepository<AnotacionEntity, Long> {
    List<AnotacionEntity> findByAlumnoId(Long alumnoId);
    List<AnotacionEntity> findByAlumno_Rut(Integer rut);
}
