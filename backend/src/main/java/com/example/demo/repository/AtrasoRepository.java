package com.example.demo.repository;

import org.springframework.data.repository.CrudRepository;
import com.example.demo.entity.AtrasoEntity;

public interface AtrasoRepository extends CrudRepository<AtrasoEntity, Long> {
}
