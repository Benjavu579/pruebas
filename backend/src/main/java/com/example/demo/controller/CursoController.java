package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.CursoEntity;
import com.example.demo.interfaces.CursoService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1/cursos")
public class CursoController {
    @Autowired
    private CursoService service;

    @GetMapping("/")
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping("/")
    public ResponseEntity<?> crear(@RequestBody CursoEntity curso) {
        return ResponseEntity.ok(service.save(curso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
