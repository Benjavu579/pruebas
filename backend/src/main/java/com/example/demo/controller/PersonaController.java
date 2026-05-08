package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.PersonaEntity;
import com.example.demo.interfaces.PersonaService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1/entities/persona")
public class PersonaController {

    @Autowired
    private PersonaService service;

    // GET: Listar todos
    @GetMapping("/")
    public ResponseEntity<?> readPersonas() {
        try {
            return ResponseEntity.ok().body(service.listarTodos());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // --- ESTE ES EL MÉTODO QUE TE FALTA ---
    // GET: Buscar por ID (Esencial para que el formulario de edición cargue los datos)
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id") Long id) {
        try {
            // Suponiendo que tu service.buscarPorId devuelve un Optional
            return service.buscarPorId(id)
                    .map(persona -> ResponseEntity.ok().body(persona))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // POST: Crear nuevo 
    @PostMapping("/")
    public ResponseEntity<?> createPersona(@RequestBody PersonaEntity personaEntity) {
        try {
            PersonaEntity nuevaPersona = service.save(personaEntity);
            return ResponseEntity.ok().body(nuevaPersona);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // PUT: Actualizar por ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePersona(@PathVariable("id") Long id, @RequestBody PersonaEntity personaEntity) {
        try {
            PersonaEntity personaActualizada = service.update(id, personaEntity);
            return ResponseEntity.ok().body(personaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // DELETE: Eliminar por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePersona(@PathVariable("id") Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().body("[]");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}