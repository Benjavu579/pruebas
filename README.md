# Portal de Gestión Escolar — Taller 2

Plataforma web para la gestión académica y disciplinaria de una institución educativa.

## 📋 Requisitos Previos

| Herramienta  | Versión mínima | Comando para verificar |
| ------------ | -------------- | ---------------------- |
| **Java JDK** | 17+            | `java -version`        |
| **Node.js**  | 18+            | `node -v`              |
| **Maven**    | 3.8+           | `./mvnw -version`      |

---

## Cómo Ejecutar el Proyecto

### Opción 1: Ejecución Automática (Recomendado)

## Primero que todo
Abrir el proyecto desde la raiz
ir a cd frontend
```bash
npm install
cd ..
```

Desde la carpeta raíz del proyecto, ejecuta:

```bash
npm run dev
```

### Opción 2: Ejecución Manual y Spring Tool Suite (STS)

#### 1. Configuración de Base de Datos

El proyecto soporta **H2** y **PostgreSQL**. Para alternar entre ellas, debes editar el archivo:
`backend/src/main/resources/application.properties`

- **Para PostgreSQL:** Crea la base de datos en tu CMD (`createdb -U postgres -E UTF-8 inspectoria_angular`), descomenta el bloque de PostgreSQL en el archivo y comenta el de H2.
- **Para H2:** Asegúrate de que el bloque de H2 esté descomentado (opción por defecto).

#### 2. Iniciar el Backend

**Desde la Terminal:**

```bash
cd backend
./mvnw spring-boot:run
```

**Desde STS (Spring Tool Suite):** 1. Importa la carpeta `backend` como _Existing Maven Project_. 2. Haz clic derecho sobre el proyecto -> _Run As_ -> _Spring Boot App_.
_Esto ejecutará el servidor en `http://localhost:8080`._

#### 3. Iniciar el Frontend (Angular)

```bash
cd frontend
npm install   # Solo la primera vez
npm start
```

## 📋 Estructura de la Base de Datos

El backend gestiona la persistencia mediante 5 tablas principales:

1.  **`cursos`**: Información de asignaturas y niveles.
2.  **`alumnos`**: Registro de estudiantes vinculados a cursos.
3.  **`anotacion`**: Historial disciplinario (Leve, Grave, Gravísima).
4.  **`atrasos`**: Registro cronológico de llegadas tarde por alumno.
5.  **`personas`**: Datos maestros de identidad (RUT, nombre, dirección).

## ✨ Funcionalidades Principales

### Portal Profesor

- **Gestión de Cursos (CRUD):** Visualiza, crea y elimina cursos.
- **Gestión de Alumnos (CRUD):** Registro completo de estudiantes.
- **Sistema de Asistencia:** Pase de lista interactivo con cálculo dinámico.
- **Hoja de Vida:** Registro de anotaciones disciplinarias.

### Portal Alumno

- **Dashboard Personal:** Resumen reactivo de su estado.
- **Mis Asignaturas:** Visualización de cursos y su % de asistencia.
- **Mis Anotaciones:** Consulta privada de historial disciplinario.

## 🔑 Credenciales de Acceso

| Rol          | Usuario  | Contraseña |
| ------------ | -------- | ---------- |
| **Profesor** | Leo      | 1234       |
| **Alumno**   | Joshua   | 1234       |
| **Alumno**   | Benjamín | 1234       |
