const dotenv=require("dotenv");
const express=require("express");
const app=express();
const cors=require("cors");
const db=require("./config/db");
dotenv.config({path:"./config/config.env"});
app.use(cors());
app.use(express.static("./public"));
db(app);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(require("./controller/user"));
app.use(require("./controller/admin"));
module.exports=app;




