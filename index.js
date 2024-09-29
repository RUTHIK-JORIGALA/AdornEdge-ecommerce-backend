
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors')
const authRouter = require('./routes/auth/auth-routes')
const dotenv = require('dotenv');
dotenv.config();
const adminProductsRouter = require('./routes/admin/products-routes')


// Mongo DB connection
mongoose.connect(process.env.MongoURL)
    .then(()=> console.log("MongoDB connected successfully"))
    .catch( () => console.log("Error connecting to mongoDB"))

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders : [
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
)

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", authRouter)
app.use('/api/admin/products', adminProductsRouter)


app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`))