package com.example.demo.repository;

import org.springframework.data.repository.CrudRepository;
import com.example.demo.entity.CursoEntity;

public interface CursoRepository extends CrudRepository<CursoEntity, Long> {
}
