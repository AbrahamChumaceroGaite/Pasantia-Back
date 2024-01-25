const mysql = require("mysql2");

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOSTCOOLIFYP,
  port: process.env.DB_PORTCOOLIFY,
  user: process.env.DB_USERCOOLIFY,
  password: process.env.DB_PASSWORDCOOLIFY,
  database: process.env.DB_DATABASECOOLIFY

  /* host: 'clpa0zf8z010rpmcgi4he4a5m',
  user: 'clpa0zf8x0wd4cgpmhfdgfwkm',
  password: 'S2XSJ5zhGrBigO37DjNVgpr8',
  database: 'dbo' */
});

//Actualizar la encryptacion para las contraseñas del anterior backend

/* connection.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    const query = `SELECT Id, Password FROM User`;
    connection.query(query, (error, results) => {
      if (error) throw error;
    
      // Recorrer los resultados y actualizar las contraseñas con bcrypt
      results.forEach(row => {
        // Encriptar la contraseña con bcrypt
        const hashedPassword = bcrypt.hashSync(row.Password, 10);
    
        // Actualizar la contraseña en la base de datos
        const updateQuery = `UPDATE User SET Password = ? WHERE Id = ?`;
        connection.query(updateQuery, [hashedPassword, row.Id], (updateError, updateResults) => {
          if (updateError) throw updateError;
          console.log(`Contraseña actualizada para el usuario con ID ${row.Id}`);
        });
      });
    
      // Cerrar la conexión a la base de datos
      connection.end();
    });
}); */

module.exports = {connection};
