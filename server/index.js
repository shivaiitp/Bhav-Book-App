import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import insightRoutes from "./routes/insight.route.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import journalRoutes from "./routes/journal.route.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Emotion Journal API is running...");
});
app.use("/api/auth", authRoutes); 
app.use("/api/journals", journalRoutes);
app.use('/api/insights', insightRoutes);

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
