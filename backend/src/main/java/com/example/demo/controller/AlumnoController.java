package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.AlumnoEntity;
import com.example.demo.interfaces.AlumnoService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService service;

    @GetMapping("/")
    public ResponseEntity<?> listarAlumnos() {
        try {
            return ResponseEntity.ok().body(service.listarTodos());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable("id") Long id) {
        try {
            return service.buscarPorId(id)
                    .map(alumno -> ResponseEntity.ok().body(alumno))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<?> obtenerPorCurso(@PathVariable("cursoId") Long cursoId) {
        try {
            return ResponseEntity.ok().body(service.buscarPorCurso(cursoId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/rut/{rut}")
    public ResponseEntity<?> obtenerPorRut(@PathVariable("rut") Integer rut) {
        try {
            return ResponseEntity.ok().body(service.buscarPorRut(rut));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> crearAlumno(@RequestBody AlumnoEntity alumno) {
        try {
            return ResponseEntity.ok().body(service.save(alumno));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAlumno(@PathVariable("id") Long id, @RequestBody AlumnoEntity alumno) {
        try {
            return ResponseEntity.ok().body(service.update(id, alumno));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAlumno(@PathVariable("id") Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok().body("{\"message\": \"Alumno eliminado\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
