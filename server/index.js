import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import './middleware/passport.js';
import memoryRoutes from './routes/memoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config(); // load environment variables from a .env file into process.env

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json());                             // parse incoming request bodies in a middleware before your handlers, available under the req.body property
const allowedOrigins = [
  "http://localhost:3000",           // Local development
  "http://localhost:5173",           // Vite alternative
  process.env.FRONTEND_URL,           // Production frontend URL from env variable
  "https://flash-backs.vercel.app"    // Current deployed frontend origin
];
app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));  // allow requests from the React app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize()); // initialize the passport middleware

app.use('/auth', authRoutes);
app.use('/memories', memoryRoutes);
app.use('/user', userRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

