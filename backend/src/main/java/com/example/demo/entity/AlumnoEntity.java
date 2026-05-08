package com.example.demo.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Table(name = "alumnos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumnoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private Integer rut;

    @NonNull
    private String nombre;

    private String apellidoPaterno;

    private String apellidoMaterno;

    private String direccion;

    private Integer cantidadAtrasos;

    private Integer cantidadInasistencias;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private CursoEntity curso;
}
