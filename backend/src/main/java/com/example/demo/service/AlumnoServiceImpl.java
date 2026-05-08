package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.AlumnoEntity;
import com.example.demo.interfaces.AlumnoService;
import com.example.demo.repository.AlumnoRepository;

@Service
public class AlumnoServiceImpl implements AlumnoService {

    @Autowired
    private AlumnoRepository repository;

    @Override
    public List<AlumnoEntity> listarTodos() {
        return (List<AlumnoEntity>) repository.findAll();
    }

    @Override
    public Optional<AlumnoEntity> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<AlumnoEntity> buscarPorCurso(Long idCurso) {
        return repository.findByCurso_Id(idCurso);
    }

    @Override
    public List<AlumnoEntity> buscarPorRut(Integer rut) {
        return repository.findByRut(rut);
    }

    @Override
    public AlumnoEntity save(AlumnoEntity alumno) {
        return repository.save(alumno);
    }

    @Override
    public AlumnoEntity update(Long id, AlumnoEntity alumno) {
        return repository.findById(id).map(a -> {
            a.setRut(alumno.getRut());
            a.setNombre(alumno.getNombre());
            a.setApellidoPaterno(alumno.getApellidoPaterno());
            a.setApellidoMaterno(alumno.getApellidoMaterno());
            a.setDireccion(alumno.getDireccion());
            a.setCantidadAtrasos(alumno.getCantidadAtrasos());
            a.setCantidadInasistencias(alumno.getCantidadInasistencias());
            a.setCurso(alumno.getCurso());
            return repository.save(a);
        }).orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
