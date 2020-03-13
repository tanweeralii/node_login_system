var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
var {google} = require('googleapis');
const TOKEN_PATH = 'token.json';
const fs = require('fs');
const readline = require('readline');


const googleConfig = {
  clientId: '', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: '', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: '' // this must match your google api settings
};

const defaultScope = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/Login',function(req,res){
	res
		.status(200)
		.sendFile(path.join(__dirname,"Login.html"));
});

app.get('/Register', function(req,res){
	res
        .status(200)
        .sendFile(path.join(__dirname,"Register.html"));
});

app.post('/Register',function(req,res){
	MongoClient.connect('mongodb://127.0.0.1:27017', function(err,client){
        if (err) throw err;
		var db = client.db('g');
		db.collection("users").find({"email":req.body.email}).toArray(function(err,result){
			if(result!=""){
				var message = "Email already exists!";
				var ok = "false";
			}
			else{
				if(req.body.email=='' || req.body.first_name==''){
                  	var message = "Email or First name cannot be empty!";
                   	var ok = "false";
           		}	
				else{
                    if(req.body.password==req.body.confirm_password){
                       	if(req.body.password.length<=15 && req.body.password.length>=8){
                        	var doc = { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password};
                       		db.collection("users").insertOne(doc, function(err, res) {
                           	if (err) throw err
                   		    });
                            var message = "Document Inserted";
                            var ok = "true";
                       	}
                       	else{
                           	var message = "Password length should be between 8 and 15!";
                           	var ok = "false";
                   		}
                    }
                    else{
                   		var message = "Passwords not matching!";
                  		var ok = "false";
                    }
				}
            }
			data = new Object();
			data.message = message;
    		data.ok = ok;
    		var str = JSON.stringify(data);
    		res.send(str);
            client.close();
		});
	});
});

app.post('/Login',function(req,res){
    MongoClient.connect('mongodb://127.0.0.1:27017', function(err,client){
        if (err) throw err;
        var db = client.db('g');
        db.collection("users").find({"email":req.body.email}).toArray(function(err,result){
            if(result!=""){
                if(req.body.password==result[0].password){
                    var message = "Success!";
                    var ok = "true";
                }
                else{
                    var message = "Wrong Password!";
                    var ok = "false";
                }
            }
            else{
                var message = "Email does not exists!";
                var ok = "false";
            }
            data = new Object();
            data.message = message;
            data.ok = ok;
            var str = JSON.stringify(data);
            res.send(str);
            client.close();
        });
    });
});

app.post('/check_email',function(req,res){
    MongoClient.connect('mongodb://127.0.0.1:27017', function(err,client){
        if (err) throw err;
        var db = client.db('g');
        db.collection("users").find({"email":req.body.email}).toArray(function(err,result){
           if(result!=""){
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var result1 = "";
                for ( var i = 0; i < 8; i++ ) {
                    result1 += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                console.log(result1);
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'tanweerali955761@gmail.com',
                    pass: '89r1hfhm'
                  }
                });
                var mailOptions = {
                  from: 'tanweerali955761@gmail.com',
                  to: req.body.email,
                  subject: 'Reset Password',
                  text: result1
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
                var encoded = Buffer.from(result1).toString('base64');
                var message = "Email exists";
                var ok = "true";
           }
           else{
                if(req.body.email==""){
                    var message = "Field cannot be empty!";    
                }
                else{
                    var message = "Email doesnt exists!";
                }
                var ok = "false";        
           }
            data = new Object();
            data.message = message;
            data.ok = ok;
            data.encode = encoded;
            var str = JSON.stringify(data);
            res.send(str);
            client.close(); 
        });
    });
});

app.post('/set_password',function(req,res){
    MongoClient.connect('mongodb://127.0.0.1:27017',function(err,client){
        if(err) throw err;
        console.log(req.body);
        var db = client.db('g');
        db.collection("users").find({"email":req.body.email}).toArray(function(err,result){
            if(err) throw err;
            if(req.body.password==req.body.confirm_password){
                if(req.body.password.length<=15 && req.body.password.length>=8){
                    db.collection("users").update(
                        {"email" : req.body.email},
                        {$set: { "password" : req.body.password}}
                    );
                    var message = "Done";
                    var ok = "true";
                }
                else{
                    var message = "Password length should be between 8 and 15!";
                    var ok = "false";
                }
            }
            else{
                var message = "Passwords not matching!";
                var ok = "false";
            }
            data = new Object();
            data.message = message;
            data.ok = ok;
            var str = JSON.stringify(data);
            res.send(str);
            client.close();
        });
    });
});

app.post('/google',function(req,res){
    function createConnection() {
      return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
      );
    }

    function getConnectionUrl(auth) {
      return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: defaultScope
      });
    }

    var auth = createConnection();
    var url = getConnectionUrl(auth);
    res.send(url);
})

app.post('/code',function(req,res){
    var url = new URL(req.body);
    var code = url.searchParams.get('code');
    function getGooglePlusApi(auth) {
      return google.gmail({ version: 'v1', auth });
    }


    function createConnection() {
      return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
      );
    }

    function getGoogleAccountFromCode(code) {
        const auth = createConnection(); 
          // get the auth "tokens" from the request
        const data = auth.getToken(code, (err, token) => {
            if (err) return console.error('Error retreiving access token', err);
            auth.setCredentials(token);
        });
          
        // add the tokens to the google api so we have access to the account  
          // connect to google plus - need this to get the user's email
        const plus = getGooglePlusApi(auth);
        const me = gmail.users.labels.list({ userId: 'me' });
          
          // get the google id and email
        const userGoogleId = me.data.id;
        const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;

        var response = new Object();
        response.id = userGoogleId;
        response.email = userGoogleEmail;
        response.tokens = tokens;
          // return so we can login or sign up the user
        var str = JSON.stringify(response);
        res.send(str);
    };
    var ans = getGoogleAccountFromCode(code);
    console.log(ans);
    res.send(ans);
})

var server = app.listen(5000,function(){
	console.log("Server started..");
})
