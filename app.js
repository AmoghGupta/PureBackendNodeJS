const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const multer = require("multer");
const feedRoutes = require("./routes/feed");
const AuthRoutes = require("./routes/auth");
const isAuthorized = require("./middlewares/is-auth");
const mongoDB = require("./utils/database");

const fileStorage  = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'images');
    },
    fileName: (req, file, cb)=>{
        cb(null,new Date().toISOString()+'-'+file.originalname);
    }
});
const fileFilter = (req, file, cb)=>{
   if(file.mimetype =="image/png" ||file.mimetype ==="image/jpg"|| file.mimetype ==="image/jpeg"||
   file.mimetype ==="image/svg" ){
    cb(null, true);
   }else{
    cb(null, false);
   }
};


/** STATIC/PUBLIC FILES MIDDLEWARE */
/** any kind of file requests are directly searched in public folder 
 * if a match is found in the public folder it returns that file
 * thats why we just need /css/main.css instead of public/css/main.css
 */
app.use(express.static(path.join(__dirname, "public")));

// indicates that all requests having /images are checked here
app.use('/images',express.static(path.join(__dirname, "images")));

/** BODY PARSER MIDDLEWARE */
// support parsing of application/json type post data
// app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'));


/** MIDDLEWARE which will update res header and allow cross domain requests, 
 * along with allowed functions and allowed headers (here we are allowing user to set content type header)*/
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    //allows to move to next middleware
    next();
})

/** CREATED AN AUTHENTICATION CUSTOM MIDDLEWARE */
/** IF not Authorized Requests will not be allowed to execute */
app.use(isAuthorized.isAuthenticated);


/** ROUTES MIDDLEWARE */
app.use('/auth', AuthRoutes);
app.use('/feed', feedRoutes);


mongoDB.mongoConnect(()=>{
    // once we are connected to DB then start a server 
    app.listen(8080);
});



/** STATUS CODES */
/**
 * 200: response ok
 * 201: success (we created a resource)
 * 422: failed validation
 */