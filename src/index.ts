import "dotenv/config"; /// to load the environment variables from the .env file
// 1. Import necessary modules
import express from "express";
import TodoRoutes from "./Routes/Todos";
import AuthRoutes from "./Routes/Auth"; // 1. Import the Auth routes
import CategoryRoutes from "./Routes/categories"; // import category routes
/// import cors
import cors from "cors";
// 2. Create an instance of the express application
const app = express();

// use cors
app.use(cors());

// 3. Use middleware to parse JSON request bodies
app.use(express.json());

// 4. Define a simple route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Express server!",
  });
});
app.use("/auth", AuthRoutes); // 2. Use the Auth routes
app.use("/todos", TodoRoutes);
app.use("/categories", CategoryRoutes); // use category routes

// 5. Start the server and listen on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
// 6. Export the app instance for testing or further configuration
export default app;
