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



//CONNECTION TO THE SERVER
var server = app.listen(3000,function(){
  console.log("server started on 3000");
});
