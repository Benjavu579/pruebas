package com.example.demo.interfaces;

import java.util.List;
import java.util.Optional;
import com.example.demo.entity.AlumnoEntity;

public interface AlumnoService {
    List<AlumnoEntity> listarTodos();
    Optional<AlumnoEntity> buscarPorId(Long id);
    List<AlumnoEntity> buscarPorCurso(Long idCurso);
    List<AlumnoEntity> buscarPorRut(Integer rut);
    AlumnoEntity save(AlumnoEntity alumno);
    AlumnoEntity update(Long id, AlumnoEntity alumno);
    void delete(Long id);
}
