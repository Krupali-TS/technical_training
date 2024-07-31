import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://krupaliyadav:sf5n60Ya6sNCTE9D@cluster0.u7fz4su.mongodb.net/"
  )
  .then(()=>{
    app.listen(3006, () => {
      console.log("app is running on port 3002...");
    });
  }).catch((err) => {console.log(err);}
)
  


