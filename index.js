import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

async function agregarEstudiante(nombre, rut, curso, nivel) {
  try {
    console.log(`Agregando estudiante: Nombre=${nombre}, RUT=${rut}, Curso=${curso}, Nivel=${nivel}`);
    const res = await client.query(
      'INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, rut, curso, nivel]
    );
    console.log(`Estudiante ${nombre} agregado con éxito`);
  } catch (err) {
    console.error(err);
  }
}

async function consultarEstudiantes() {
  try {
    const res = await client.query('SELECT * FROM estudiantes');
    console.log('Registro actual:', res.rows);
  } catch (err) {
    console.error(err);
  }
}

async function consultarEstudiantePorRut(rut) {
  try {
    console.log(`Consultando estudiante con RUT: ${rut}`);
    const res = await client.query('SELECT * FROM estudiantes WHERE rut = $1', [rut]);
    console.log('Resultado de la consulta:', res.rows);
  } catch (err) {
    console.error(err);
  }
}

async function actualizarEstudiante(nombre, rut, curso, nivel) {
  try {
    const res = await client.query(
      'UPDATE estudiantes SET nombre = $1, curso = $2, nivel = $3 WHERE rut = $4 RETURNING *',
      [nombre, curso, nivel, rut]
    );
    console.log(`Estudiante ${nombre} editado con éxito`);
  } catch (err) {
    console.error(err);
  }
}

async function eliminarEstudiante(rut) {
  try {
    const res = await client.query('DELETE FROM estudiantes WHERE rut = $1 RETURNING *', [rut]);
    console.log(`Registro de estudiante con rut ${rut} eliminado`);
  } catch (err) {
    console.error(err);
  }
}

const [operation, ...args] = process.argv.slice(2);

switch (operation) {
  case 'nuevo':
    agregarEstudiante(args[0], args[1], args[2], args[3]);
    break;
  case 'consulta':
    consultarEstudiantes();
    break;
  case 'rut':
    consultarEstudiantePorRut(args[0]);
    break;
  case 'editar':
    actualizarEstudiante(args[0], args[1], args[2], args[3]);
    break;
  case 'eliminar':
    eliminarEstudiante(args[0]);
    break;
  default:
    console.log('Operación no reconocida');
}

/*
Comandos para interactuar con la aplicación:

1. Agregar un nuevo estudiante:
   node index.js nuevo 'Nombre Estudiante' '12.345.678-9' curso nivel
   Ejemplo:
   node index.js nuevo 'Brian May' '12.345.678-9' guitarra 7

2. Consultar todos los estudiantes registrados:
   node index.js consulta

3. Consultar un estudiante por RUT:
   node index.js rut '12.345.678-9'

4. Actualizar la información de un estudiante:
   node index.js editar 'Nombre Estudiante' '12.345.678-9' curso nivel
   Ejemplo:
   node index.js editar 'Brian May' '12.345.678-9' guitarra 10

5. Eliminar el registro de un estudiante:
   node index.js eliminar '12.345.678-9'
*/
