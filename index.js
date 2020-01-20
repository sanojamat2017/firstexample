var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var mysql = require('mysql');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sanoj'
});
// connect to database
dbConn.connect(); 

// default route
//www.domain.com
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

// Retrieve all users 
app.get('/information', function (req, res) {
    dbConn.query('SELECT * FROM customer', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Complete Data.' });
    });
});
// Retrieve user with id 
app.get('/mydata/:id', function (req, res) {
  
    let id = req.params.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide id' });
    }
  
    dbConn.query('SELECT * FROM customer where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Information by ID.' });
    });
  
});

// Add a new Record
app.post('/adduser', function (req, res) {
  
    let name = req.body.name;
    let address = req.body.address;
    let country = req.body.country;
    let phone = req.body.phone;
    let created_on = req.body.created_on;
    let updated_on = req.body.updated_on;
  console.log(name+" "+address+""+country+" "+""+phone+""+created_on+""+updated_on);
   // if (!name && !fname) {
        //return res.status(400).send({ error:true, message: 'Please provide Information to be add' });
    //}
  
    dbConn.query("INSERT INTO customer(name,address,country,phone,created_on,updated_on) values(?,?,?,?,?,?) ", [name,address,country,phone,created_on,updated_on], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Record has been added' });
    });
});
 
//  Update user with id
app.put('/update', function (req, res) {
  
    let id = req.body.id;
    let name = req.body.name;
    let fname = req.body.fname;
    if (!id || !name || !fname) {
        return res.status(400).send({ error: user, message: 'Please provide full information with id' });
    }
  
    dbConn.query("UPDATE info SET name = ?, fname= ? WHERE id = ?", [name, fname, id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'data updated' });
    });
});

//  Delete user
app.delete('/deleteuser', function (req, res) {
  
    let id = req.body.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide id' });
    }
    dbConn.query('DELETE FROM customer WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User Data has been deleted' });
    });
}); 
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;