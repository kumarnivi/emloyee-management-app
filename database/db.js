
const mysql = require('mysql'); //database




 const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root0",
    database: "mydb",

});


// this is just only checked the connect db
db.connect(function (error) {
    if (error) {
      console.log("Error Connecting to DB", error);
    } else {
      console.log("successfully Connected to DB");
    }
  });

module.exports = db;