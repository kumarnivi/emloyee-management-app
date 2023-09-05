const express = require('express'); // for midileWare 
const bodyParser = require('body-parser'); // carch the request transformer
const cors = require('cors'); //
const server = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const db =require("./database/db") // connect the database
const auth = require("./controller/authController")

// Connect to the database
server.use(cors()); // for using the express
server.use(bodyParser.json());




// connet the server which using port
server.listen(3000, function (error) {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log("Server started on port 3000");
    }
});




// Create a user
server.post('/api/student/add', (req, res) => {
    try {
        let details = {
            name: req.body.name,
            email: req.body.email,
            phonenum: req.body.phonenum,
        };

        // Add to the database
        let sql = "INSERT INTO student SET ?";
        db.query(sql, details, (error, results) => {
            if (error) {
                console.log('Error inserting data:', error);
                res.status(500).json({ status: false, message: "Failed to insert data" });
            } else {
                console.log('Data inserted successfully');
                res.status(200).json({ status: true, message: "Data inserted successfully" });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: false, message: "An error occurred while processing your request" });
    }
});



// view the user 
server.get("/api/student", (req,res) => {
    var sql = 'SELECT * FROM student';
    db.query(sql, function(error, result){
        if(error){
            console.log("not found!")
        }else{
            res.send({status:true, data:result})
        }
    })
})

// get the single data 

server.get("/api/student/:id", (req,res) => {
  var studentid = req.params.id;
  var sql = 'SELECT * FROM student WHERE id=' + studentid;
  db.query(sql, function(error, result){
    if(error) {
        console.log("error connecting for the db search")
    } else {
        res.send({status:true, data: result})
    }
  }) 
})


// udate the user data 
server.put("/api/student/update/:id", (req, res) => {
    let sql =
      "UPDATE student SET name='" +
      req.body.name +
      "', email='" +
      req.body.email +
      "',phonenum='" +
      req.body.phonenum +
      "'  WHERE id=" +
      req.params.id;
 
    let a = db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "Student Updated Failed" });
      
      } else {
        res.send({ status: true, message: "Student Updated successfully" });
      }
    });
  });

// delete the user 
server.delete("/api/student/delete/:id", (req,res) => {
    let sql = "DELETE FROM student WHERE id=" +
    req.params.id + "";
    let query = db.query(sql, (error) => {
        if(error) {
            res.send({status: false , message:"deleted failed"})
        } else{
            res.send({status:true, message:"deleted Successfully"})
        }
    })
});

/**********************************************************************************************************/

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

const secretKey = 'https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.bQTnz6AuMJvmXXQsVPrxeQNvzDkimo7VNXxHeSBfClLufmCVZRUuyTwJF311JHuh';

server.post('/api/users', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists
      const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
      const existingUser = await query(checkUserQuery, [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash and salt the password
      const hashedPassword = await bcrypt.hash(password, 8);
  
      // Insert user into the database
      const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      await query(insertUserQuery, [name, email, hashedPassword]);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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
  
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid invalid' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user[0].id }, secretKey, { expiresIn: '1h' });
  
      res.status(200).json({ email, token });
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
