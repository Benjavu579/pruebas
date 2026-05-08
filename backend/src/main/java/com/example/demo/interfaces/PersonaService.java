package com.example.demo.interfaces;

import java.util.List;
import java.util.Optional;
import com.example.demo.entity.PersonaEntity;

public interface PersonaService {
    public List<PersonaEntity> listarTodos();
    public PersonaEntity save(PersonaEntity personaEntity);
    public PersonaEntity update(Long id, PersonaEntity personaEntity);
    public void delete(Long id);
    Optional<PersonaEntity> buscarPorId(Long id);
}