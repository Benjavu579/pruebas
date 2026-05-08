DROP DATABASE IF EXISTS prgavz;
CREATE DATABASE prgavz;
USE prgavz;

#login
CREATE TABLE user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50),
    pass VARCHAR(50),
    rol VARCHAR(50)
);

-- Usuarios de prueba
INSERT INTO user(usuario,pass,rol) VALUES ('Leo','1234','Profesor');
INSERT INTO user(usuario,pass,rol) VALUES ('Joshua','1234','Alumno');
INSERT INTO user(usuario,pass,rol) VALUES ('Benjamín','1234','Alumno');

create table Persona(
rut int primary key,
nombre varchar(50),
apellido_paterno varchar(50),
apellido_materno varchar(50),
direccion varchar(50)
);

create table Funcionario(
id_funcionario int auto_increment primary key,
rut int,
FOREIGN KEY (rut) REFERENCES Persona(rut), 
cursos varchar(50)
);

create table curso(
id_curso int auto_increment primary key,
nombre_curso varchar(50),
nivel int,
anio_academico int
);

-- Alumno funciona como una matrícula de una Persona en un Curso
create table Alumno(
id int AUTO_INCREMENT primary key,
rut int,
FOREIGN KEY (rut) REFERENCES Persona(rut), 
id_curso int,
FOREIGN KEY (id_curso) REFERENCES curso(id_curso),
cantidad_atrasos int,
cantidad_inasistencias int
);

CREATE TABLE Atraso (
    id_atraso INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    razon VARCHAR(100),
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id) ON DELETE CASCADE
);

CREATE TABLE Inasistencia (
    id_inasistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    fecha DATE NOT NULL,
    justificada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id) ON DELETE CASCADE
);

# ANOTACIONES
CREATE TABLE IF NOT EXISTS anotacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    tipo ENUM('LEVE', 'GRAVE', 'GRAVISIMA') NOT NULL,
    subtipo VARCHAR(100),
    descripcion TEXT,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id) ON DELETE CASCADE
);

INSERT INTO Persona (rut, nombre, apellido_paterno, apellido_materno, direccion) VALUES
(11111111, 'Joshua', 'Chiguay', '', 'Calle 123'),
(22222222, 'Benjamín', 'Villouta', '', 'Calle 456'),
(33333333, 'Valentina', 'Lagos', 'Perez', 'Calle 789');

-- Cursos de Rama Superior
INSERT INTO curso (nombre_curso, nivel, anio_academico) VALUES
('Aplicaciones Web', 3, 2024),
('Base de Datos', 3, 2024),
('Inteligencia Artificial', 3, 2024);

-- Alumnos (Matrículas):
-- Joshua (11111111) en BD (id_curso=2) y IA (id_curso=3)
-- Benjamín (22222222) en IA (id_curso=3)
-- Valentina (33333333) en App Web (id_curso=1)
INSERT INTO Alumno (rut, id_curso, cantidad_atrasos, cantidad_inasistencias) VALUES
(11111111, 2, 0, 0), -- id 1 (Joshua, BD)
(11111111, 3, 0, 0), -- id 2 (Joshua, IA)
(22222222, 3, 0, 0), -- id 3 (Benjamín, IA)
(33333333, 1, 0, 0); -- id 4 (Valentina, App Web)

-- Anotaciones de prueba (al azar en distintas gravedades y ramos)
INSERT INTO anotacion (id_alumno, tipo, subtipo, descripcion, fecha) VALUES
(2, 'GRAVE', 'Falta de respeto', 'El alumno respondió de forma inadecuada durante el laboratorio de IA.', '2024-04-20'), -- Joshua IA
(1, 'LEVE', 'Atraso reiterado', 'El alumno llegó tarde a la clase de BD.', '2024-04-21'), -- Joshua BD
(3, 'LEVE', 'Uso de celular', 'El alumno fue sorprendido usando el celular en clase de IA.', '2024-04-22'), -- Benjamín IA
(3, 'GRAVISIMA', 'Copia en examen', 'El alumno fue sorprendido copiando en la prueba parcial de IA.', '2024-04-23'); -- Benjamín IA

-- Triggers para mantener la cuenta de atrasos e inasistencias actualizada
delimiter //
CREATE TRIGGER aumentaAtrasosAlumno AFTER INSERT ON Atraso
FOR EACH ROW
BEGIN
    UPDATE Alumno SET cantidad_atrasos = cantidad_atrasos + 1
    WHERE Alumno.id = NEW.id_alumno;
END;//
delimiter ;

delimiter //
CREATE TRIGGER aumentaInasistenciasAlumno AFTER INSERT ON Inasistencia
FOR EACH ROW
BEGIN
    UPDATE Alumno SET cantidad_inasistencias = cantidad_inasistencias + 1
    WHERE Alumno.id = NEW.id_alumno;
END;//
delimiter ;

delimiter //
CREATE TRIGGER disminuyeAtrasosAlumno AFTER DELETE ON Atraso
FOR EACH ROW
BEGIN
    UPDATE Alumno SET cantidad_atrasos = cantidad_atrasos - 1
    WHERE Alumno.id = old.id_alumno;
END;//
delimiter ;

delimiter //
CREATE TRIGGER disminuyeInasistenciasAlumno AFTER DELETE ON Inasistencia
FOR EACH ROW
BEGIN
    UPDATE Alumno SET cantidad_inasistencias = cantidad_inasistencias - 1
    WHERE Alumno.id = old.id_alumno;
END;//
delimiter ;

-- Limpieza completada. Tablas de protocolos no primordiales eliminadas.
SELECT * FROM user;
SELECT * FROM curso;
SELECT * FROM Alumno;
SELECT * FROM anotacion;
