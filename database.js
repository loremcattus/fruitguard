const mysql = require('mysql2/promise');
const fs = require('fs');
const mariadb = require('mariadb');
const dotenv = require('dotenv');

const prueba = fs.readFileSync('data/scrip.sql').toString();
const sql = fs.readFileSync('data/Script_fly_db.sql').toString();
const sqlInserts = fs.readFileSync('data/Script_inserts_fly_db.sql').toString();

dotenv.config();
// Configura las opciones de conexión a la base de datos
const host = process.env.HOST;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const connectionOptions = {
  host,
  user,
  password,
  charset: 'utf8mb4'
};

const pool = mariadb.createPool({
  host,
  user,
  password,
  database,
  multipleStatements: true
});

// Crea una conexión temporal a la base de datos sin seleccionar una base de datos específica
mysql.createConnection(connectionOptions)
.then(connection => {
    // Ejecuta el comando CREATE DATABASE si no existe
    const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4;`;
    return connection.query(createDatabaseSql);
})
.then(() => {
    console.log('Base de datos creada exitosamente');
    pool.query(sql)
    .then(result => {
        console.log(result);
        console.log('Tablas creadas y pobladas exitosamente');
    })
    .catch(error => {console.log(error);});
})

.catch(error => {
    console.error('Error al crear la base de datos:', error);
});