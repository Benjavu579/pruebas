package com.example.demo.entity;

import javax.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String nivel;

    @OneToMany(mappedBy = "curso")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<AlumnoEntity> alumnos;
}

