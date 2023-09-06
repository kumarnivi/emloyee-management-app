const express = require('express'); // for midileWare 
const bodyParser = require('body-parser'); // carch the request transformer
const server = express();

const db =require("./database/db") // connect the database


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
