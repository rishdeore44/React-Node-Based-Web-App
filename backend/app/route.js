// app/routes.js
// grab the nerd model we just created
var Sample = require('./models/sample');
const bcrypt = require('bcrypt');
const cors = require('cors');

module.exports = function (app) {
    app.use(cors());
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
    // sample api route

    /*  var Db = require('mongodb').Db,
     MongoClient = require('mongodb').MongoClient,
     Server = require('mongodb').Server;
 
     var db = new Db('test', new Server('localhost', 27017)); */

    app.post('/user/login', function (req, res) {
        let email = req.body.email;
        let password = req.body.password;
        if(email===''||email===undefined||email===null || password===''||password===undefined||password===null){
            res.send({ response: 'Please enter some values' });

        }
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        console.log("Password is" + password);

        Sample.find({ email: email }, (error, data) => {
            if (data && data.length!=0) {
                console.log("This is found user " + data);
                let hash = data[0].password;
                console.log("Hash is " + hash);
                bcrypt.compare(password, hash, (err, result) => {
                    if (err) {
                        console.log("Error occured " + err);
                        alert("Login Unsuccessful");
                        reject(err.message);
                        return;
                    }
                    else {
                        console.log("Result is " + result);
                        //resolve(result);
                        if (result) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].email === email) {
                                    console.log("Match Found");
                                    //res.json({ response: 'User Logged in Successfully' });
                                    res.send({ response: 'SUCCESS' });
                                    //return true;
                                }
                                else {
                                    console.log("Match NOT Found");
                                }
                            }
                        }

                        else {
                            res.send({ response: 'FAILURE' });

                        }

                    }

                });
            }
            else{
                res.send({ response: 'FAILURE' });
            }
            if (error)
                res.send(err);
        });

    });
    /*  function lookForExistingRecord(fullname, email) {
         Sample.find({ fullname: fullname, password: password }, (error, data) => {
             if (data) {
                 console.log("This is found user " + data);
 
                 for (var i = 0; i < data.length; i++) {
                     if (data[i].email === email) {
                         console.log("Match Found");
                         return true;
                     }
                 }
                 return false;
             }
             if (error)
                 res.send(err);
         });
 
     } */

    function validate(req, res) {

        var status = true;
        regExEmail = /([\w\.]+)@([\w\.]+)\.(\w+)/;

        var fullname = req.body.fullname;
        var email = req.body.email;
        var password = req.body.password;

        if (fullname == "" || email == "" || password == "") {
            res.send("FullName or Email or Password cannot be empty!");
            status = false;
        }
        if (!email.match(regExEmail)) {
            res.send(email + " should be in proper format!");
            status = false;
        }
        if (password.length < 8) {
            res.send("Password should be atleast 8 characters long!");
            status = false;
        }
        return status;

    }

    app.post('/user/create', function (req, res) {
        var status = validate(req, res);
        console.log(req.body);

        if (status) {
            let email = req.body.email;
            let user = false;
            Sample.find({ email: email }, (error, data) => {
                if (data) {
                    console.log("This is found user " + data);

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].email === email) {
                            console.log("Match Found");
                            user = true;
                        }
                    }
                }

                console.log("value of user is " + user);
                if (user) {
                    //displayMessage = 'That user already exists!';
                    console.log('That user already exists!')
                    res.json({ response: 'That user already exists!' });
                }
                else {
                    var rec = new Sample(req.body);
                    rec.save(function (err, n) {
                        if (err) {
                            // displayMessage = 'Saving Failed' + " " + err;
                            console.log('Saving Failed' + " " + err);
                            res.json({ response: 'Saving Failed' + " " + err });

                        }
                        else {
                            //displayMessage = 'Record saved ' + n;
                            console.log('Recored Saved');
                            res.json({ response: 'Recored Saved Successfully' });

                        }
                    });
                }


            });

            //user = lookForExistingRecord(req.body.email);

            //res.json({ response: displayMessage });
        }
    });

    app.get('/user/getAll', function (req, res) {
        //cryptPass("xxx");
        Sample.find(function (err, samples) {
            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);
            console.log('samples', samples);
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.json(samples);
        });
    });

    app.put('/user/edit', function (req, res) {
        //console.log("heloo!!!");
        var fullname = req.body.fullname;
        //console.log("fulll: "+fullname1);
        var email = req.body.email;
        var password = req.body.password;

        var request = req;

        Sample.find(function (err, req) {
            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            Sample.find({ email: email }, (error, data) => {
                if (data != "") {
                    console.log("Record found!\n" + data);
                    //var status = ;
                    if (validate(request, res)) {
                        Sample.findOneAndUpdate({ email: email }, { fullname: fullname, password: password }, (error, data) => {
                            if (error) { res.send(err); } else {
                                res.send("Record modified successfully!\n" + data);
                            }
                        });
                    }
                } else {
                    console.log("Record not found!");
                }
            });
        });
    });

    app.delete('/user/delete', function (req, res) {
        var email = req.body.email;
        //const found= db.inventory.find( { email: { $exists: true, email } } )
        //var collection = db.collection("samples");
        let user = false;
        Sample.find({ email: email }, (error, data) => {
            if (data) {
                console.log("This is found user " + data);

                for (var i = 0; i < data.length; i++) {
                    if (data[i].email === email) {
                        console.log("Match Found");
                        user = true;
                    }
                }
            }
            console.log("value of user is " + user);

            if (user) {
                Sample.deleteMany({ email: email }, (error, data) => {
                    if (error) {
                        res.send("Record not deleted!\n" + err);
                    } else if (data) {
                        res.send("Record deleted successfully!\n" + JSON.stringify(data));
                    }

                });
            }
            else {
                res.send("No record exists to delete!\n" + data);
            }
        });

    });
}