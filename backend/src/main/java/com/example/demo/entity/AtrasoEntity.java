package com.example.demo.entity;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "atrasos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtrasoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fechaHora;
    private String observacion;

    @ManyToOne
    @JoinColumn(name = "alumno_id")
    private AlumnoEntity alumno;
}
