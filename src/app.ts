import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
import chatRouter from './routes/chatRoutes';
import messageRouter from './routes/messageRoutes';
import feedbackRouter from './routes/feedbackRoutes';
// import expenseRouter from './routes/expenseRoutes';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(helmet()); // Set secure HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow cross-origin resource sharing
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for requests from other origins
app.use(morgan("common")); // Log HTTP requests
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data

/* ROUTES */
app.get("/hello", (req, res) => {
  res.send("Hello from server");
});

app.use("/users", userRouter); // https://localhost:8000/users
app.use("/events", eventRouter);
app.use('/chats', chatRouter); 
app.use('/messages', messageRouter); 
app.use('/feedback', feedbackRouter); 
// app.use('/expenses', expenseRouter); // https://localhost:8000/expenses

export default app;
