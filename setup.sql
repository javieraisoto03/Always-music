-- Crear la base de datos
CREATE DATABASE estudiantes;

-- Conectarse a la base de datos
\c estudiantes

-- Crear la tabla de estudiantes
CREATE TABLE estudiantes (
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(12) PRIMARY KEY,
    curso VARCHAR(50) NOT NULL,
    nivel INT NOT NULL
);
