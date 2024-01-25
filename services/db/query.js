const { connection} = require('./db');

function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    if (!connection) {
      console.log('Error: La conexión no está establecida.');
      reject('Error: La conexión no está establecida.');
      return;
    }

    connection.query(query, values, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}


module.exports = {
  queryDatabase
};