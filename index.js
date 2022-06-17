import express from "express";
import cors from "cors";
import router from "./route.js";

// Create node.js server with express

const app = express();
app.use(express.json());
app.use(cors());

// Import routes

app.use("/api/v1", router);

app.listen(9500, () => {
  console.log("Server started on port 3000");
});
