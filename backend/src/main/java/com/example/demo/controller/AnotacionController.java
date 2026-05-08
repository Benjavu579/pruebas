package com.example.demo.controller;

import com.example.demo.entity.AnotacionEntity;
import com.example.demo.interfaces.AnotacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/anotaciones")
public class AnotacionController {

    @Autowired
    private AnotacionService service;

    @GetMapping("/")
    public ResponseEntity<List<AnotacionEntity>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<List<AnotacionEntity>> buscarPorAlumno(@PathVariable Long alumnoId) {
        return ResponseEntity.ok(service.buscarPorAlumno(alumnoId));
    }

    @GetMapping("/rut/{rut}")
    public ResponseEntity<List<AnotacionEntity>> buscarPorRut(@PathVariable Integer rut) {
        return ResponseEntity.ok(service.buscarPorRut(rut));
    }

    @PostMapping("/")
    public ResponseEntity<AnotacionEntity> crear(@RequestBody AnotacionEntity anotacion) {
        return ResponseEntity.ok(service.save(anotacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
