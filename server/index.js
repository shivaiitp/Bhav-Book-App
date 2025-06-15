import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import journalRoutes from "./routes/journal.route.js";
import firebaseAuthRoutes from "./routes/firebase.route.js";
import insightRoutes from "./routes/insight.route.js";
import searchRoutes from "./routes/search.route.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configure CORS
const allowedOrigins = ['https://bhav-book.vercel.app', 'http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // only if using cookies/auth headers
};

// ✅ Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Emotion Journal API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth/firebase", firebaseAuthRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/search", searchRoutes);

// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
