package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.CursoEntity;
import com.example.demo.interfaces.CursoService;
import com.example.demo.repository.CursoRepository;

import com.example.demo.entity.AlumnoEntity;
import com.example.demo.entity.AnotacionEntity;
import com.example.demo.repository.AlumnoRepository;
import com.example.demo.repository.AnotacionRepository;
import javax.transaction.Transactional;

@Service
public class CursoServiceImpl implements CursoService {
    @Autowired
    private CursoRepository repository;
    
    @Autowired
    private AlumnoRepository alumnoRepository;
    
    @Autowired
    private AnotacionRepository anotacionRepository;

    @Override
    public List<CursoEntity> listarTodos() {
        return (List<CursoEntity>) repository.findAll();
    }

    @Override
    public CursoEntity save(CursoEntity curso) {
        return repository.save(curso);
    }

    @Override
    public Optional<CursoEntity> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        List<AlumnoEntity> alumnos = alumnoRepository.findByCurso_Id(id);
        for (AlumnoEntity alumno : alumnos) {
            List<AnotacionEntity> anotaciones = anotacionRepository.findByAlumnoId(alumno.getId());
            anotacionRepository.deleteAll(anotaciones);
        }
        alumnoRepository.deleteAll(alumnos);
        repository.deleteById(id);
    }
}
