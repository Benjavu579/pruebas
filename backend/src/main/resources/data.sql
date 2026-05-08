-- Datos semilla para Spring Boot (H2) que coinciden con las Entidades JPA

-- Cursos (Entity: cursos)
INSERT INTO cursos (id, nombre, nivel, seccion) VALUES (1, 'Aplicaciones Web', 'Superior', 'A');
INSERT INTO cursos (id, nombre, nivel, seccion) VALUES (2, 'Base de Datos', 'Superior', 'A');
INSERT INTO cursos (id, nombre, nivel, seccion) VALUES (3, 'Inteligencia Artificial', 'Superior', 'A');

-- Alumnos (Entity: alumnos)
INSERT INTO alumnos (id, rut, curso_id, cantidad_atrasos, cantidad_inasistencias, nombre, apellido_paterno) VALUES (1, 11111111, 2, 0, 0, 'Joshua', 'Chiguay');
INSERT INTO alumnos (id, rut, curso_id, cantidad_atrasos, cantidad_inasistencias, nombre, apellido_paterno) VALUES (2, 11111111, 3, 0, 0, 'Joshua', 'Chiguay');
INSERT INTO alumnos (id, rut, curso_id, cantidad_atrasos, cantidad_inasistencias, nombre, apellido_paterno) VALUES (3, 22222222, 3, 0, 0, 'Benjamin', 'Villouta');

-- Anotaciones (Entity: anotacion)
INSERT INTO anotacion (id, id_alumno, tipo, subtipo, descripcion, fecha) VALUES (1, 2, 'GRAVE', 'Falta de respeto', 'El alumno respondio de forma inadecuada durante el laboratorio de IA.', '2024-04-20');
INSERT INTO anotacion (id, id_alumno, tipo, subtipo, descripcion, fecha) VALUES (2, 1, 'LEVE', 'Atraso reiterado', 'El alumno llego tarde a la clase de BD.', '2024-04-21');
INSERT INTO anotacion (id, id_alumno, tipo, subtipo, descripcion, fecha) VALUES (3, 3, 'LEVE', 'Uso de celular', 'El alumno fue sorprendido usando el celular en clase de IA.', '2024-04-22');
INSERT INTO anotacion (id, id_alumno, tipo, subtipo, descripcion, fecha) VALUES (4, 3, 'GRAVISIMA', 'Copia en examen', 'El alumno fue sorprendido copiando en la prueba parcial de IA.', '2024-04-23');
