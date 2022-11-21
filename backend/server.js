// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
// configuration ===========================================
// set port
var port = process.env.PORT || 8080;
// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
//mongodb://localhost/mylib
//mongoose.connect('mongodb+srv://pinned:pinned@cluster0.di3g9.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://rishdeore44:Mongo4321@cluster0.7wbiwhk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true },(err)=>{
if(!err){
    console.log('MongoDB connection succeeded : ' + err);
}
else{
    console.log('MongoDB connection failed : ' + err);

}
});


//mongoose.connect('mongodb+srv://rishdeore44:Mongo4321@cluster0.7wbiwhk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
app.use(express.json());
// routes ==================================================
require('./app/route')(app); // configure our routes
// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);
// shoutout to the user
console.log('App started at port ' + port);
// expose app
exports = module.exports = app;