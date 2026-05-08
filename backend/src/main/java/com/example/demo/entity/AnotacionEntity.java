package com.example.demo.entity;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "anotacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnotacionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoAnotacion tipo;

    private String subtipo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "id_alumno")
    private AlumnoEntity alumno;

    public enum TipoAnotacion {
        LEVE, GRAVE, GRAVISIMA
    }
}
