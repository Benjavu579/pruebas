package com.example.demo.service;

import com.example.demo.entity.AnotacionEntity;
import com.example.demo.interfaces.AnotacionService;
import com.example.demo.repository.AnotacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AnotacionServiceImpl implements AnotacionService {

    @Autowired
    private AnotacionRepository repository;

    @Override
    public List<AnotacionEntity> listarTodas() {
        return repository.findAll();
    }

    @Override
    public List<AnotacionEntity> buscarPorAlumno(Long alumnoId) {
        return repository.findByAlumnoId(alumnoId);
    }

    @Override
    public List<AnotacionEntity> buscarPorRut(Integer rut) {
        return repository.findByAlumno_Rut(rut);
    }

    @Override
    public Optional<AnotacionEntity> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public AnotacionEntity save(AnotacionEntity anotacion) {
        return repository.save(anotacion);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
