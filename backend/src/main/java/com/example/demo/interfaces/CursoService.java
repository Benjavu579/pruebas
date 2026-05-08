package com.example.demo.interfaces;

import java.util.List;
import java.util.Optional;
import com.example.demo.entity.CursoEntity;

public interface CursoService {
    List<CursoEntity> listarTodos();
    CursoEntity save(CursoEntity curso);
    Optional<CursoEntity> buscarPorId(Long id);
    void delete(Long id);
}
