/* IMPORT ALL NODE MODULES
*/

//CORE NODE MODULES
var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

//PARSE ALL FORM DATA
app.use(bodyParser.urlencoded({extended: true}));

//USED FOR FORMATTING DATE
var dateFormat = require('dateformat');
var now = new Date();

//TO PARSE VIEW ENGINE TEMPLATE(EJS)
app.set('view engine', 'ejs');
//app.set('Content-Type', 'text/css');

//IMPORT ALL JS AND CSS FILES FOR THE PROJECT
app.use(express.static('resources'))

//MYSQL DATABASE CONNECTION
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_crud"
});

//GLOBAL SITE TITLE AND BASE URL
const siteTitle = "Nodejs CRUD app";
const baseURL ="http://localhost:3000/";

/**
  * when page is loaded
  *default page is loaded and the data is being called from mysql database
  *we are also adding some js and css files
  *for all the dependencies---see the package.json file for more info
**/

app.get('/', function(req, res){

  con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function(err, result){
    res.render('pages/index',{
      siteTitle : siteTitle,
      pageTitle : "NODEJS CRUD APP",
      items : result
    });
  });
});

//THIS OPEN THE FORM/PAGE TO CREATE/ADD A NEW EVENT
app.get('/event/add', function(req, res){

  //con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function(err, result){
    res.render('pages/add_event.ejs',{
      siteTitle : siteTitle,
      pageTitle : "NODEJS CRUD APP",
      items : ''
  //  });
  });
});


/*
	TO INSERT DATA FROM THE FORM TO THE DATABASE
  THIS IS A POST METHOD TO DATA AND PRE-POPULATE TO THE FORM
*/

app.post('/event/add',function(req,res){
	/* get the record base on ID */
  var query ="INSERT INTO `e_events` (e_name,e_start_date,e_end_date,e_desc,e_location) VALUES (";
        	query += " '"+req.body.e_name+"',";
        	query += " '"+dateFormat(req.body.e_start_date,"yyyy-mm-dd")+"',";
        	query += " '"+dateFormat(req.body.e_end_date,"yyyy-mm-dd")+"',";
        	query += " '"+req.body.e_desc+"',";
        	query += " '"+req.body.e_location+"')";

    con.query(query, function (err, result) {
	     res.redirect(baseURL);
    });
});


// TO EDIT EVENT
app.get('/event/edit/:id', function(req, res){
  /* get the event list base on id*/

  con.query("SELECT * FROM e_events WHERE id = '"+ req.params.id + "'", function(err, result){

	//format the date

result[0].e_start_date = dateFormat(result[0].e_start_date,"yyyy-mm-dd");
result[0].e_end_date = dateFormat(result[0].e_end_date,"yyyy-mm-dd");

    res.render('pages/edit_event',{
      siteTitle : siteTitle,
      pageTitle : "NODEJS CRUD APP. Editing... :" + result[0].e_name,
      items : result
    });
  });
});


//TO UPDATE THE DATABASE
app.post('/event/edit/:id', function(req, res){
	/* get the record base on ID */
  var query = "UPDATE `e_events` SET";
        	query += " `e_name` = '"+req.body.e_name+"',";
        	query += " `e_start_date` = '"+req.body.e_start_date+"',";
        	query += " `e_end_date` = '"+req.body.e_end_date+"',";
        	query += " `e_desc` = '"+req.body.e_desc+"',";
        	query += " `e_location` = '"+req.body.e_location+"'";
          query += " WHERE `e_events`.`id` = "+req.body.id+"";

    con.query(query, function (err, result) {
      if(result.affectedRows){
        res.redirect(baseURL);
      }
    });
});


//CONNECTION TO THE SERVER
var server = app.listen(3000,function(){
  console.log("server started on 3000");
});
