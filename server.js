const express = require('express'); // for midileWare 
const bodyParser = require('body-parser'); // carch the request transformer
const cors = require('cors'); //
const server = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
require('dotenv').config()


const db =require("./database/db") // connect the database
const auth = require("./controller/authController")

// Connect to the database
server.use(cors()); // for using the express
server.use(bodyParser.json());





// Helper function to execute SQL queries
function query(sql, values) {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  

// user leave form

// register user ..

const secretKey =  process.env.JWT_SECRET_KEY

server.post('/api/users/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists
      const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
      const existingUser = await query(checkUserQuery, [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash  password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the database
      const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      await query(insertUserQuery, [name, email, hashedPassword]);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: ' server error' });
    }
  });
  

//   login user 
server.post('/api/users/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
      const user = await query(checkUserQuery, [email]);
  
      if (user.length === 0) {
        return res.status(401).json({ message: 'Invalid user' });
      }
  
      // Compare the  password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid invalid' });
      }
  
      // JWT token
      const token = jwt.sign({ userId: user[0].id }, secretKey, { expiresIn: '1h' });
  
      res.status(200).json({ email, token, message:"Login Success" });
  

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  






  

// get all user 
  server.get("/api/users", (req,res) => {
    var sql = 'SELECT * FROM users';
    db.query(sql, function(error, result){
        if(error){
            console.log("not found!")
        }else{
            res.send({status:true, data:result})
        }
    })
})


// ******************************************************************************/


// connet the server which using port
server.listen(8080, function (error) {
  if (error) {
      console.log('Error:', error);
  } else {
      console.log("Server started on port 8000");
  }
});

