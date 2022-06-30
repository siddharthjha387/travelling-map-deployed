require('dotenv').config()

const express=require('express');
const mongoose=require('mongoose');
const pinRoute=require('./routes/pins')
const userRoute=require('./routes/users')
const path=require('path');

const app=express();

app.use(express.json());

const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log("Database connected");
}).catch((err)=>{console.log(err);});


app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
    // app.get('*', function(req, res) {
    //   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    // });
  }

app.listen(process.env.PORT||8800,()=>{
    console.log("Server Started");
})