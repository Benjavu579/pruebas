package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.PersonaEntity;
import com.example.demo.interfaces.PersonaService;
import com.example.demo.repository.PersonaRepository;

@Service
public class PersonaServiceImpl implements PersonaService {

    @Autowired
    private PersonaRepository repositoryPersona;

    @Override
    public List<PersonaEntity> listarTodos() {
        // Hacemos el cast a List de forma segura
        return (List<PersonaEntity>) repositoryPersona.findAll();
    }

    @Override
    public PersonaEntity save(PersonaEntity personaEntity) {
        return repositoryPersona.save(personaEntity);
    }

    @Override
    public PersonaEntity update(Long id, PersonaEntity personaEntity) {
        Optional<PersonaEntity> personaData = repositoryPersona.findById(id);
        
        if (personaData.isPresent()) {
            PersonaEntity p = personaData.get();
            p.setNombre(personaEntity.getNombre()); 
            p.setRut(personaEntity.getRut());
            p.setApellidoPaterno(personaEntity.getApellidoPaterno());
            p.setApellidoMaterno(personaEntity.getApellidoMaterno());
            p.setDireccion(personaEntity.getDireccion());
            return repositoryPersona.save(p);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        repositoryPersona.deleteById(id);
    }

    // CORREGIDO: Usamos 'repositoryPersona' en lugar de 'data'
    @Override
    public Optional<PersonaEntity> buscarPorId(Long id) {
        return repositoryPersona.findById(id); 
    }
}