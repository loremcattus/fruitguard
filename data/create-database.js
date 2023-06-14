import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config(); // Cargar variables de entorno de archivo .env

// Obtener las variables de entorno
const {
  HOST: host,
  DB_NAME: database,
  DB_USERNAME: user,
  DB_PASSWORD: password,
  DB_CHARSET: charset = 'utf8mb4',
} = process.env;

// Crear la conexión de MySQL
const connection = mysql.createConnection({ host, user, password });

try {
  await connection.promise().query(`DROP DATABASE IF EXISTS \`${database}\`;`);
  console.log(`Database '${database}' was dropped or did not exist.`);

  await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET \`${charset}\`;`);
  console.log(`Database '${database}' was created`);
} catch (error) {
  throw console.error(`There was an error creating the database '${database}':`, error);
} finally {
  connection.end();
}
