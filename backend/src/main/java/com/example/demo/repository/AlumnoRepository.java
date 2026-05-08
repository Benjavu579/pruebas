package com.example.demo.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.AlumnoEntity;
import java.util.List;

@Repository
public interface AlumnoRepository extends CrudRepository<AlumnoEntity, Long> {
    List<AlumnoEntity> findByCurso_Id(Long cursoId);
    List<AlumnoEntity> findByRut(Integer rut);
}
