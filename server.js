const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;

// const userRoutes = require('./routes/userRouter')
// app.use('/login',userRoutes)

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());


// import db
const db = require("./db");

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});

// authentication 
const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

// user route
const userRoutes = require('./Backend/routes/UserRouter');
app.use('/api/users',userRoutes);

// healthprofile route
const healthProfile = require('./Backend/routes/healthProfileRoutes');
app.use('/health', healthProfile); 


// appointment route
const appointmentRoutes = require('./Backend/routes/appoinmentRoute');
app.use('/api/appointments',appointmentRoutes);

// community route
const communityRoutes = require('./Backend/routes/communityRoutes');
app.use('/community',communityRoutes);

// pregnancyRisk route
const pregnancyRoutes = require('./Backend/routes/PregnancyRiskRouter');
app.use("/api",pregnancyRoutes);


app.listen(PORT,()=>{
    console.log(`Server is listening to ${PORT}`);
});