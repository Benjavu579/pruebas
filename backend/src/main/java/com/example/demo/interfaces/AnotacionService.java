package com.example.demo.interfaces;

import java.util.List;
import java.util.Optional;
import com.example.demo.entity.AnotacionEntity;

public interface AnotacionService {
    List<AnotacionEntity> listarTodas();
    List<AnotacionEntity> buscarPorAlumno(Long alumnoId);
    List<AnotacionEntity> buscarPorRut(Integer rut);
    Optional<AnotacionEntity> buscarPorId(Long id);
    AnotacionEntity save(AnotacionEntity anotacion);
    void delete(Long id);
}
